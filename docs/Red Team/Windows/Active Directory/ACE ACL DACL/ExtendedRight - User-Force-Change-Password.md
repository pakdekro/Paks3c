### 🐧 Depuis Linux

Pour changer le mot de passe d'un utilisateur depuis un environnement Linux, utilisez `rpcclient` comme suit :

```bash
rpcclient -U $monUser 10.10.10.192
setuserinfo2 $userCible$ 23 'password'
```

---
### 🍔 Depuis Windows

Depuis Windows, vous pouvez utiliser PowerShell et le module `ActiveDirectory` :

```powershell
Set-DomainUserPassword -Identity $userCible -AccountPassword (ConvertTo-SecureString '123456' -AsPlainText -Force) -Verbose
```

> **/!\\ Attention: penser à mettre un mot de passe qui soit en accord avec la politique de mot de passe du domaine, sinon celui-ci ne sera pas modifié (et suivant le contexte, aucun message d'erreur) /!\\**


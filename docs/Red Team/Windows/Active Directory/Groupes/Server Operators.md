Le rôle de "Server Operator" permet une administration partielle du serveur, mais sans les privilèges étendus d'un "Domain Admin". Ce groupe donne accès à divers privilèges, dont "SeBackupPrivilege" et "SeRestorePrivilege", et permet également de contrôler les services locaux du serveur.

### Privileges

- `SeBackupPrivilege`: Ce privilège permet de contourner la vérification des autorisations de fichier pour effectuer des opérations de sauvegarde.    
- `SeRestorePrivilege`: Ce privilège permet de contourner la vérification des autorisations de fichier pour effectuer des opérations de restauration.  

### Vérifier l'utilisateur sous lequel un service est lancé

#### Pour vérifier les détails de configuration d'un service, y compris l'utilisateur sous lequel il est exécuté :

```cmd
sc qc $NomDeLapp # Remplacez $NomDeLapp par le nom du service que vous voulez inspecter
```

### Modifier le binaire exécuté par un service

#### Si vous voulez changer le binaire que le service exécute lors de son démarrage :

```cmd
sc config $NomDeLapp binPath= "cmd /c net localgroup Administrators server_adm /add" # Remplacez $NomDeLapp et server_adm par les valeurs appropriées`
```

**Note**: Faites attention lors de la modification du chemin du binaire d'un service. Une mauvaise configuration peut rendre le service ou même le serveur inutilisable.
### Arrêter et démarrer un service

#### Pour arrêter un service

```cmd
sc stop $NomDeLApp # Remplacez $NomDeLApp par le nom du service que vous voulez arrêter
```

#### Pour démarrer un service

```cmd
sc start $NomDeLApp # Remplacez $NomDeLApp par le nom du service que vous voulez démarrer
```

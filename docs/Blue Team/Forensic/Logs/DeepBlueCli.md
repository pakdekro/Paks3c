### Analyse de Journaux d'Événements

#### Analyser un journal d'événements spécifique

```powershell
.\DeepBlue.ps1 .\chemin\vers\le\fichier\journal.evtx`
```

#### Analyser un journal d'événements depuis un serveur distant

```powershell
Get-WinEvent -LogName Security -ComputerName ServeurDistant | .\DeepBlue.ps1
```

#### Analyser des journaux d'événements en temps réel

```powershell
Get-WinEvent -LogName Security -MaxEvents 100 | .\DeepBlue.ps1
```

#### Analyser les derniers événements d'un journal

```powershell
Get-WinEvent -LogName Security -MaxEvents 100 | .\DeepBlue.ps1
```
### Analyse Spécifique

#### Analyser pour des commandes PowerShell suspectes

```powershell
.\DeepBlue.ps1 -log PowerShell
```

#### Analyser pour des activités suspectes dans les journaux de sécurité

```powershell
.\DeepBlue.ps1 -log Security
```

#### Analyser pour des processus suspects dans les journaux de système

```powershell
.\DeepBlue.ps1 -log System
```

#### Analyser pour des activités suspectes dans les journaux d'application

```powershell
.\DeepBlue.ps1 -log Application
```
### Filtrage et Recherche

#### Analyser en filtrant par ID d'événement

```powershell
.\DeepBlue.ps1 -log Security | Where-Object { $_.Id -eq 4625 }`
```

#### Recherche de termes spécifiques dans les résultats

```powershell
.\DeepBlue.ps1 -log Security | Select-String -Pattern "terme_recherché"
```
### Exportation des Résultats

Exporter les résultats dans un fichier

```powershell
.\DeepBlue.ps1 -log Security | Out-File -FilePath .\resultats_analyse.txt
```


#### Identifier des problèmes de permissions sur des services

```powershell
.\SharpUp.exe audit
```

#### Winpeas

```powershell
.\WinPeas.exe
```

#### Voir le statut de Windows Defender

```powershell
Get-MpComputerStatus
```

#### Lister les règles AppLocker

```powershell
Get-AppLockerPolicy -Effective | select -ExpandProperty RuleCollections
```

#### Savoir si powershell est en "Constrained Language Mode" ou en "Full language Mode"

```powershell
$ExecutionContext.SessionState.LanguageMode
```

> [!Attention]
> Le mode "constrained" va empêcher l'utilisation de certaines features de powershell.

#### Liste les process en cours

```powershell
tasklist /svc
```

#### Énumérer les variables d'environnement

```powershell
set
```

#### Énumérer les informations système

```powershell
systeminfo
```

#### Énumérer les différents patchs/updates appliqués

```powershell
wmic qfe
ou
Get-HotFix | ft -AutoSize
```

#### Lister les programmes installés

```powershell
wmic product get name
ou
Get-WmiObject -Class Win32_Product |  select Name, Version
```

#### Lister les services réseaux

```powershell
netstat -ano
```

#### Lister les users loggés

```powershell
query user
```

#### Énumérer les comptes utilisateur et les groupes

```powershell
net user
net localgroupe
```

#### Lister les informations à propos d'un groupe en particulier

```powershell
net localgroup $group
```

#### Creds hunting

```powershell
findstr /SIM /C:"password" *.txt *.ini *.cfg *.config *.xml *.bak
```

```powershell
gc 'C:\Users\htb-student\AppData\Local\Google\Chrome\User Data\Default\Custom Dictionary.txt' | Select-String password
```

```powershell
gci -Path . -recurse -ea SilentlyContinue -Include *.ini,*.cfg,*.txt
```

#### Lire historique powershell

```powershell
gc (Get-PSReadLineOption).HistorySavePath
```

#### Tenter de lire celui de tout les utilisateurs

```powershell
foreach($user in ((ls C:\users).fullname)){cat "$user\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt" -ErrorAction SilentlyContinue}
```

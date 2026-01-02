### Certificats

#### Signer un binaire avec un certificat

Besoin de signtool.exe : installer le SDK windows https://developer.microsoft.com/fr-fr/windows/downloads/windows-sdk/

```powershell
#On récupère le thumbprint du certificat
Get-ChildItem -Path Cert:\CurrentUser\My

$certThumbprint = "thumbprint"
$msiFile = "C:\chemin\du\fichier.msi"

signtool sign /fd SHA256 /sha1 $certThumbprint /tr http://timestamp.digicert.com /td SHA256 $msiFile
```
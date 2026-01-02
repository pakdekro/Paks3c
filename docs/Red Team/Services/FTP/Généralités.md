File Transfer Protocol, port 21, TCP Transfert de fichier, non sécurisé contrairement à ses différentes variantes (sFTP, etc), les données sont transmises en clair.

---
### Enumeration

#### Nmap:

```bash
nmap -A --script ftp* -p 21 $ip
```

#### connection via netcat :

```bash
nc -nv $ip 21
```

#### Connection avec openssl (si le serveur utilise SSL/TLS):

```bash
openssl s_client -connect $ip:21 -starttls ftp
```

---
### Bruteforce

#### Bruteforce user :

```bash
hydra -L /usr/list/user.txt -p password1234 $ip ftp
```

#### Bruteforce password :

```bash
hydra -l user -P /usr/share/seclists/Passwords/xato-net-10-million-passwords-1000000.txt $ip ftp
```

---
## Configuration potentiellement dangereuse

### - VSFTPd

| Settings                       |                                    Descriptions                                   |
| ------------------------------ | :-------------------------------------------------------------------------------: |
| anonymous\_enable=YES          |                        Permet l'identification en Anonymous                       |
| anon\_upload\_enable=YES       |                    Permet à l'utilisateur Anonymous d'uploader                    |
| anon\_mkdir\_write\_enable=YES |                Permet à l'utilisateur Anonymous de créer un dossier               |
| no\_anon\_password=YES         |               Ne pas demander de password à l'utilisateur Anonymous               |
| anon\_root=/home/username/ftp  |                      Le répertoire de l'utilisateur Anonymous                     |
| write\_enable=YES              | Autorise l'usage des commandes: STOR, DELE, RNFR, RNTO, MKD, RMD, APPE, and SITE? |

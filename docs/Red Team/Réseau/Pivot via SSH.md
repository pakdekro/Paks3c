Si la machine cible a accès à un réseau interne, il est possible de faire du port forwarding dynamique: tout le trafic passera par notre unique port local, et sera dispatché sur les différents ports une fois la machine cible atteinte.

Attention: cette technique ne permet de faire passer que des paquets TCP ! Aussi, les différentes machines du réseau interne n'ont pas forcément de routes permettant de communiquer en direct avec notre pc attaquant, ce qui va par exemple empêcher la mise en place de reverse shell.

Dynamic port forwarding:

```shell-session
ssh -D 9050 ubuntu@10.129.202.64
```

Puis rajouter, dans le fichier /etc/proxychains.conf:

```shell-session
socks4 	127.0.0.1 9050
```

les différentes commandes doivent s'éxécuter via proxychains, exemple:

```shell-session
proxychains nmap -v -sn 172.16.5.1-200
```

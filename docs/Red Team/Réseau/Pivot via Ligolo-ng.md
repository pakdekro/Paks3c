
#### Mise en place

```bash
sudo ip tuntap add user $notreUser mode tun ligolo

sudo ip link set ligolo up
```

```bash
/home/pak/Tools/Ligolo/proxy --selfcert
```

#### Transfert sur le pivot

```bash
scp /home/pak/Tools/Ligolo/agent user@ip:/home/user/Desktop/
```

#### Sur le pivot

```bash
./agent --ignore-cert -connect ip:port
```

#### Ouvrir la session sur notre host, puis rajouter la route

```bash
sudo ip route add 192.168.0.0/24 dev ligolo
```

---

#### Ajouter une redirection de port (pour reverse shell etc...)

```bash
listener_add --addr 0.0.0.0:1234 --to 127.0.0.1:4321 --tcp
```

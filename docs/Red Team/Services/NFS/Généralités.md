Network FileSystem, port 2049, TCP/UDP Permet le partage de dossiers/fichiers à travers un réseau.

| Version |  Features  |
| ------- | :---------------------: |
| NFSv2  |  It is older but is supported by many systems and was initially operated entirely over UDP.  |
| NFSv3   |  It has more features, including variable file size and better error reporting, but is not fully compatible with NFSv2 clients.  |
| NFSv4   | It includes Kerberos, works through firewalls and on the Internet, no longer requires portmappers, supports ACLs, applies state-based operations, and provides performance improvements and high security. It is also the first version to have a stateful protocol. |

---
### Enumération

#### Nmap:

```bash
nmap -A --script nfs* $ip 
```

#### Lister les partages:

```bash
showmount -e $ip
```

#### Monter un partage:

```bash
mkdir nfs_temp
mount -t nfs $ip:/dossierPartagé nfs_temp -o nolock
```

---
### Metasploit

#### Scan:

```bash
scanner/nfs/nfsmount
```

---
### Configuration potentiellement dangereuse

| Option           |                                                      Description                                                     |
| ---------------- | :------------------------------------------------------------------------------------------------------------------: |
| rw               |                                            Permission lecture et écriture                                            |
| insecure         |                                         Utilisations de ports en dessous 1024                                        |
| nohide           | If another file system was mounted below an exported directory, this directory is exported by its own exports entry. |
| no\_root\_squash |                                All files created by root are kept with the UID/GID 0.                                |

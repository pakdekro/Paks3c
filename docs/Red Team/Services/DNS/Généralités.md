Domain Name System, port 53, TCP/UDP Résolution des noms de domaines.

| DNS Record |                                    Description                                   |
| ---------- | :------------------------------------------------------------------------------: |
| A          |                             Adresse IPv4 du domaine.                             |
| AAAA       |                             Adresse IPv6 du domaine.                             |
| MX         |                             Serveur Mail du domaine.                             |
| NS         |                              Serveur DNS du domaine.                             |
| TXT        |              Champs texte, peut contenir tout un tas d'informations.             |
| CNAME      | Alias: domaine secondaire qui pointera au même endroit que le domaine principal. |
| PTR        |             Convertit un domaine en adresse IP (sens inverse, donc).             |
| SOA        |                    Contient des informations sur la zone DNS.                    |

---
### Enumération

#### Savoir quels autres serveurs DNS sont présents:

```bash
dig ns $domain @$ip
```

#### Zone Transfer:
Permet à un serveur DNS de transférer sa zone à un autre serveur DNS en cas de problème. En cas de mauvaise configuration il est possible pour nous aussi de faire une demande de transfert et de récupérer les information:

```bash
dig axfr $domain @$ip
```

---
### Brute force

#### Brute-force des subdomains:

```bash
dnsenum --dnsserver $ip --enum -p 0 -s 0 -o subdomains.txt -f /usr/share/SecLists/Discovery/DNS/subdomains-top1million-110000.txt $domain
```

---
### Metasploit

```bash
auxiliary/gather/enum_dns
```

---
### Configuration potentiellement dangereuse

| Option          |                                   Description                                  |
| --------------- | :----------------------------------------------------------------------------: |
| allow-query     |       Defines which hosts are allowed to send requests to the DNS server.      |
| allow-recursion |  Defines which hosts are allowed to send recursive requests to the DNS server. |
| allow-transfer  | Defines which hosts are allowed to receive zone transfers from the DNS server. |
| zone-statistics |                       Collects statistical data of zones.                      |

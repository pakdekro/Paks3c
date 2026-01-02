### Certificats

#### Informations certificat:

```bash
export TARGET="facebook.com"
curl -s "https://crt.sh/?q=${TARGET}&output=json" | jq -r '.[] | "\(.name_value)\n\(.common_name)"' | sort -u > "${TARGET}_crt.sh.txt"
```

---
### Subdomains

#### Utiliser harvester pour trouver des subdomains sur différents moteurs de recherche:

```bash
export TARGET="facebook.com"
cat sources.txt | while read source; do theHarvester -d "${TARGET}" -b $source -f "${source}_${TARGET}";done

sources.txt:
baidu
bufferoverun
crtsh
hackertarget
otx
projecdiscovery
rapiddns
sublist3r
threatcrowd
trello
urlscan
vhost
virustotal
zoomeye
```

#### Brute force DNS avec gobuster:

```bash
export TARGET="facebook.com"
export NS="d.ns.facebook.com"
export WORDLIST="numbers.txt"
gobuster dns -q -r "${NS}" -d "${TARGET}" -w "${WORDLIST}" -p ./patterns.txt -o "gobuster_${TARGET}.txt"
```

#### Fuzzing vHost (remplacer la valeur de "fs" par la taille d'un faux positif):

```bash
ffuf -w /usr/share/seclists/Discovery/DNS/namelist.txt -u http://$ip -H "HOST: FUZZ.$domain" -fs 10918
```
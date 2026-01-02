### 👮 Password policy

Par défaut, la politique de mot de passe est souvent configurée comme ceci:

|Policy|Default Value|
|:-:|:-:|
|Enforce password history|24 days|
|Maximum password age|42 days|
|Minimum password age|1 day|
|Minimum password length|7|
|Password must meet complexity requirements|Enabled|
|Store passwords using reversible encryption|Disabled|
|Account lockout duration|Not set|
|Account lockout threshold|0|
|Reset account lockout counter after|Not set|

En ayant des creds valides il est possible d'énumérer la politique de mot de passe avec crackmapexec:

```bash
netexec smb $ip -u $user -p $pass --pass-pol
```

Sans creds valides, possible avec une NULL SESSION. Via rpc:

```bash
rpcclient -U "" -N $ip
querydominfo
getdompwinfo
```

via enum4linux:

```bash
enum4linux -P $ip
```

Parfois il est possible de récupérer des infos depuis le LDAP sans avoir de creds valides (anonymous bind). Ce n'est normalement plus le cas de base depuis Windows Server 2003 mais l'option peut avoir été activée:

```bash
ldapsearch -h $ip -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength
```


---
### 🤼 Users

Sans creds, il peut être possible d'avoir une liste d'user via une NULL session également. Via enum4linux:

```bash
enum4linux -U $ip  | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"
```

via rpc:

```bash
rpcclient -U "" -N $ip
enumdomusers
```

via crackmapexec:

```bash
netexec smb $ip --users
```

Comme la politique de mot de passe, il est possible d'avoir une liste d'user si LDAP permet l'anonymous bind. Via ldapsearch:

```bash
ldapsearch -h $ip -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "(&(objectclass=user))"  | grep sAMAccountName: | cut -f2 -d" "
```

Via windapsearch.py:

```bash
./windapsearch.py --dc-ip $ip -u "" -U
```

Il est possible de bruteforcer une liste d'utilisateurs via kerbrute. Cette méthode a pour avantage de ne pas générer d'event "failed to log on" ou "logon failure":

```bash
kerbrute userenum -d inlanefreight.local --dc $ip /opt/wordlist.txt
```

Avec des creds valides, il est possibles d'utiliser crackmapexec:

```bash
netexec smb $ip -u $user -p $password --users
```

Avec des creds valides, énumération des users loggés:

```bash
netexec smb $ip -u $user -p $password --loggedon-users
```

---
### 👨‍👩‍👦 groupes

Avec des creds valides, énumération des groupes présents sur l'AD:

```bash
netexec smb $ip -u $user -p $password --groups
```
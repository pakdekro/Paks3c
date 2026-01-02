### 🔗 Connexion (depuis un poste Windows)

#### Se connecter à un serveur SQL Server

```powershell
sqlcmd -S $serveur$ -U $user -P $password
```

Permet de se connecter à une base de données SQL Server depuis un terminal Windows en utilisant **sqlcmd**.

- `$serveur$` : Nom ou adresse IP du serveur SQL
- `$user$` : Nom d’utilisateur
- `$password$` : Mot de passe

> [!Astuce]
> Si l’authentification Windows est utilisée, remplace `-U $user$ -P $password` par `-E` pour utiliser l'utilisateur actuel.

---
### 🚀 Requêtes de base

#### Lister les bases de données

```sql
SELECT name FROM master.sys.databases;
```

Affiche la liste des bases de données disponibles sur le serveur SQL.

#### Sélectionner une base de données

```sql
USE <nom_base_de_données>;
```

Permet de choisir une base de données spécifique pour exécuter les requêtes suivantes.

#### Lister les tables d’une base de données

```sql
SELECT * FROM information_schema.tables;
```

Renvoie la liste des tables présentes dans la base de données en cours.

#### Lister les serveurs liés

```sql
EXEC sp_linkedservers
SELECT * FROM sys.servers;
```

Affiche les serveurs SQL Server liés permettant d’effectuer des requêtes inter-serveurs.

#### Lister les utilisateurs SQL Server

```sql
SELECT sp.name AS login, sp.type_desc AS login_type, sl.password_hash, 
       sp.create_date, sp.modify_date, 
       CASE WHEN sp.is_disabled = 1 THEN 'Disabled' ELSE 'Enabled' END AS status 
FROM sys.server_principals sp 
LEFT JOIN sys.sql_logins sl ON sp.principal_id = sl.principal_id 
WHERE sp.type NOT IN ('G', 'R') 
ORDER BY sp.name;
```

Affiche la liste des utilisateurs SQL, leurs statuts (activé/désactivé) et d’autres informations.

> [!Astuce]
> Utile pour vérifier les comptes SQL et leurs statuts de connexion.

---
### 💻 Activer `xp_cmdshell`

#### Activer l’exécution de commandes système

```sql
sp_configure 'show advanced options', '1'
RECONFIGURE
sp_configure 'xp_cmdshell', '1'
RECONFIGURE
```

Active l'option **xp_cmdshell**, qui permet d’exécuter des commandes système depuis SQL Server.

---
### ⚡ Exécuter une commande système

```sql
EXEC master..xp_cmdshell 'whoami'
```

Exécute la commande `whoami` directement depuis SQL Server et affiche l’utilisateur en cours.

> [!Astuce]
> Peut être utilisé pour vérifier les permissions du compte SQL Server sur le système.

---
### 📝 Lire / Écrire un fichier

#### Vérifier si nous avons la permission de lire un fichier

```sql
SELECT * FROM fn_my_permissions(NULL, 'SERVER') 
WHERE permission_name='ADMINISTER BULK OPERATIONS' 
   OR permission_name='ADMINISTER DATABASE BULK OPERATIONS';
```

Affiche les permissions actuelles de l’utilisateur SQL pour la lecture et l’importation de fichiers.
#### Lire un fichier depuis le système

```sql
SELECT * FROM OPENROWSET(BULK N'C:/Windows/System32/drivers/etc/hosts', SINGLE_CLOB) AS Contents
```

Lit le contenu du fichier spécifié et affiche son contenu sous forme de texte.

> [!Astuce]
> Utile pour lire les fichiers système directement via SQL Server.

#### Écrire dans un fichier (nécessite des droits d’administrateur)

```sql
sp_configure 'show advanced options', 1
RECONFIGURE
sp_configure 'Ole Automation Procedures', 1
RECONFIGURE

DECLARE @OLE INT
DECLARE @FileID INT

EXECUTE sp_OACreate 'Scripting.FileSystemObject', @OLE OUT
EXECUTE sp_OAMethod @OLE, 'OpenTextFile', @FileID OUT, 'c:\fichier.txt', 8, 1
EXECUTE sp_OAMethod @FileID, 'WriteLine', Null, 'Coucou :)'
EXECUTE sp_OADestroy @FileID
EXECUTE sp_OADestroy @OLE
```

Crée un fichier texte et y écrit du contenu directement depuis SQL Server.

- `sp_OACreate` : Crée une instance de l’objet **Scripting.FileSystemObject**
- `OpenTextFile` : Ouvre ou crée un fichier en mode écriture
- `WriteLine` : Écrit du texte dans le fichier
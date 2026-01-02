### 🛠 Gestion des bases de données

#### Créer une base de données

```sql
CREATE DATABASE nomDB;
```

Crée une nouvelle base de données **nomDB**.

> [!Astuce]
> Utilise `IF NOT EXISTS` pour éviter une erreur si la base existe déjà :
> 
> ```sql
> CREATE DATABASE IF NOT EXISTS nomDB;
> ```
> 

#### Lister les bases de données disponibles

```sql
SHOW DATABASES;
```

Affiche la liste des bases de données disponibles sur le serveur.

#### Sélectionner une base de données

```sql
USE nomDB;
```

Change la base de données active pour exécuter les commandes suivantes à l’intérieur de `nomDB`.

---
### 📋 Gestion des tables

#### Créer une table dans une base de données

```sql
CREATE TABLE logins (
    id INT,
    username VARCHAR(100),
    password VARCHAR(100),
    date_of_joining DATETIME
);
```

Crée une table `logins` avec plusieurs colonnes :

- `id` → un entier
- `username` et `password` → chaînes de 100 caractères
- `date_of_joining` → une date et heure

> [!Astuce]
> Ajouter `PRIMARY KEY(id)` permet d'avoir un identifiant unique.

#### Lister les tables d’une base de données

```sql
SHOW TABLES;
```

Affiche toutes les tables présentes dans la base de données sélectionnée.

#### Afficher la structure d’une table

```sql
DESCRIBE $nomTable;
```

Affiche les colonnes d’une table, leur type, clé primaire, valeurs par défaut, etc.

---
### ✏️ Manipulation des données

#### Insérer un enregistrement complet dans une table

```sql
INSERT INTO table_name VALUES (column1_value, column2_value, column3_value, ...);
```

Ajoute un nouvel enregistrement en renseignant **toutes les colonnes** de la table.

#### Insérer un enregistrement avec certaines colonnes uniquement

```sql
INSERT INTO table_name(column2, column3, ...) VALUES (column2_value, column3_value, ...);
```

Ajoute un enregistrement en ne remplissant que certaines colonnes, les autres prennent leur valeur par défaut.

#### Insérer plusieurs enregistrements en une seule requête

```sql
INSERT INTO logins(username, password) VALUES ('john', 'john123!'), ('tom', 'tom123!');
```

Ajoute **plusieurs** utilisateurs d’un coup, ce qui est plus performant.

---
### 📊 Requêtes de sélection

#### Afficher tous les enregistrements d’une table

```sql
SELECT * FROM $nomTable;
```

Retourne **toutes** les lignes et colonnes d’une table.

#### Afficher uniquement certaines colonnes d’une table

```sql
SELECT column1, column2 FROM table_name;
```

Ne retourne que les colonnes spécifiées.

---
### 🔧 Modification de la structure des tables

#### Ajouter une nouvelle colonne

```sql
ALTER TABLE $nomTable ADD $nomColonne INT;
```

Ajoute une colonne de type **INT** à une table existante.

#### Renommer une colonne

```sql
ALTER TABLE $nomTable RENAME COLUMN $ancienNom TO $nouveauNom;
```

Modifie le nom d'une colonne existante.

#### Modifier le type d’une colonne

```sql
ALTER TABLE $nomTable MODIFY $nomColonne DATE;
```

Change le type d’une colonne existante.

#### Supprimer une colonne

```sql
ALTER TABLE $nomTable DROP $nomColonne;
```

Supprime une colonne définitivement.

---
### 🔄 Mise à jour des enregistrements

#### Modifier les valeurs d’une colonne pour certains enregistrements

```sql
UPDATE logins SET password = 'change_password' WHERE id > 1;
```

Modifie la colonne `password` de **tous les utilisateurs dont `id` est supérieur à 1**.

---
### ❌ Suppression de données

### Supprimer un enregistrement spécifique

```sql
DELETE FROM logins WHERE id = 3;
```

Supprime l’utilisateur dont `id` est `3`.

#### Supprimer tous les enregistrements d’une table (sans supprimer la table elle-même)

```sql
DELETE FROM logins;
```

> [!Attention]
> Cette commande **supprime toutes les données** de la table `logins`, mais conserve la table.

#### Supprimer une table entière

```sql
DROP TABLE logins;
```

Supprime définitivement la table et **toutes ses données**.

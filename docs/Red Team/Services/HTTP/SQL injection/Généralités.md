### Description

Les failles d'injection SQL se produisent lorsque des entrées utilisateur sont directement incluses dans des requêtes SQL sans validation ou échappement adéquat. Cela permet à un attaquant de manipuler les requêtes SQL exécutées par l'application, pouvant conduire à la divulgation de données sensibles, à la modification de données, à l'exécution de commandes administratives sur la base de données, et à d'autres conséquences graves.

---
### Exemple d'Attaque SQL Injection

**Scénario d'attaque :**

- Une application web accepte des entrées utilisateur et les utilise directement dans une requête SQL, par exemple une page de connexion qui vérifie les identifiants des utilisateurs.

**Exemple de code vulnérable :**

```php
<?php
$username = $_POST['username'];
$password = $_POST['password'];
$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($conn, $query);
?>
```

**Exploitation :**

- Un attaquant peut manipuler les entrées pour altérer la requête SQL, par exemple en entrant `' OR '1'='1` comme nom d'utilisateur ou mot de passe.

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'
```

---
### Prévention des Attaques SQL Injection

**Utilisation de Requêtes Préparées :**

- Utiliser des requêtes préparées avec des paramètres liés pour empêcher l'injection SQL.

```php
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
sstmt->execute();
```

**Échappement des Entrées Utilisateur :**

- Échapper correctement toutes les entrées utilisateur avant de les inclure dans des requêtes SQL.

```php
$username = mysqli_real_escape_string($conn, $_POST['username']);
$password = mysqli_real_escape_string($conn, $_POST['password']);
$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($conn, $query);
```

**Utilisation d'ORMs :**

   - Utiliser des Object-Relational Mappers (ORMs) qui abstraient les requêtes SQL et fournissent des mécanismes de protection contre les injections SQL.

```php
$user = User::where('username', $username)->where('password', $password)->first();
```

---
### Détection des Failles SQL Injection

**Revue de Code :**

- Examiner le code source pour identifier les endroits où des entrées utilisateur sont directement incluses dans des requêtes SQL sans validation ou échappement adéquat.

**Tests Manuels :**

- Effectuer des tests manuels en manipulant les paramètres de requêtes pour vérifier la présence de vulnérabilités d'injection SQL.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que SQLMap, Burp Suite, ou des scanners spécifiques pour détecter les failles d'injection SQL.

---
### Exemples de Prévention

**Requêtes Préparées :**

```php
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
```

**Utilisation de PDO :**

```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
$stmt->execute(['username' => $username, 'password' => $password]);
```

**Validation et Sanitation des Entrées :**

```php
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Technique d'injection de code SQL dans les requêtes de base de données                                                                                                                                                                                      |
| **CWE**                      | CWE-89 (Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection'))                                                                                                                                                               |
| **Description de l'attaque** | L'injection SQL se produit lorsqu'un attaquant insère ou "injecte" une requête SQL malveillante via les données d'entrée d'une application. Cela peut permettre à l'attaquant de lire, modifier, ou supprimer des données dans la base de données.          |
| **Impacts potentiels**       | - Fuite de données confidentielles<br>- Perte d'intégrité des données<br>- Prise de contrôle de la base de données                                                                                                                                          |
| **Comment la détecter**      | - Analyse des journaux d'applications pour des requêtes SQL suspectes<br>- Utilisation de systèmes de détection d'intrusion<br>- Tests de pénétration et scans de vulnérabilité                                                                             |
| **Remédiations/mitigations** | - Utilisation de requêtes préparées (PreparedStatement) et ORM<br>- Validation et échappement des entrées utilisateur<br>- Mise en œuvre de listes blanches pour les entrées utilisateur<br>- Formation des développeurs aux pratiques sécurisées de codage |
| **Lien de référence**        | [OWASP - SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)                                                                                                                                                                              |


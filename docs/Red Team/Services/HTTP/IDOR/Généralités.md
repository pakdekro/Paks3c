### Description

Les failles IDOR (Insecure Direct Object Reference) se produisent lorsqu'une application permet un accès direct à des objets ou des ressources basées sur une entrée fournie par l'utilisateur sans vérification suffisante des permissions. Cela permet à un attaquant d'accéder à des données ou des fonctionnalités auxquelles il ne devrait pas avoir accès en manipulant simplement les références aux objets dans les requêtes.

---
### Exemple d'Attaque IDOR

**Scénario d'attaque :**

- Un utilisateur authentifié accède à ses propres informations via une URL telle que `https://example.com/user/profile?id=123`.
- Un attaquant modifie le paramètre `id` pour accéder aux informations d'autres utilisateurs, par exemple `https://example.com/user/profile?id=124`.

**Exemple de requête malveillante :**

```http
GET /user/profile?id=124 HTTP/1.1 Host: example.com 
Cookie: sessionid=attacker_session_id
```

---
### Prévention des Attaques IDOR

**Vérification des Permissions :**

Toujours vérifier que l'utilisateur a les permissions nécessaires pour accéder à la ressource demandée.

```php
session_start(); 
$userId = $_SESSION['user_id']; 
$requestedId = $_GET['id']; // Vérifier que l'utilisateur a le droit d'accéder à la ressource 
if ($userId !== $requestedId) { die("Accès refusé."); }
```

**Utilisation de Références Indirectes :**

- Utiliser des références indirectes ou des tokens à la place des identifiants directs dans les URL et les formulaires.

```php
// Générer un token pour chaque utilisateur 
$token = base64_encode(random_bytes(16)); 
$_SESSION['token'] = $token; // Utiliser le token dans les URL 
echo "<a href='profile.php?token=$token'>Mon Profil</a>";
```

**Contrôle d'Accès au Niveau de l'Application :**

- Implémenter des contrôles d'accès rigoureux au niveau de l'application pour toutes les opérations sensibles.

```php
// Exemple avec un framework MVC 
class UserController extends Controller 
{ public function profile($id) { 
$user = User::find($id); 
if ($user->id !== Auth::user()->id) { 
abort(403, 'Accès refusé'); 
} 
return view('profile', compact('user')); } }
```

---
### Détection des Failles IDOR

**Revue de Code :**

- Examiner le code source pour identifier les références directes aux objets et vérifier la présence de contrôles d'accès appropriés.

**Tests Manuels :**

- Effectuer des tests manuels en modifiant les paramètres des requêtes pour vérifier si des données non autorisées peuvent être accédées.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles IDOR.

---
### Exemples de Références Indirectes Sécurisées

**Utilisation de UUID :**

- Utiliser des identifiants universels uniques (UUID) au lieu d'identifiants séquentiels.

```php
// Générer un UUID pour l'utilisateur 
$uuid = bin2hex(random_bytes(16)); // Associer l'UUID à l'utilisateur dans la base de données
```

**Mapping des Références :**

- Utiliser une table de mapping pour gérer les références entre les identifiants publics et privés.

```php
// Table de mapping des tokens et des ID utilisateur 
$token = $_GET['token']; 
$userId = getUserIdFromToken($token); 

function getUserIdFromToken($token) { 
// Rechercher l'ID utilisateur correspondant au token dans la base de données 
$stmt = $pdo->prepare("SELECT user_id FROM tokens WHERE token = ?"); 
$stmt->execute([$token]); 
return $stmt->fetchColumn(); }
```


---

|Catégorie|Information|
|---|---|
|**TTP**|Référence directe à un objet non sécurisé|
|**CWE**|CWE-639 (Authorization Bypass Through User-Controlled Key)|
|**Description de l'attaque**|IDOR se produit lorsqu'une application fournit un accès direct à des objets en se basant sur des entrées fournies par l'utilisateur, sans vérification suffisante de l'autorisation. Cela peut permettre à un attaquant d'accéder à des données auxquelles il ne devrait normalement pas avoir accès.|
|**Impacts potentiels**|- Accès non autorisé à des données sensibles<br>- Modification ou suppression de données<br>- Violation de la confidentialité des données|
|**Comment la détecter**|- Tests de pénétration manuels<br>- Analyse des journaux d'accès pour des accès anormaux<br>- Utilisation de scanners automatiques de vulnérabilité|
|**Remédiations/mitigations**|- Mise en œuvre d'une vérification systématique des autorisations pour chaque accès aux données<br>- Utilisation de tokens de session et de contrôles d'accès basés sur les rôles<br>- Sensibilisation des développeurs à cette vulnérabilité lors de la conception de l'application|
|**Lien de référence**|[OWASP - Insecure Direct Object References](https://owasp.org/www-community/vulnerabilities/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet)|


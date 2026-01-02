### Description

Les failles de Cross-Site Scripting (XSS) se produisent lorsque des applications web permettent l'injection de scripts malveillants par des utilisateurs non autorisés dans les pages consultées par d'autres utilisateurs. Ces scripts peuvent voler des cookies, des sessions, rediriger les utilisateurs, afficher du contenu non désiré, et bien plus encore.

---
### Types de XSS

**XSS Réfléchi :**

- Se produit lorsque les données fournies par l'utilisateur sont immédiatement renvoyées par l'application web sans traitement ou validation adéquats.

```html
<form method="GET" action="/search">
    <input type="text" name="query">
    <input type="submit" value="Search">
</form>
```

Si l'entrée utilisateur `query` n'est pas échappée, un attaquant peut injecter du code malveillant dans l'URL, par exemple : `/search?query=<script>alert('XSS')</script>`.

**XSS Stocké :**

- Se produit lorsque les données fournies par l'utilisateur sont stockées sur le serveur (par exemple, dans une base de données) et renvoyées ultérieurement sans validation ou échappement adéquats.

```html
<form method="POST" action="/submit_comment">
    <textarea name="comment"></textarea>
    <input type="submit" value="Submit">
</form>
```

Si l'entrée utilisateur `comment` n'est pas échappée avant d'être affichée, un attaquant peut stocker du code malveillant qui s'exécutera lorsque d'autres utilisateurs consulteront la page contenant le commentaire.

**XSS Basé sur le DOM :**
 - Se produit lorsque le script côté client modifie le DOM de manière dynamique en utilisant des données non validées provenant de l'utilisateur.

```javascript
var user = location.hash.substring(1);
document.getElementById("welcome").innerHTML = "Welcome " + user + "!";
```

Si `location.hash` contient des scripts malveillants, par exemple `#<script>alert('XSS')</script>`, le script sera exécuté.

---
### Prévention des Attaques XSS

**Échappement des Entrées Utilisateur :**

- Échapper toutes les données d'entrée utilisateur avant de les inclure dans le HTML, le JavaScript, le CSS, etc.

```html
<div id="welcome">Welcome <?php echo htmlspecialchars($user); ?>!</div>
```

**Utilisation d'En-têtes de Sécurité :**

- Utiliser des en-têtes HTTP pour aider à protéger contre les attaques XSS.

```http
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
```

**Validation et Sanitation des Entrées :**

- Valider et assainir toutes les entrées utilisateur avant de les traiter ou de les stocker.

```php
$comment = filter_input(INPUT_POST, 'comment', FILTER_SANITIZE_STRING);
```

---
### Détection des Failles XSS

**Revue de Code :**

- Examiner le code source pour identifier les endroits où des entrées utilisateur sont incluses dans le DOM sans validation ou échappement adéquats.

**Tests Manuels :**
 
 - Effectuer des tests manuels en manipulant les paramètres de requêtes et en injectant des payloads XSS pour vérifier la présence de vulnérabilités.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles XSS.

---
### Exemples de Prévention

**Échappement avec PHP :**

```php
<?php
$user = htmlspecialchars($_GET['user']);
echo "Welcome " . $user;
?>
```

**Utilisation de Content Security Policy (CSP) :**

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

**Validation stricte des Entrées :**

```php
$comment = filter_input(INPUT_POST, 'comment', FILTER_SANITIZE_STRING);
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **TTP**                      | Injection de scripts côté client dans des pages web                                                                                                                                                                                                                            |
| **CWE**                      | CWE-79 (Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting'))                                                                                                                                                                                  |
| **Description de l'attaque** | XSS se produit lorsque des scripts malveillants sont injectés dans des sites web de confiance. Ces scripts sont exécutés dans le navigateur de l'utilisateur et peuvent détourner des sessions, défacer des sites web, ou rediriger l'utilisateur vers des sites malveillants. |
| **Impacts potentiels**       | - Détournement de session<br>- Vol d'informations sensibles<br>- Manipulation de contenu web pour l'utilisateur                                                                                                                                                                |
| **Comment la détecter**      | - Utilisation de scanners de vulnérabilités web<br>- Analyse des entrées et sorties des applications web<br>- Tests de pénétration ciblant les scripts côté client                                                                                                             |
| **Remédiations/mitigations** | - Échappement des entrées utilisateur dans les sorties HTML/JavaScript<br>- Utilisation de politiques de sécurité de contenu (CSP)<br>- Validation et nettoyage des entrées côté serveur<br>- Formation des développeurs aux pratiques de codage sécurisé                      |
| **Lien de référence**        | [OWASP - Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)                                                                                                                                                                                             |

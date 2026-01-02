### Description

Les failles d'inclusion de fichiers locaux (LFI) se produisent lorsqu'une application web inclut des fichiers locaux sans validation adéquate des entrées utilisateur. Cela permet à un attaquant d'inclure des fichiers arbitraires du serveur dans l'application, pouvant entraîner la divulgation de fichiers sensibles, l'exécution de code malveillant, et d'autres conséquences graves.

---
### Exemple d'Attaque LFI

**Scénario d'attaque :**

- Une application web inclut dynamiquement un fichier en fonction des paramètres fournis par l'utilisateur via une URL, par exemple `https://example.com/index.php?page=home`.

**Exemple de code vulnérable :**

```php
<?php 
$page = $_GET['page']; 
include($page . ".php"); 
?>
```

**Exploitation :**

- Un attaquant peut manipuler le paramètre `page` pour inclure des fichiers sensibles ou des fichiers de configuration, par exemple `https://example.com/index.php?page=../../../../etc/passwd`.

```http
GET /index.php?page=../../../../etc/passwd HTTP/1.1 
Host: example.com
```

---
### Prévention des Attaques LFI

**Validation et Sanitation des Entrées :**

- Valider et assainir toutes les entrées utilisateur pour s'assurer qu'elles ne contiennent pas de caractères spéciaux ou de chemins relatifs.

```php
$whitelist = ['home', 'about', 'contact']; 
$page = $_GET['page']; 
if (!in_array($page, $whitelist)) { 
die("Page non autorisée."); 
} 
include($page . ".php");
```

**Utilisation de Chemins Absolus :**

- Utiliser des chemins absolus pour les fichiers inclus afin d'empêcher les manipulations de chemins relatifs.

```php
$page = basename($_GET['page']); 
include("/var/www/html/pages/" . $page . ".php");
```

**Configuration du Serveur :**

- Configurer le serveur pour restreindre l'accès aux fichiers critiques et sensibles.

```apache
# Exemple de configuration Apache 
<Directory /var/www/html> 
Options -Indexes 
AllowOverride None 
</Directory>
```

---
### Détection des Failles LFI

**Revue de Code :**

- Examiner le code source pour identifier les inclusions de fichiers basées sur des entrées utilisateur sans validation adéquate.

**Tests Manuels :**

- Effectuer des tests manuels en manipulant les paramètres de requêtes pour inclure des fichiers arbitraires et vérifier la présence de vulnérabilités.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles LFI.

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

| Catégorie                    | Information                                                                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Technique d'injection de fichier local                                                                                                                                                                                          |
| **CWE**                      | CWE-98 (Improper Control of Filename for Include/Require Statement in PHP Program ('PHP Remote File Inclusion'))                                                                                                                |
| **Description de l'attaque** | LFI permet à un attaquant d'inclure des fichiers sur un serveur via le navigateur web. Cela se produit souvent lorsque les pages utilisent une entrée non validée pour charger des fichiers dynamiquement.                      |
| **Impacts potentiels**       | - Divulgation d'informations sensibles<br>- Exécution de code à distance<br>- Compromission du serveur web                                                                                                                      |
| **Comment la détecter**      | - Analyse des journaux de serveur web pour les chemins de fichiers suspects<br>- Utilisation de scanners de vulnérabilités<br>- Audits de code pour les inclusions de fichiers non sécurisées                                   |
| **Remédiations/mitigations** | - Validation stricte des entrées utilisateur<br>- Utilisation de la liste blanche pour les chemins de fichiers<br>- Mise à jour et sécurisation des scripts PHP<br>- Désactivation de la directive `allow_url_include` dans PHP |
| **Lien de référence**        | [OWASP - Local File Inclusion](https://owasp.org/www-community/attacks/Local_File_Inclusion)                                                                                                                                    |


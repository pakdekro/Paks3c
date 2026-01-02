### Description

Les failles d'injection de commandes se produisent lorsque des applications acceptent des entrées non sécurisées et les transmettent à un interpréteur de commandes (shell) pour exécution. Cela permet à un attaquant d'exécuter des commandes arbitraires sur le système hôte avec les privilèges de l'application vulnérable, conduisant à la compromission du système, à la divulgation de données sensibles, ou à des dommages importants.

---
### Exemple d'Attaque par Injection de Commandes

**Scénario d'attaque :**

- Une application web prend une entrée utilisateur et l'utilise directement dans une commande système sans validation ou échappement adéquat.

***Exemple de code vulnérable :**

```php
<?php $domain = $_GET['domain']; 
echo shell_exec("nslookup " . $domain); 
?>
```

**Exploitation :**

- Un attaquant peut injecter des commandes supplémentaires via l'entrée utilisateur, par exemple `domain=example.com; cat /etc/passwd`.

```http
GET /nslookup.php?domain=example.com;cat+/etc/passwd HTTP/1.1 
Host: example.com
```

---
### Prévention des Attaques d'Injection de Commandes

**Validation des Entrées :**

- Valider et assainir toutes les entrées utilisateur pour ne permettre que des caractères et des formats attendus.

```php
$domain = filter_var($_GET['domain'], FILTER_VALIDATE_DOMAIN); 
if ($domain === false) { 
die("Nom de domaine non valide."); 
}
```


**Utilisation de Fonctions Système Sécurisées :**

- Utiliser des API ou des fonctions de bibliothèques qui n'interagissent pas directement avec le shell système.

```php
$output = dns_get_record($domain, DNS_A);
```

**Echappement des Entrées :**

- Échapper les caractères spéciaux dans les entrées utilisateur avant de les utiliser dans des commandes système.

```php
$domain = escapeshellarg($_GET['domain']); 
echo shell_exec("nslookup " . $domain);
```

**Principle of Least Privilege :**

- Exécuter les commandes avec des privilèges minimaux nécessaires pour réduire l'impact des injections potentielles.

---
### Détection des Failles d'Injection de Commandes

**Revue de Code :**

Analyser le code source pour identifier les endroits où des entrées utilisateur sont utilisées dans des commandes système.

**Tests Manuels :**

Tester manuellement en essayant d'injecter des commandes dans les paramètres des requêtes pour identifier les vulnérabilités.

**Utilisation d'Outils de Sécurité :**

Utiliser des outils d'analyse statique et dynamique pour détecter les injections de commandes, tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques à l'injection de commandes.

---
### Exemples de Prévention

**Validation stricte des Entrées :**

```php
if (preg_match('/^[a-zA-Z0-9.-]+$/', $_GET['domain'])) { 
$domain = $_GET['domain']; 
} else { 
die("Nom de domaine non valide."); 
}
```

**Utilisation de Bibliothèques Sécurisées :**

```php
use Symfony\Component\Process\Process; 
use Symfony\Component\Process\Exception\ProcessFailedException; 

$process = new Process(['nslookup', $domain]); 
$process->run(); 

if (!$process->isSuccessful()) { 
throw new ProcessFailedException($process); 
} 

echo $process->getOutput();
```

**Echappement Approprié :**

```php
$domain = escapeshellarg($_GET['domain']); 
$output = shell_exec("nslookup " . $domain); 
echo htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
```

---

|Catégorie|Information|
|---|---|
|**TTP**|Injection de commandes système ou de shell dans une application|
|**CWE**|CWE-77 (Command Injection)|
|**Description de l'attaque**|L'injection de commandes se produit lorsqu'un attaquant insère ou injecte une commande dans une application, qui est ensuite exécutée par le système d'exploitation. Cela peut permettre l'exécution de commandes arbitraires sur le serveur.|
|**Impacts potentiels**|- Exécution de commandes arbitraires<br>- Compromission du serveur<br>- Accès non autorisé aux systèmes et données|
|**Comment la détecter**|- Analyse des journaux d'applications pour des commandes suspectes<br>- Utilisation de scanners de vulnérabilités<br>- Tests de pénétration ciblant l'exécution de commandes|
|**Remédiations/mitigations**|- Validation et échappement des entrées utilisateur<br>- Utilisation de listes blanches pour les commandes autorisées<br>- Exécution des processus avec des privilèges limités<br>- Formation des développeurs aux pratiques de codage sécurisé|
|**Lien de référence**|[OWASP - Command Injection](https://owasp.org/www-community/attacks/Command_Injection)|


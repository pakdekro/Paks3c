### 🎯 Filtres de base

#### Rechercher des événements sur une période spécifique

```sql
SELECT * FROM events 
WHERE startTime > '2024-02-01 00:00:00' 
AND startTime < '2024-02-07 23:59:59'
```

Affiche tous les événements entre le **1er et le 7 février 2024**.

#### Filtrer par adresse IP source

```sql
SELECT * FROM events WHERE sourceip = '192.168.1.10'
```

Affiche **tous les événements générés par l'IP source** `192.168.1.10`.

#### Filtrer par type d’événement spécifique

```sql
SELECT * FROM events WHERE eventCategory = 'Authentication Failure'
```

Affiche **tous les échecs d’authentification**.

#### Filtrer par niveau de gravité

```sql
SELECT * FROM events WHERE magnitude > 6
```

Affiche uniquement les **événements avec une gravité supérieure à 6**.

---

### 🔥 Filtres avancés

#### Rechercher des connexions suspectes

```sql
SELECT * FROM events WHERE sourceIP != destinationIP
AND destinationPort IN (3389, 22, 445)
AND magnitude > 5
```

Détecte **les connexions anormales** sur des ports sensibles comme **RDP (3389), SSH (22) et SMB (445)**.

#### Détecter des balayages de ports

```sql
SELECT sourceIP, COUNT(DISTINCT destinationPort) AS scanned_ports 
FROM events 
WHERE destinationPort IS NOT NULL 
GROUP BY sourceIP 
HAVING COUNT(DISTINCT destinationPort) > 10
```

Identifie les **adresses IP ayant scanné plus de 10 ports différents**.

#### Lister les tentatives de connexion échouées par utilisateur

```sql
SELECT username, COUNT(*) AS failed_attempts 
FROM events 
WHERE eventName = 'Failed Login' 
GROUP BY username 
ORDER BY failed_attempts DESC
```

Affiche la **liste des utilisateurs avec le plus grand nombre d’échecs de connexion**.

#### Identifier des connexions à des pays suspects

```sql
SELECT * FROM events 
WHERE destinationGeographicLocation IN ('Russia', 'China', 'North Korea')
```

Liste les **connexions vers des pays sensibles**.

---

### 📜 Requêtes spécifiques aux logs réseau

#### Identifier des transferts de fichiers volumineux

```sql
SELECT sourceIP, destinationIP, bytes 
FROM flows 
WHERE bytes > 100000000 
ORDER BY bytes DESC
```

Affiche les **transferts de plus de 100 Mo**.

#### Identifier les connexions entre un poste et plusieurs destinations

```sql
SELECT sourceIP, COUNT(DISTINCT destinationIP) AS connections
FROM flows 
GROUP BY sourceIP
HAVING COUNT(DISTINCT destinationIP) > 5
```

Identifie les **postes établissant des connexions vers plus de 5 destinations différentes** (potentiel **beaconing**).

---

### 🛠 Autres requêtes utiles

#### Rechercher un processus spécifique dans les logs

```sql
SELECT * FROM events WHERE eventName LIKE '%powershell%'
```

Filtre les **événements contenant le mot `powershell`**, souvent utilisé dans des attaques.

#### Rechercher des exécutions de Mimikatz

```sql
SELECT * FROM events 
WHERE eventName LIKE '%mimikatz%' 
OR eventDescription LIKE '%sekurlsa%'
```

Détecte les **exécutions suspectes de l’outil Mimikatz**.

#### Détecter des connexions anormales d’un compte privilégié

```sql
SELECT username, sourceIP, destinationIP, eventName 
FROM events 
WHERE username IN ('admin', 'administrator', 'root')
AND eventName = 'Successful Login'
AND sourceIP NOT IN ('192.168.1.0/24')
```

Détecte les connexions **réussies sur un compte admin depuis une IP hors du réseau interne**.

#### Trouver les événements les plus fréquents

```sql
SELECT eventName, COUNT(*) AS occurrences 
FROM events 
GROUP BY eventName 
ORDER BY occurrences DESC
```


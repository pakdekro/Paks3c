### Description

Les failles de falsification de requête côté serveur (SSRF) se produisent lorsqu'une application web permet à un attaquant de forcer le serveur à effectuer des requêtes HTTP vers des destinations arbitraires. Cela permet à un attaquant d'accéder à des ressources internes, d'interagir avec des services non exposés publiquement, et potentiellement de compromettre l'infrastructure interne.

---

### Exemple d'Attaque SSRF

**Scénario d'attaque :**

- Une application web propose une fonctionnalité de prévisualisation d'URL ou de téléchargement de contenu distant, par exemple un service qui récupère des images depuis une URL fournie par l'utilisateur.

**Exemple de code vulnérable :**

```python
from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    response = requests.get(url)
    return response.content
```

**Exploitation :**

- Un attaquant peut manipuler l'URL pour accéder à des ressources internes, par exemple en entrant `http://127.0.0.1:22` pour scanner les ports locaux.

```http
POST /fetch HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

url=http://127.0.0.1:6379/
```

- Le serveur effectuerait alors une requête vers Redis sur localhost, révélant potentiellement des informations sensibles.

---

### Prévention des Attaques SSRF

**Validation et Filtrage des URLs :**

- Valider les URLs fournies par l'utilisateur et bloquer l'accès aux plages d'adresses privées et localhost.

```python
import ipaddress
from urllib.parse import urlparse

def is_safe_url(url):
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ['http', 'https']:
            return False
        
        ip = ipaddress.ip_address(parsed.hostname)
        if ip.is_private or ip.is_loopback or ip.is_link_local:
            return False
        
        return True
    except:
        return False

@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    if not is_safe_url(url):
        return "Invalid URL!"
    
    response = requests.get(url)
    return response.content
```

**Liste blanche de domaines autorisés :**

- Maintenir une liste de domaines autorisés et ne permettre l'accès qu'à ces domaines.

```python
ALLOWED_DOMAINS = ['api.example.com', 'images.trusted-site.com']

@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    parsed = urlparse(url)
    
    if parsed.hostname not in ALLOWED_DOMAINS:
        return "Domain not allowed!"
    
    response = requests.get(url)
    return response.content
```

**Utilisation de proxies et isolation réseau :**

- Configurer des proxies dédiés ou utiliser des conteneurs isolés pour les requêtes externes.

```python
@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    proxies = {
        'http': 'http://proxy-server:8080',
        'https': 'https://proxy-server:8080'
    }
    
    response = requests.get(url, proxies=proxies, timeout=5)
    return response.content
```

---

### Détection des Failles SSRF

**Revue de Code :**

- Examiner le code source pour identifier les endroits où l'application effectue des requêtes HTTP basées sur des entrées utilisateur.

**Tests Manuels :**

- Effectuer des tests manuels en manipulant les paramètres d'URL pour tenter d'accéder à des ressources internes.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles SSRF.

---

### Exemples de Prévention

**Validation robuste avec DNS resolution :**

```python
import socket
import ipaddress

def resolve_and_validate(hostname):
    try:
        ip = socket.gethostbyname(hostname)
        ip_obj = ipaddress.ip_address(ip)
        
        if ip_obj.is_private or ip_obj.is_loopback:
            return False
        return True
    except:
        return False

@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    parsed = urlparse(url)
    
    if not resolve_and_validate(parsed.hostname):
        return "Invalid destination!"
    
    response = requests.get(url, timeout=10)
    return response.content
```

**Configuration de timeouts et limitations :**

```python
@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    
    try:
        response = requests.get(
            url, 
            timeout=5,
            allow_redirects=False,
            headers={'User-Agent': 'SafeBot/1.0'}
        )
        return response.content
    except requests.exceptions.RequestException:
        return "Request failed!"
```

**Utilisation de bibliothèques sécurisées :**

```python
from requests_toolbelt import sessions

def create_safe_session():
    session = sessions.BaseUrlSession()
    session.mount('file://', None)  # Block file:// URLs
    session.mount('ftp://', None)   # Block FTP
    return session

@app.route('/fetch', methods=['POST'])
def fetch_url():
    url = request.form['url']
    session = create_safe_session()
    response = session.get(url)
    return response.content
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Forcer le serveur à effectuer des requêtes vers des destinations arbitraires pour accéder à des ressources internes                                                                                                                                                                                                                     |
| **CWE**                      | CWE-918 (Server-Side Request Forgery (SSRF))                                                                                                                                                                                                                                                                                            |
| **Description de l'attaque** | SSRF se produit lorsqu'une application web effectue des requêtes HTTP vers des URLs contrôlées par l'attaquant, permettant l'accès à des ressources internes, la reconnaissance de réseau, et potentiellement l'exécution d'actions non autorisées sur des services internes.                                                           |
| **Impacts potentiels**       | - Accès aux métadonnées cloud (AWS, Azure, GCP)<br>- Scan de ports internes et reconnaissance réseau<br>- Accès à des services internes non exposés<br>- Exfiltration de données depuis des APIs internes<br>- Contournement de pare-feu et restrictions réseau                                                                         |
| **Comment la détecter**      | - Analyse de code pour les requêtes HTTP basées sur des entrées utilisateur<br>- Tests de pénétration avec des URLs internes et de métadonnées<br>- Monitoring des requêtes sortantes anormales<br>- Utilisation d'outils de scan spécialisés (SSRFmap, etc.)                                                                           |
| **Remédiations/mitigations** | - Valider et filtrer toutes les URLs d'entrée<br>- Utiliser des listes blanches de domaines autorisés<br>- Bloquer l'accès aux plages d'adresses privées et localhost<br>- Implémenter des timeouts et limitations de requêtes<br>- Utiliser des proxies dédiés pour les requêtes externes<br>- Isolation réseau des services sensibles |
| **Lien de référence**        | [OWASP - Server-Side Request Forgery (SSRF)](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)                                                                                                                                                                                                                       |
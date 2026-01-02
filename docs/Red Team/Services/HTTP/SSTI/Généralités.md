### Description

Les failles d'injection de modèles côté serveur (SSTI) se produisent lorsque les entrées utilisateur sont directement intégrées dans des templates sans validation ou échappement adéquat. Cela permet à un attaquant d'injecter du code malveillant qui sera exécuté sur le serveur, conduisant à des compromissions de sécurité graves, y compris l'exécution de commandes arbitraires et la divulgation de données sensibles.

---
### Exemple d'Attaque SSTI

**Scénario d'attaque :**

- Une application web utilise un moteur de template pour générer dynamiquement du contenu basé sur les entrées utilisateur, par exemple, un moteur de template Jinja2 dans une application Flask.

**Exemple de code vulnérable :**

```python
from flask import Flask, request, render_template_string

app = Flask(__name__)

@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    template = f"Hello {name}!"
    return render_template_string(template)
```

**Exploitation :**
   - Un attaquant peut manipuler les entrées pour injecter du code malveillant dans le template, par exemple en entrant `{{ 7*7 }}` comme nom.

```http
POST /greet HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

name={{ 7*7 }}
```

   - Le template rendu afficherait alors `Hello 49!`, indiquant que le code a été exécuté.

---
### Prévention des Attaques SSTI

**Échappement des Entrées Utilisateur :**

- Utiliser des fonctions d'échappement fournies par le moteur de template pour s'assurer que les entrées utilisateur sont traitées comme du texte brut.

```python
from flask import escape

@app.route('/greet', methods=['POST'])
def greet():
    name = escape(request.form['name'])
    template = f"Hello {name}!"
    return render_template_string(template)
```

**Utilisation de Templates Sécurisés :**

- Utiliser des méthodes sécurisées pour rendre les templates qui ne permettent pas l'injection de code.

```python
@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    return render_template('greet.html', name=name)
```

**Validation et Sanitation des Entrées :**

- Valider et assainir toutes les entrées utilisateur pour s'assurer qu'elles ne contiennent pas de code malveillant.

```python
@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    if not name.isalnum():
        return "Invalid input!"
    return render_template('greet.html', name=name)
```

---
### Détection des Failles SSTI

**Revue de Code :**

- Examiner le code source pour identifier les endroits où des entrées utilisateur sont directement intégrées dans des templates sans validation ou échappement adéquat.

**Tests Manuels :**

- Effectuer des tests manuels en manipulant les entrées pour injecter des payloads SSTI et vérifier la présence de vulnérabilités.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles SSTI.

---
### Exemples de Prévention

**Échappement avec Jinja2 :**

```python
from jinja2 import Environment, escape

env = Environment(autoescape=True)
template = env.from_string("Hello {{ name }}!")
rendered_template = template.render(name=name)
```

**Validation stricte des Entrées :**

```python
@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    if not name.isalnum():
        return "Invalid input!"
    return render_template('greet.html', name=name)
```

**Utilisation de Méthodes Sécurisées :**

```python
@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    return render_template('greet.html', name=name)
```

Voici les informations complètes et formatées pour les failles d'Upload de Fichiers et Server-Side Template Injection (SSTI).

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Exploiter les moteurs de template côté serveur pour injecter du code malveillant                                                                                                                                                                                                                                 |
| **CWE**                      | CWE-94 (Improper Control of Generation of Code ('Code Injection'))                                                                                                                                                                                                                                               |
| **Description de l'attaque** | SSTI se produit lorsqu'un moteur de template côté serveur permet à un attaquant d'injecter des expressions de template malveillantes, ce qui peut conduire à l'exécution de code arbitraire, l'exfiltration de données, ou d'autres actions non autorisées.                                                      |
| **Impacts potentiels**       | - Exécution de code arbitraire sur le serveur<br>- Divulgation de données sensibles<br>- Compromission totale du serveur<br>- Déni de service (DoS)                                                                                                                                                              |
| **Comment la détecter**      | - Analyse de code pour les entrées utilisateur injectées dans les templates<br>- Tests de pénétration pour identifier les points d'injection de template<br>- Utilisation d'outils de scan de sécurité pour détecter les vulnérabilités SSTI                                                                     |
| **Remédiations/mitigations** | - Éviter d'injecter des entrées utilisateur directement dans les templates<br>- Utiliser des moteurs de template sécurisés qui n'exposent pas de fonctionnalités d'exécution de code<br>- Valider et échapper toutes les entrées utilisateur<br>- Mettre en place des politiques de sécurité de contenu strictes |
| **Lien de référence**        | [OWASP - Server-Side Template Injection (SSTI)](https://owasp.org/www-community/attacks/Server_Side_Template_Injection)                                                                                                                                                                                          |

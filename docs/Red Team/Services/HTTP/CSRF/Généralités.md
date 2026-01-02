### Description

Le Cross-Site Request Forgery (CSRF) est une vulnérabilité web qui permet à un attaquant de faire effectuer des actions indésirables à un utilisateur authentifié sur une application web, sans que cet utilisateur en soit conscient. Les actions sont exécutées avec les privilèges de l'utilisateur authentifié, ce qui peut entraîner des conséquences graves, telles que des modifications non autorisées de données ou des actions non intentionnelles sur l'application cible.

---
### Exemple d'Attaque CSRF

**Scénario d'attaque :**

- Un utilisateur est authentifié sur un site web (par exemple, `https://example.com`).
- L'attaquant envoie un lien ou une image malveillante à l'utilisateur, souvent via email ou un autre site web.
- Lorsque l'utilisateur clique sur le lien ou visite la page contenant l'image malveillante, une requête est envoyée au site web sur lequel il est authentifié.

**Exemple de code malveillant :**

```html
<!-- Exemple d'image HTML -->
<img src="https://example.com/transfer?amount=1000&to=attacker_account" style="display:none">
```

Ce code envoie une requête GET à `https://example.com/transfer` avec les paramètres spécifiés, exécutant ainsi une action de transfert d'argent sans le consentement de l'utilisateur.

---
### Prévention des Attaques CSRF

**Utilisation de Tokens CSRF :**

- Implémenter des tokens CSRF dans les formulaires et les requêtes sensibles. Ces tokens doivent être uniques pour chaque session utilisateur et vérifiés par le serveur avant d'exécuter des actions sensibles.

```html
<form action="/transfer" method="post"> <input type="hidden" name="csrf_token" value="unique_csrf_token"> Montant: <input type="text" name="amount"> Compte: <input type="text" name="to_account"> <input type="submit" value="Transférer"> </form>
```

**Vérification des En-têtes de Référents :**

- Vérifier l'en-tête HTTP Referer pour s'assurer que la requête provient d'une page légitime de votre domaine.

```php
if (isset($_SERVER['HTTP_REFERER']) && parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) === 'example.com') { // Requête légitime } else { // Requête potentiellement malveillante }
```

**Utilisation de Méthodes HTTP Appropriées :**
 - Restreindre les actions sensibles aux méthodes POST, PUT, DELETE, etc., plutôt que GET. Les requêtes GET ne doivent pas modifier l'état du serveur.
 
**Détection et Annulation des Sessions Doubles :**

- Détecter les sessions doubles et les annuler, ou exiger une ré-authentification pour les actions sensibles.

---
### Détection des Failles CSRF

**Revue de Code :**

- Analyser le code source de l'application pour vérifier l'absence de protection CSRF sur les formulaires et les requêtes sensibles.

**Tests Manuels :**

- Créer des requêtes malveillantes similaires à celles décrites dans l'exemple et les exécuter pour voir si l'application est vulnérable.

**Utilisation d'Outils d'Analyse :**

- Utiliser des outils de sécurité web automatisés qui incluent des tests de CSRF, tels que OWASP ZAP ou Burp Suite.

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **TTP**                      | Induire les utilisateurs à effectuer des actions non désirées sur un site Web où ils sont authentifiés                                                                                                                                                                               |
| **CWE**                      | CWE-352 (Cross-Site Request Forgery (CSRF))                                                                                                                                                                                                                                          |
| **Description de l'attaque** | CSRF exploite la confiance qu'un site web a envers le navigateur de l'utilisateur. L'attaque force l'utilisateur à exécuter des actions non désirées sur un site web où il est authentifié, typiquement via un lien malveillant ou un script dans une autre page.                    |
| **Impacts potentiels**       | - Actions non autorisées effectuées au nom de l'utilisateur<br>- Modification de paramètres de compte<br>- Potentiel de transactions malveillantes                                                                                                                                   |
| **Comment la détecter**      | - Analyse de code pour les formulaires et requêtes sans jetons de validation CSRF<br>- Tests de pénétration pour identifier les vulnérabilités CSRF<br>- Surveillance des journaux de serveur web pour des modèles de requête inhabituels                                            |
| **Remédiations/mitigations** | - Utilisation de jetons anti-CSRF dans les formulaires<br>- Vérification de l'origine des requêtes avec des entêtes HTTP appropriés<br>- Mise en œuvre de politiques de sécurité de contenu strictes<br>- Sensibilisation des utilisateurs aux liens et aux pièces jointes suspectes |
| **Lien de référence**        | [OWASP - Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)                                                                                                                                                                                            |


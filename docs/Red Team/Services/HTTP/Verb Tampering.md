
A écrire.

---

|Catégorie|Information|
|---|---|
|**TTP**|Modification ou abus des méthodes (verbes) HTTP|
|**CWE**|CWE-275 (Permission Issues)|
|**Description de l'attaque**|HTTP Verb Tampering implique l'exploitation de la gestion inadéquate des méthodes HTTP (comme GET, POST, DELETE) par une application web. Cela peut permettre à un attaquant d'accéder à des fonctionnalités non autorisées ou de contourner les contrôles de sécurité.|
|**Impacts potentiels**|- Accès ou modification non autorisée des données<br>- Bypass des restrictions d'accès<br>- Exécution d'actions non autorisées|
|**Comment la détecter**|- Analyse de sécurité des configurations de serveur web<br>- Tests de pénétration ciblant la gestion des méthodes HTTP<br>- Revue de code pour la gestion des méthodes HTTP|
|**Remédiations/mitigations**|- Restriction et sécurisation de l'utilisation des méthodes HTTP dans les applications web<br>- Implémentation de contrôles d'accès et de validation appropriés pour chaque méthode HTTP<br>- Utilisation de pare-feux d'applications web (WAF) pour filtrer les requêtes malveillantes|
|**Lien de référence**|[OWASP - Testing for HTTP Verb Tampering](https://owasp.org/www-community/controls/Testing_for_HTTP_Verb_Tampering)|


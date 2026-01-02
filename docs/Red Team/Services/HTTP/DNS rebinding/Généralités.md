### Description

Le DNS Rebinding est une vulnérabilité qui permet à un attaquant de contourner les politiques de sécurité de même origine (Same-Origin Policy) et de prendre le contrôle d'un navigateur web pour communiquer avec des systèmes protégés sur le réseau local de l'utilisateur. Cette attaque exploite le mécanisme de résolution DNS pour manipuler l'adresse IP résolue pour un nom de domaine, permettant à l'attaquant de rediriger le trafic vers une adresse IP différente, souvent celle du réseau local de la victime.

---
### Exemple d'Attaque DNS Rebinding

**Scénario d'attaque :**

- L'attaquant enregistre un domaine (par exemple, `attacker.com`) et configure un serveur DNS malveillant pour répondre aux requêtes de ce domaine.
- L'utilisateur visite une page web contrôlée par l'attaquant.
- Le serveur DNS malveillant répond initialement avec une adresse IP contrôlée par l'attaquant.
- Après une courte période, le serveur DNS change l'adresse IP pour une adresse interne du réseau local de la victime (par exemple, `192.168.0.1`).

**Exemple de code malveillant :**

```html
<script> // JavaScript malveillant pour une attaque de DNS Rebinding 
var img = new Image(); img.src = "http://attacker.com:8080"; // Première requête vers l'adresse IP contrôlée par l'attaquant 
setTimeout(function() { img.src = "http://192.168.0.1:8080"; // Requête vers l'adresse IP interne 
}, 2000); 
</script>
```

---
### Prévention des Attaques DNS Rebinding

**Restrictions au Niveau du Navigateur :**

- Utiliser des extensions ou des configurations de navigateur pour restreindre l'accès aux adresses IP locales depuis des scripts externes.

**Validation des Adresses IP :**

- Configurer les applications web pour vérifier que les requêtes proviennent de noms de domaine ou d'adresses IP attendues.

```php
if ($_SERVER['REMOTE_ADDR'] !== '192.168.0.1') 
{ 
// Requête légitime 
} 
else 
{ 
// Requête potentiellement malveillante 
}
```

**Filtres de Pare-feu :**

- Utiliser des pare-feux pour filtrer les requêtes HTTP provenant du réseau local vers des adresses internes.

**Limitation des Durées de Cache DNS :**

- Configurer de courtes durées de cache (TTL) pour les enregistrements DNS, ce qui réduit l'impact des attaques de DNS Rebinding.

**Utilisation de DNSSEC :**

- Mettre en œuvre DNSSEC (DNS Security Extensions) pour garantir l'intégrité des réponses DNS.

---
### Détection des Failles DNS Rebinding

**Surveillance des Requêtes DNS :**

-  Surveiller les requêtes DNS pour détecter les modèles de requêtes suspectes ou les résolutions d'adresses IP internes.

**Tests Manuels :**

- Effectuer des tests manuels en utilisant des scripts de rebinding DNS pour vérifier si les applications internes sont accessibles.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité pour analyser et détecter les vulnérabilités de DNS Rebinding, tels que Burp Suite ou des scripts personnalisés.

---

|Catégorie|Information|
|---|---|
|**TTP**|Exploitation de la politique de même origine par la manipulation des enregistrements DNS|
|**CWE**|CWE-346 (Origin Validation Error)|
|**Description de l'attaque**|Le DNS Rebinding exploite la façon dont les navigateurs web appliquent la politique de même origine. L'attaque manipule le DNS pour faire croire au navigateur qu'une source fiable lui demande de se connecter à un système malveillant.|
|**Impacts potentiels**|- Contournement des politiques de sécurité du navigateur<br>- Accès non autorisé aux systèmes internes<br>- Possibilité d'exécution de code malveillant|
|**Comment la détecter**|- Analyse des journaux DNS pour identifier des changements rapides d'adresse IP<br>- Utilisation de solutions de détection d'intrusion réseau<br>- Surveillance des activités suspectes sur le réseau|
|**Remédiations/mitigations**|- Mise en œuvre de politiques de sécurité DNS strictes<br>- Configuration des navigateurs et des serveurs pour prévenir les abus<br>- Utilisation de pare-feu et de systèmes de détection d'intrusion pour filtrer le trafic suspect|
|**Lien de référence**|[OWASP - DNS Rebinding](https://owasp.org/www-community/attacks/DNS_Rebinding)|


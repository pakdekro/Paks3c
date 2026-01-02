## Introduction

**Overpass Turbo** ([https://overpass-turbo.eu/](https://overpass-turbo.eu/)) est une interface web permettant d'interroger la base de données OpenStreetMap (OSM) via l'**API Overpass**. Elle permet de rechercher des objets cartographiques (points, lignes, zones) très spécifiques en fonction de leurs **tags** (étiquettes `clé=valeur`). C'est un outil puissant pour la géolocalisation et la collecte d'informations sur une zone.

## Interface Principale

* **Carte :** Affiche les résultats de la requête. La zone visible définit souvent la zone de recherche (`{{bbox}}`).
* **Éditeur de Requête :** Zone de texte où écrire votre requête en langage Overpass QL.
* **Boutons Principaux :**
    * **Exécuter :** Lance la requête sur la zone visible.
    * **Partager :** Génère un lien permanent vers votre requête et la vue actuelle.
    * **Exporter :** Exporte les données trouvées (GeoJSON, GPX, KML...).
    * **Assistant :** Aide à générer des requêtes simples via une interface guidée.
* **Vue Données :** Onglet affichant les données brutes des objets trouvés.

## Structure de Base d'une Requête (Overpass QL)

```sql
/*
  Commentaire optionnel
  pour expliquer la requête
*/
[out:json][timeout:25]; // Paramètres de sortie et de délai

// Bloc de requête principal
(
  // Instruction 1: Chercher les nœuds avec un tag spécifique dans la zone visible
  node["amenity"="restaurant"]({{bbox}});
  // Instruction 2: Chercher les chemins (zones/lignes) avec le même tag
  way["amenity"="restaurant"]({{bbox}});
  // Instruction 3: Chercher les relations avec le même tag (plus rare pour les commodités)
  // relation["amenity"="restaurant"]({{bbox}});
);

// Instruction de sortie : afficher les résultats sur la carte
out center; // 'out;' ou 'out body;' ou 'out geom;' selon ce qu'on veut voir
```

## Éléments Clés du Langage Overpass QL

### 1. Types d'Objets OSM
* `node` : Un point géographique (ex: un poteau, un banc, un magasin ponctuel).
* `way` : Une ligne (ex: une route, une rivière) ou une zone fermée (ex: un bâtiment, un parc).
* `relation` : Regroupe d'autres objets pour former des entités complexes (ex: un itinéraire de bus, une frontière administrative, un bâtiment avec cour intérieure).
* `nwr` : Raccourci pour `node, way, relation`.

### 2. Tags (Étiquettes `clé=valeur`)
C'est le cœur d'OSM. Chaque objet peut avoir plusieurs tags décrivant ce qu'il est.
* **Trouver les bons tags :**
    * **Wiki OpenStreetMap :** La référence principale ([https://wiki.openstreetmap.org/wiki/Map_Features](https://wiki.openstreetmap.org/wiki/Map_Features) en anglais, ou équivalent français).
    * **Taginfo :** Outil statistique pour voir quels tags sont les plus utilisés ([https://taginfo.openstreetmap.org/](https://taginfo.openstreetmap.org/)).
* **Syntaxe des Filtres par Tag :**
    * Clé existe : `["power"]` (tous les objets ayant une clé "power")
    * Valeur exacte : `["amenity"="restaurant"]`
    * Valeur différente : `["highway"!="motorway"]` (routes qui ne sont pas des autoroutes)
    * Clé n'existe pas : `[! "building"]`
    * Correspondance Regex (Expression Régulière) : `["name"~"Café"]` (nom contenant "Café", sensible à la casse)
    * Correspondance Regex (insensible à la casse) : `["name"~"café", i]`
    * Non-correspondance Regex : `["name"!~"^Restaurant"]` (nom ne commençant pas par "Restaurant")
    * Valeurs multiples (OU) : `["highway"~"primary|secondary"]`
    * Valeurs multiples (ET - via plusieurs filtres) : `["shop"="supermarket"]["name"="Lidl"]`

### 3. Zone de Recherche
* `({{bbox}})` : **Le plus courant dans Overpass Turbo.** Désigne la zone rectangulaire actuellement visible sur la carte.
* `(area)` : Recherche dans une zone administrative nommée (pays, région, ville...). Nécessite de définir la zone au préalable :
    ```sql
    area["ISO3166-1"="FR"][admin_level=2]->.pays; // Définit la France
    node["amenity"="police"](area.pays); // Cherche les postes de police en France
    ```
* `(around:radius, lat, lon)` : Recherche dans un rayon (en mètres) autour d'un point spécifique.
    ```sql
    node(around:500, 48.858, 2.294); // Nœuds à moins de 500m de la Tour Eiffel
    ```

### 4. Instructions de Sortie (`out`)
Contrôle ce qui est affiché/exporté.
* `out;` ou `out body;` : Sortie standard, inclut les nœuds et la géométrie des chemins/relations.
* `out skel;` : Sortie "squelette" (rapide), juste les IDs et tags, sans géométrie détaillée ni nœuds pour les chemins. Utile pour compter ou pour les étapes intermédiaires.
* `out center;` : Affiche le centre géométrique des zones (ways/relations). Utile pour ne pas surcharger la carte avec les contours des bâtiments/parcs.
* `out geom;` : Sortie complète de la géométrie, y compris les métadonnées (si disponibles).
* `out count;` : Affiche le nombre d'éléments trouvés au lieu des éléments eux-mêmes.

### 5. Union et Récursion
* `( ... );` : Bloc d'union. Les résultats de toutes les instructions à l'intérieur sont combinés.
* `>;` (Recurse Down) : Trouve les nœuds appartenant aux chemins/relations trouvés juste avant.
    ```sql
    way["highway"="residential"]({{bbox}}); // Trouve les rues résidentielles
    >; // Trouve tous les nœuds composant ces rues
    out skel;
    ```
* `<;` (Recurse Up) : Trouve les chemins/relations qui utilisent les nœuds trouvés juste avant.

## L'Assistant (Wizard)

Pour des requêtes simples, l'Assistant est très pratique. Tapez une description simple en anglais (souvent), par exemple :
* `amenity=restaurant in {{bbox}}`
* `power=pole in my city` (remplacez "my city" par le nom)
* `name="Carrefour"`
L'Assistant génère la requête Overpass QL correspondante.

## Exemples de Requêtes Utiles (OSINT/GeoGuessr)

* **Poteaux électriques dans la vue :**
    ```sql
    node["power"="pole"]({{bbox}});
    out;
    ```
* **Caméras de surveillance dans la vue :**
    ```sql
    node["man_made"="surveillance"]({{bbox}});
    out;
    ```
* **Restaurants McDonald's dans la vue :**
    ```sql
    nwr["amenity"="fast_food"]["name"~"McDonald",i]({{bbox}});
    out center;
    ```
* **Bornes d'incendie dans la vue :**
    ```sql
    node["emergency"="fire_hydrant"]({{bbox}});
    out;
    ```
* **Types de barrières/clôtures spécifiques :**
    ```sql
    way["barrier"="fence"]["fence_type"="chain_link"]({{bbox}});
    out geom;
    ```
* **Boîtes aux lettres (ex: La Poste en France) :**
    ```sql
    node["amenity"="post_box"]["brand"~"La Poste",i]({{bbox}});
    out;
    ```

## Conseils pour l'OSINT

* **Explorez le Wiki OSM et Taginfo :** La clé est de trouver les bons tags pour ce que vous cherchez (antennes 4G/5G `man_made=mast` `communication:mobile_phone=yes`, types de surfaces routières `surface=...`, etc.).
* **Soyez Spécifique :** Plus vos tags sont précis, plus les résultats sont pertinents.
* **Vérifiez Visuellement :** Utilisez toujours les résultats d'Overpass en conjonction avec l'imagerie satellite ou Street View pour confirmer. La donnée OSM n'est pas toujours parfaite ou à jour.
* **Qualité Variable :** La densité et la précision des données OSM varient énormément d'une région à l'autre. Les zones urbaines en Europe/Amérique du Nord sont souvent très bien cartographiées, d'autres zones beaucoup moins.

## Ressources Utiles

* **Wiki Overpass API :** [https://wiki.openstreetmap.org/wiki/Overpass_API](https://wiki.openstreetmap.org/wiki/Overpass_API) (Documentation détaillée du langage)
* **Wiki OSM - Map Features :** [https://wiki.openstreetmap.org/wiki/Map_Features](https://wiki.openstreetmap.org/wiki/Map_Features) (Liste des tags courants)
* **Taginfo :** [https://taginfo.openstreetmap.org/](https://taginfo.openstreetmap.org/) (Statistiques d'utilisation des tags)
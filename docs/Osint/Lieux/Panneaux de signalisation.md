## Introduction

  

Après le marquage au sol, les panneaux de signalisation constituent la deuxième source majeure d'indices visuels routiers pour la géolocalisation. Comme pour le marquage, la Convention de Vienne sur la signalisation routière (1968) a établi des standards, mais de très nombreux pays (y compris les USA, Canada, Australie) ne l'appliquent pas ou seulement partiellement, et même les pays signataires ont des variations nationales. Analyser les panneaux est donc essentiel en OSINT.

  
---
## 1. Éléments Clés à Analyser

  

* **Forme du Panneau :** Triangle, cercle, carré, rectangle, octogone, losange, formes spécifiques (ex: écussons pour numéros de route).

* **Couleurs :** Couleur du fond, de la bordure, du symbole, du texte.

* **Symboles / Pictogrammes :** Standardisés ou spécifiques au pays ? Style graphique ?

* **Texte :**

	* Langue(s) utilisée(s).

	* Police de caractères (font).

	* Abréviations, termes spécifiques.

* **Montage et Dos du Panneau :**

	* Type de poteau (matériau, forme, couleur).

	* Système de fixation.

	* Couleur du dos du panneau (souvent gris, mais pas toujours).

	* Étiquettes ou marquages au dos (inventaire, date, fabricant).

* **Unités de Mesure :** Distances en kilomètres (km) ou miles (m) ? Limitations de vitesse ? Hauteurs/largeurs en mètres ou pieds/pouces ?

  

## 2. Formes et Leurs Significations Courantes

  

* **Triangle (Pointe en Haut) :**

	* **Usage :** Très répandu en Europe, Afrique, Asie (influence Convention de Vienne).

	* **Signification :** Danger / Avertissement. Le symbole à l'intérieur précise le danger.

* **Triangle (Pointe en Bas) :**

	* **Usage :** Quasi universel.

	* **Signification :** Cédez le passage / Yield.

* **Cercle :**

	* **Usage :** Très répandu en Europe, Afrique, Asie (influence Convention de Vienne).

	* **Signification :** Réglementation.

		* *Bordure Rouge :* Interdiction (ex: limitation de vitesse, sens interdit, interdiction de dépasser).

		* *Fond Bleu :* Obligation (ex: direction obligatoire, piste cyclable obligatoire, vitesse minimale).

		* *Fond Blanc/Jaune avec Barre Diagonale :* Fin d'interdiction ou de prescription.

* **Octogone :**

	* **Usage :** Quasi universel.

	* **Signification :** Arrêt obligatoire / STOP. La couleur (rouge) est constante, mais le texte peut varier ("STOP" est le plus courant, mais pas exclusif).

* **Losange (Diamond) :**

	* **Usage :** USA, Canada, Irlande, Australie, Nouvelle-Zélande, Japon...

	* **Signification :** Danger / Avertissement (souvent sur fond jaune).

	* **Usage (Europe) :** Peut aussi indiquer une route prioritaire (sur fond blanc/jaune, ex: Allemagne, France).

* **Carré / Rectangle :**

	* **Usage :** Universel.

	* **Signification :** Information, Direction, Services. Les couleurs varient énormément selon le pays et le type de route (voir section couleurs).

  
---
## 3. Le Code Couleur des Fonds

  

* **Rouge :** Principalement pour le panneau STOP et les bordures d'interdiction/danger.

* **Jaune :**

	* *Avertissement/Danger :* USA, Canada, Australie, NZ, Irlande, Japon...

	* *Marquage Temporaire/Travaux :* Souvent en Europe (même pour les panneaux de danger habituellement blancs).

	* *Route Prioritaire :* Parfois (ex: Allemagne).

	* *Direction :* Routes secondaires dans certains pays.

* **Blanc :**

	* *Fond pour Réglementation/Interdiction :* Souvent en Europe (avec bordure rouge).

	* *Fond pour Information Locale :* Noms de rue, informations diverses.

	* *Limitations de Vitesse :* USA (rectangulaire), certains pays européens (cercle).

* **Bleu :**

	* *Obligation :* Europe (cercle).

	* *Direction (Autoroutes) :* France, Allemagne, Italie, Espagne, Suisse, Belgique...

	* *Direction (Autres Routes) :* Certains pays.

	* *Information / Services :* Très courant.

* **Vert :**

	* *Direction (Autoroutes) :* UK, Irlande, Scandinavie, Grèce, Pologne, certains pays d'Asie...

	* *Direction (Routes Principales) :* USA, Canada, Australie...

	* *Direction (Autres Routes) :* France, Italie, Suisse...

* **Marron :**

	* **Usage :** Assez universel.

	* **Signification :** Indication touristique, points d'intérêt culturel ou naturel.

* **Orange :**

	* **Usage :** Principalement USA, Canada.

	* **Signification :** Travaux / Construction / Zone temporaire.

  
---
## 4. Symboles et Pictogrammes

  

Même si la Convention de Vienne standardise de nombreux symboles (silhouette de piéton, de cerf, de travaux...), des variations nationales existent :

* **Animaux :** Cerf (Europe) vs Wapiti/Orignal (Am. Nord, Scandinavie) vs Kangourou (Australie) vs Kiwi (NZ) vs Vache... Le style du dessin varie aussi.

* **Style Graphique :** Plus ou moins détaillé, stylisé.

* **Symboles Uniques :** Certains pays ont des symboles pour des dangers ou situations spécifiques inexistants ailleurs.

  

## 5. Langue, Texte et Police

  

* **Langue :** L'indice le plus évident. Attention aux pays multilingues (Canada: FR/EN, Belgique: FR/NL/DE, Suisse: DE/FR/IT/RM, Finlande: FI/SV, Irlande: GA/EN, Pays de Galles: CY/EN...) où la présence de plusieurs langues est un indice fort.

* **Police de Caractères (Font) :** Très distinctif !

	* *USA :* Highway Gothic (ancien) / Clearview (plus récent).

	* *Allemagne :* DIN 1451.

	* *France :* Caractères (L1 à L5).

	* *UK :* Transport.

	* *Italie :* Alfabeto Normale / Alfabeto Stretto.

	* *Suède :* Tratex.

* La reconnaissance de la police peut suffire à identifier un pays.

* **Terminologie / Abréviations :** "Exit" vs "Sortie" vs "Ausfahrt" ; "km/h" vs "MPH" ; "Centre Ville" vs "Downtown" vs "Zentrum".

  
---
## 6. Montage et Dos du Panneau

  

* **Poteaux :** Ronds, carrés, rectangulaires, parfois nervurés (ex: France), en métal galvanisé, peints (couleur ?), en bois (rare, parfois USA/Canada/Scandinavie). Fixation simple ou double ?

* **Dos du Panneau :** Généralement gris, mais peut être d'une autre couleur. Présence d'autocollants (codes-barres, dates, logos de la municipalité ou de l'agence routière) ?

  
---
## 7. Exemples de Systèmes Distinctifs

  

* **Système Américain (MUTCD) :** Losanges jaunes (danger), rectangles blancs (réglementation texte), octogone STOP, écussons spécifiques pour les routes (Interstate bleu/rouge, US Route blanc/noir), unités en miles/feet.

* **Système Européen (Vienna) :** Triangles pointe en haut (danger), cercles (réglementation), rectangles/carrés (info/direction), unités métriques. Couleurs variables pour les directions (bleu/vert/blanc/jaune selon pays et type de route).

* **Système Britannique/Irlandais :** Mixte. Formes européennes mais couleurs parfois différentes (ex: directions primaires vertes au UK). Unités impériales (UK) vs métriques (Irlande). Polices spécifiques. Conduite à gauche.

  
---
## 8. Application OSINT

  

* **Combinaison d'Indices :** Un panneau seul est utile, mais la combinaison (forme + couleur + symbole + langue + police) est très puissante.

* **Cohérence Environnementale :** Les panneaux doivent être cohérents avec les autres indices (marquage au sol, architecture, paysage...).

* **Direction et Distance :** Les panneaux directionnels donnent des noms de villes/villages et des numéros de route. Ces informations sont directement utilisables pour une recherche cartographique ou sur le web.

* **Identification d'Agence :** Les logos ou noms sur les étiquettes au dos peuvent identifier l'autorité routière (nationale, régionale, municipale).
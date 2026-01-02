---
tags:
  - blueteam
  - maldoc
---

**Objectif :** Oletools est une suite d'outils Python développée par Philippe Lagadec, conçue pour l'analyse des fichiers OLE2 (Compound File Binary Format), principalement les documents Microsoft Office (Word, Excel, PowerPoint), ainsi que les fichiers RTF et Flash. Elle est largement utilisée en analyse de malwares (documents malveillants), en forensic et en threat hunting pour extraire des informations, détecter des macros VBA, des objets embarqués, et d'autres indicateurs suspects.

**Source :** [https://github.com/decalage2/oletools](https://github.com/decalage2/oletools)
**Installation :** `pip install -U oletools`

---

### 💡 **Workflow d'Analyse Suggéré**

1.  **`oleid` :** Obtenir un aperçu rapide des indicateurs de risque (macros, objets OLE, Flash...).
2.  **`olemeta` :** Examiner les métadonnées (auteur, dates, etc.).
3.  **Si Macros détectées :**
    * `olevba` : Analyser et extraire le code VBA, détecter les fonctions suspectes.
    * `mraptor` : Détection heuristique rapide de patterns malveillants dans les macros.
4.  **Si Objets OLE/Flash/RTF :**
    * `oledump.py` : Lister les flux (streams) du fichier OLE.
    * `oleobj` / `rtfobj` / `pyxswf` : Extraire et analyser les objets spécifiques.
    * `oletimes` : Examiner les timestamps de création/modification des flux.
    * `olemap` : Visualiser la structure interne du fichier OLE.
5.  **Exploration Manuelle :**
    * `oledump.py -s <stream_id> -v` : Décompresser et afficher le contenu d'un flux VBA.
    * `olebrowse` : Explorer interactivement la structure du fichier OLE.

---

### 🛠️ **Outils Principaux et Utilisation**

#### 1. `oleid` - Identification Rapide

* **Description :** Analyse un fichier et affiche une liste d'indicateurs (présence de macros VBA, d'objets OLE, de Flash, de chiffrement, etc.) pour évaluer rapidement le risque potentiel. C'est souvent le premier outil à utiliser.
* **Usage :** `oleid <fichier>`
* **Exemple :**
```bash
oleid document_suspect.doc
```
* **Interprétation :** Recherchez les indicateurs marqués `True` ou les avertissements (`Risk`). La présence de `VBA Macros` est un point d'attention majeur qui justifie l'utilisation d'`olevba`. La présence d'`Object Pool` ou `Flash` suggère l'utilisation d'`oleobj` ou `pyxswf`.

#### 2. `olevba` - Analyse de Macros VBA

* **Description :** Extrait et analyse le code source des macros VBA contenues dans les fichiers MS Office. Détecte les mots-clés suspects (auto-exécution comme `AutoOpen`, `Document_Open`; accès réseau comme `Lib "urlmon"`; écriture fichier comme `Open...For Output`; exécution de commandes comme `Shell`, `WScript.Shell`), les techniques d'obfuscation (Hex, Base64, Dridex, etc.), et les indicateurs IOC (IP, URL, chemins de fichiers exécutables).
* **Usage :** `olevba [options] <fichier>`
* **Options Utiles :**
    * `-c` : Affiche le code VBA désobfusqué et analysé.
    * `-a` : Analyse automatique (affiche un résumé des indicateurs sans le code complet).
    * `-d` : Décode/désobfusque les chaînes encodées (Hex, Base64, Dridex, etc.) trouvées dans le code.
    * `--reveal` : Affiche le code VBA extrait brut, sans analyse ni désobfuscation.
    * `--deobf` : Tente de désobfusquer le code VBA en utilisant des heuristiques.
    * `-i` : Mode interactif pour explorer le code et les variables.
* **Exemple :**
```bash
# Analyse complète avec affichage du code et décodage
olevba -c -d document_macro.xls
```
* **Interprétation :** Portez une attention particulière aux sections `Suspicious Keywords`, `IOCs`, et `AutoExec keywords`. Examinez le code affiché avec `-c` pour comprendre la logique malveillante. Les indicateurs de risque élevés (`High`, `Critical`) sont à prioriser.

#### 3. `mraptor` - Détection Rapide de Macros Malveillantes

* **Description :** Macro Rapter - Détecte les macros VBA suspectes en se basant *uniquement* sur la présence de méthodes d'auto-exécution (`AutoOpen`, `Document_Open`, `Workbook_Open`, etc.). Plus rapide qu'`olevba` pour un premier tri très basique.
* **Usage :** `mraptor <fichier>`
* **Exemple :**
```bash
mraptor presentation.ppt
```
* **Interprétation :** Indique si des macros à exécution automatique sont présentes (`SUSPICIOUS`). Ne fournit pas de détails sur le code lui-même. Doit être complété par `olevba` si positif.

#### 4. `oledump.py` - Exploration des Flux OLE

* **Description :** Outil puissant et flexible pour lister, examiner et extraire les différents flux (streams) de données à l'intérieur d'un fichier OLE2. Permet de comprendre la structure interne du fichier.
* **Usage :** `oledump.py [options] <fichier>`
* **Options Utiles :**
    * *(sans options)* : Liste les flux avec leur index, taille, et nom (si disponible). Les lettres indiquent le type : `M`=Macro VBA, `O`=Objet OLE, `F`=Formulaire VBA.
    * `-s <index>` : Sélectionne un flux spécifique pour l'analyser avec d'autres options.
    * `-d` : Affiche le contenu hexadécimal et ASCII du flux sélectionné.
    * `-v` : Tente de décompresser le code VBA (si le flux est marqué 'M'). C'est l'option la plus courante pour voir le code macro brut.
    * `-x` : Affiche le contenu hexadécimal brut (sans l'ASCII).
    * `-S` : Affiche le contenu sous forme de chaînes de caractères (utile pour chercher des strings lisibles).
    * `-e` : Extrait tous les objets OLE embarqués trouvés dans les flux `ObjectPool`.
    * `-D` : Extrait le contenu brut du flux sélectionné vers la sortie standard (à rediriger vers un fichier).
    * `-p <plugin>` : Utilise un plugin pour analyser le flux (ex: `-p plugin_http_heuristics`, `-p plugin_find_xor`). Lister avec `-P`.
* **Exemple :**
```bash
# Lister les flux
oledump.py document.doc
# Afficher le contenu décompressé du flux VBA (supposons index 7)
oledump.py -s 7 -v document.doc
# Extraire le contenu brut du flux 10 dans un fichier
oledump.py -s 10 -D > stream10.bin
# Extraire les objets OLE
oledump.py -s 12 -e document_avec_objet.doc
```
* **Interprétation :** Les flux marqués `M` contiennent généralement du code VBA (à analyser avec `-v` ou `olevba`). Les flux `O` indiquent des objets OLE embarqués (à extraire avec `-e` ou `oleobj`). Les tailles importantes ou les noms suspects peuvent indiquer des données cachées.

#### 5. `olemeta` - Extraction des Métadonnées

* **Description :** Affiche les métadonnées standard (propriétés `SummaryInformation` et `DocumentSummaryInformation`) du fichier OLE.
* **Usage :** `olemeta <fichier>`
* **Exemple :**
```bash
olemeta rapport.xls
```
* **Interprétation :** Peut révéler l'auteur (`Author`), le logiciel (`CreatingApplication`), les dates de création/modification (`CreateTime`, `LastSaveTime`), le temps total d'édition (`TotalEditTime`), des commentaires. Ces informations peuvent parfois trahir l'origine du fichier, des incohérences (temps d'édition nul pour un document complexe), ou des informations contextuelles.

#### 6. `oletimes` - Analyse des Timestamps des Flux

* **Description :** Affiche les timestamps de création et de modification de chaque flux (stream) et stockage (storage) à l'intérieur du fichier OLE.
* **Usage :** `oletimes <fichier>`
* **Exemple :**
```bash
oletimes document_suspect.docm
```
* **Interprétation :** Des timestamps anormaux (ex: tous identiques à la seconde près, dates futures/passées lointaines) ou très rapprochés pour de nombreux flux peuvent indiquer une génération automatique par un outil malveillant ou une manipulation du fichier.

#### 7. `oleobj` - Extraction d'Objets OLE Embarqués

* **Description :** Détecte et extrait les objets OLE embarqués (fichiers, scripts, objets Package) à l'intérieur des fichiers OLE. Plus spécialisé que `oledump -e`.
* **Usage :** `oleobj [options] <fichier>`
* **Options Utiles :**
    * `-i` : Mode interactif pour choisir les objets à extraire.
    * `-d <répertoire>` : Spécifie le répertoire où sauvegarder les objets extraits.
    * `-x` : Extrait les objets sans demander de confirmation.
* **Exemple :**
```bash
# Extraire tous les objets dans le dossier ./extracted_objects
oleobj -d ./extracted_objects document_avec_objet.doc
```
* **Interprétation :** Les objets extraits doivent ensuite être analysés séparément (ex: un `.exe` extrait doit être analysé comme un malware potentiel).

#### 8. `rtfobj` - Analyse des Fichiers RTF

* **Description :** Spécialement conçu pour analyser les fichiers RTF (Rich Text Format). Détecte et extrait les objets OLE embarqués, qui sont un vecteur d'attaque courant dans les RTF (ex: exploitation de vulnérabilités comme CVE-2017-11882 - Equation Editor).
* **Usage :** `rtfobj [options] <fichier.rtf>`
* **Options Utiles :**
    * `-s <index>` : Sauvegarde l'objet spécifié par son index dans un fichier.
    * `-S` : Sauvegarde tous les objets détectés dans des fichiers séparés.
    * `-d <répertoire>` : Répertoire de sauvegarde pour les objets extraits.
* **Exemple :**
```bash
# Sauvegarder tous les objets trouvés dans le dossier ./rtf_extracted
rtfobj -S -d ./rtf_extracted document_rtf_suspect.rtf
```
* **Interprétation :** Les objets extraits (souvent des OLE contenant des exploits ou d'autres charges utiles) nécessitent une analyse plus approfondie.

#### 9. `olemap` - Visualisation de la Structure OLE

* **Description :** Affiche une carte textuelle des secteurs du fichier OLE, indiquant quels secteurs sont utilisés par quels flux ou structures internes (FAT, Directory, etc.).
* **Usage :** `olemap <fichier>`
* **Exemple :**
```bash
olemap document_complexe.ppt
```
* **Interprétation :** Principalement utile pour les analyses très poussées afin de comprendre comment le fichier est organisé physiquement et détecter d'éventuelles anomalies de structure ou des données cachées dans des secteurs non référencés.

#### 10. `olebrowse` - Explorateur OLE Interactif

* **Description :** Fournit une interface simple en ligne de commande (similaire à un shell) pour naviguer dans la structure hiérarchique (stockages et flux) d'un fichier OLE.
* **Usage :** `olebrowse <fichier>`
* **Exemple :**
```bash
olebrowse document.doc
# Commandes interactives: ls (lister), cd <stockage>, stream <flux> (afficher), exit
```
* **Interprétation :** Permet une exploration manuelle et ciblée de la structure OLE sans extraire tous les flux.

#### 11. `pyxswf` - Analyse des Fichiers Flash (SWF)

* **Description :** Détecte, extrait et tente de décompresser/décompiler (en utilisant `swfdecompress` si disponible) les objets Flash (SWF) potentiellement embarqués dans des documents Office.
* **Usage :** `pyxswf <fichier>`
* **Exemple :**
```bash
pyxswf presentation_flash.ppt
```
* **Interprétation :** Les fichiers Flash étaient autrefois un vecteur d'attaque courant. Cet outil permet d'isoler le SWF pour une analyse ultérieure (recherche de code ActionScript malveillant, exploitation de vulnérabilités Flash Player).

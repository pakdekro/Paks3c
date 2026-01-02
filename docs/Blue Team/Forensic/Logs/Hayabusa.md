**Objectif :** Hayabusa (隼) est un outil rapide d'analyse de logs d'événements Windows (`.evtx`), écrit en Rust. Il est conçu pour le Threat Hunting et l'Incident Response, en appliquant des règles de détection (principalement au format Sigma) pour identifier rapidement les activités suspectes ou malveillantes dans de grands volumes de logs.

**Source :** [https://github.com/Yamato-Security/hayabusa](https://github.com/Yamato-Security/hayabusa)
**Téléchargement :** Des binaires précompilés pour Windows, Linux et macOS sont disponibles sur la page [Releases](https://github.com/Yamato-Security/hayabusa/releases) du projet GitHub.

---

### 🚀 **Utilisation de Base**

La structure générale d'une commande Hayabusa est :
`hayabusa[.exe] [OPTIONS_GLOBALES] <COMMANDE> [OPTIONS_COMMANDE]`

#### Commandes Principales

* `scan`: Analyse les logs et affiche les alertes détectées selon les règles Sigma.
* `csv-timeline`: Génère une timeline chronologique de *tous* les événements (pas seulement les alertes) au format CSV.
* `json-timeline`: Génère une timeline chronologique de *tous* les événements au format JSON Lines.
* `update-rules`: Télécharge/met à jour les règles Sigma depuis les dépôts configurés.
* `list-rules`: Liste les règles de détection chargées.
* `list-profiles`: Liste les profils de configuration disponibles.

---

### 📥 **Options d'Entrée (Input)**

#### Spécifier le Répertoire des Logs

```bash
# Analyser tous les .evtx dans un dossier (et sous-dossiers)
./hayabusa scan -d /chemin/vers/logs/
# Exemple Windows: .\hayabusa.exe scan -d C:\Windows\System32\winevt\Logs\
````

- **Contexte :** Option la plus courante pour analyser l'ensemble des logs d'un système. Hayabusa parcourt récursivement le dossier.
    

#### Spécifier un Fichier Log Unique

```bash
./hayabusa scan -f /chemin/vers/un/log/specifique.evtx
```

- **Contexte :** Analyser un seul fichier `.evtx`.
    

#### Utiliser un Profil de Configuration

```bash
./hayabusa scan -d /chemin/vers/logs/ -p <nom_profil>
# Exemples: -p high, -p medium, -p verbose_level
```

- **Contexte :** Les profils prédéfinis ajustent les règles et les niveaux de détection activés. `standard` est souvent le défaut. `high` et `critical` se concentrent sur les alertes les plus graves. `verbose_level` inclut plus d'informations.
    
- **Usage :** Permet d'adapter rapidement le niveau de détail et de criticité de l'analyse. Utilisez `list-profiles` pour voir les profils disponibles.
    

### 📤 **Options de Sortie (Output)**

#### Scan Standard (Sortie Console)

```bash
./hayabusa scan -d /chemin/vers/logs/
```

- **Contexte :** Affiche les alertes détectées directement dans la console, avec un résumé final.
    

#### Générer une Timeline CSV

```bash
./hayabusa csv-timeline -d /chemin/vers/logs/ -o timeline_output.csv
```

- **Contexte :** Crée un fichier CSV contenant _tous_ les événements des logs analysés, triés chronologiquement. Très utile pour une analyse détaillée et la corrélation manuelle.
    
- **Options :**
    
    - `-o <fichier>` : Spécifie le fichier de sortie CSV.
        

#### Générer une Timeline JSON Lines

```bash
./hayabusa json-timeline -d /chemin/vers/logs/ -o timeline_output.jsonl
```

- **Contexte :** Similaire à `csv-timeline`, mais génère un fichier au format JSON Lines (un objet JSON par ligne), plus facile à parser par d'autres outils.
    
- **Options :**
    
    - `-o <fichier>` : Spécifie le fichier de sortie JSONL.
        

#### Générer un Rapport HTML (Timeline Graphique)

```bash
# Combiné avec une timeline CSV
./hayabusa csv-timeline -d /chemin/vers/logs/ -o timeline.csv -H rapport_hayabusa.html

# Combiné avec une timeline JSON
./hayabusa json-timeline -d /chemin/vers/logs/ -o timeline.jsonl -H rapport_hayabusa.html
```

- **Contexte :** L'option `-H <fichier.html>` (ou `--html-report`) génère un rapport HTML interactif basé sur la timeline créée (CSV ou JSON). Ce rapport permet de visualiser, filtrer et explorer les événements et alertes de manière graphique.
    
- **Usage** : Très pratique pour l'analyse visuelle et le reporting.
    

#### Autres Options de Sortie Utiles

```bash
# Pour la commande 'scan'
./hayabusa scan -d /logs/ -o resultats_scan.txt # Sauvegarder la sortie console dans un fichier
./hayabusa scan -d /logs/ --no-summary # Ne pas afficher le résumé final
```

### ⚙️ **Filtrage et Tuning**

#### Filtrer par Niveau de Règle Sigma

```bash
./hayabusa scan -d /logs/ --min-level <level>
# Levels: informational, low, medium, high, critical
# Exemple: Afficher uniquement les alertes high et critical
./hayabusa scan -d /logs/ --min-level high
```

- **Contexte :** Permet de se concentrer sur les alertes les plus importantes en ignorant les niveaux inférieurs.
    

#### Filtrer par Event ID Windows

```bash
# Analyser uniquement les événements avec un ID spécifique
./hayabusa scan -d /logs/ --eid 4624 # Scan pour l'Event ID 4624 (Logon réussi)

# Exclure des Event IDs
./hayabusa scan -d /logs/ --exclude-eid 4688,4689
```

- **Usage :** Utile pour cibler des types d'événements spécifiques lors d'une investigation.
    

#### Filtrer par Période Temporelle

```bash
# Spécifier une date/heure de début
./hayabusa scan -d /logs/ --start "YYYY-MM-DDTHH:MM:SS"

# Spécifier une date/heure de fin
./hayabusa scan -d /logs/ --end "YYYY-MM-DDTHH:MM:SS"

# Combiner début et fin
./hayabusa scan -d /logs/ --start "2024-04-01T00:00:00" --end "2024-04-01T23:59:59"
```

- **Usage :** Concentrer l'analyse sur une période d'intérêt spécifique (ex: autour d'un incident).
    

#### Utiliser des Règles Sigma Spécifiques

```bash
# Utiliser uniquement une règle spécifique
./hayabusa scan -d /logs/ --rule /chemin/vers/ma/regle.yml

# Utiliser uniquement les règles d'un dossier spécifique
./hayabusa scan -d /logs/ --rule /chemin/vers/mon/dossier/de/regles/
```

- **Usage :** Tester une nouvelle règle ou se concentrer sur un type de menace particulier.
    

### Regeln **Gestion des Règles Sigma**

#### Mettre à Jour les Règles

```bash
./hayabusa update-rules
```

- **Contexte :** Télécharge les dernières règles depuis les dépôts configurés dans `config/rule-config.yml` (par défaut, le dépôt Sigma principal et celui de Hayabusa).
    
- **Usage :** **Crucial** à faire régulièrement pour bénéficier des dernières détections de menaces.
    

#### Lister les Règles Chargées

```bash
./hayabusa list-rules [--rule-level <level>] [--rule-status <status>]
```

- **Contexte :** Affiche les règles qui seront utilisées par Hayabusa lors d'un scan.
    
- **Usage :** Vérifier quelles règles sont actives, filtrer par niveau (`high`, `critical`, etc.) ou statut (`stable`, `experimental`, etc.).
    

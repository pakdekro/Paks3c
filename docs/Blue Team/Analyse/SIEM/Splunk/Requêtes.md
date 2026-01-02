### 🎯 Requêtes de Base

#### Recherche Simple

```spl
index=[nom_index] "terme spécifique"
```

#### Recherche dans une Plage de Temps

```spl
index=[nom_index] earliest=-1h latest=now "terme spécifique"
```

_`-1h` pour la dernière heure, `now` pour le moment actuel._

#### Utiliser les Jokers

```spl
index=[nom_index] source="*chemin/fichier*log"
```

---
### 📜Filtrage et Sélection

#### Filtrer par Champ

```spl
index=[nom_index] [champ]=[valeur]
```

#### Utiliser `AND`, `OR`, `NOT`

```spl
index=[nom_index] (erreur OR échec) AND utilisateurs="John Doe" NOT source="/var/log/syslog"
```

---
### 💹 Commandes Statistiques et Agrégation

#### Compter les Occurrences

```spl
index=[nom_index] | stats count
```

#### Compter par Catégorie

```spl
index=[nom_index] | stats count by [champ]
```

#### Trouver des Valeurs Uniques

```spl
index=[nom_index] | dedup [champ]
```

#### Calculs Statistiques (Moyenne, Max, Min, etc.)

```spl
index=[nom_index] | stats avg([champ]), max([champ]), min([champ])
```

---
### ♻ Tri et Limitation

#### Trier les Résultats

```spl
index=[nom_index] | sort - [champ]
```
_`-` pour trier en ordre décroissant._

#### Limiter les Résultats

```spl
index=[nom_index] | head 10
```
_Affiche les 10 premiers résultats._

---
### ➗ Groupement et Subdivisions

#### Grouper par Champ

```spl
index=[nom_index] | stats count by [champ]
```

#### Utiliser `timechart` pour des Tendances Temporelles

```spl
index=[nom_index] | timechart count by [champ]
```

---
### 🔥 Recherche Avancée

#### Recherche avec Sous-requêtes

```spl
index=[nom_index] [ search index=[autre_index] [champ]=[valeur] ]
```

#### Jointures entre Sources de Données

```spl
index=[nom_index1] | join type=outer [champ] [ search index=[nom_index2] ]
```

---
### 💱 Extraction et Transformation

#### Extraire des Champs Automatiquement

```spl
index=[nom_index] | extract
```

#### Renommer des Champs

```spl
index=[nom_index] | rename [ancien_nom] as [nouveau_nom]
```

#### Utiliser `eval` pour des Calculs ou Transformations

```spl
index=[nom_index] | eval [nouveau_champ]=[expression]
```

---
### ☑ Visualisation et Exportation

#### Générer un Tableau

```spl
index=[nom_index] | table [champ1] [champ2] [champ3]
```

#### Exporter des Résultats

```spl
index=[nom_index] | outputcsv [nom_fichier.csv]
```
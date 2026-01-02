### 🚀 Configuration Initiale

#### Configuration du nom d'utilisateur

```bash
git config --global user.name "Votre Nom"
```

Cette commande configure le nom associé à vos futurs commits à l’échelle globale (pour votre utilisateur). Ainsi, Git saura toujours quel nom attribuer aux modifications que vous effectuez.
#### Configuration de l'email

```bash
git config --global user.email "votre.email@example.com"
```

De même, cette commande définit l’adresse email qui apparaîtra dans l’historique des commits. Elle doit idéalement correspondre à l’adresse avec laquelle vous vous identifiez sur une plateforme Git (ex. GitHub, GitLab).
#### Afficher la configuration

```bash
git config --list
```

Permet de lister toutes les configurations Git actuellement en vigueur. Vous pouvez vérifier ici que votre nom, votre email et d’autres réglages sont correctement configurés.
#### Éditer la configuration

```bash
git config --global --edit
```

Ouvre le fichier de configuration Git (global) dans votre éditeur par défaut pour apporter des modifications manuelles. C’est utile pour corriger ou personnaliser certains paramètres plus avancés.

---
### 🍼 Commandes de Base

#### Initialiser un dépôt Git

```bash
git init
```

Crée un nouveau dépôt Git dans le dossier courant, en initialisant un répertoire.
#### Cloner un dépôt existant

```bash
git clone <url>
```

Permet de récupérer un dépôt Git existant (par exemple depuis GitHub ou un serveur privé) dans un nouveau dossier local. Vous obtenez ainsi l’historique complet et la dernière version des fichiers.
#### Ajouter des fichiers au staging area

```bash
git add <fichier>
git add .
```

Prépare les fichiers spécifiés (ou tous les fichiers présents avec `git add .`) pour le prochain commit. Vous indiquez ainsi à Git précisément quelles modifications vous souhaitez enregistrer.
#### Vérifier le statut des fichiers

```bash
git status
```

Affiche l’état actuel du dépôt : vous pouvez voir quels fichiers sont modifiés, ajoutés, en attente de commit ou ignorés. Très pratique pour faire le point avant de valider vos changements.
#### Afficher les modifications

```bash
git diff
```

Montre ligne par ligne ce qui a été modifié dans vos fichiers. Vous pouvez ainsi identifier précisément les changements en attente de validation (ou entre deux commits spécifiques si vous utilisez `git diff <commit1> <commit2>`).
#### Commit les changements

```bash
git commit -m "Message du commit"
```

Enregistre de façon définitive dans l’historique local les modifications que vous aviez ajoutées au staging area (avec `git add`). Le message de commit doit être clair et descriptif pour retracer l’évolution du projet.
#### Afficher l'historique des commits

```bash
git log
git log --oneline --graph --all
```

`git log` liste tous les commits passés avec leurs informations détaillées, tandis que `--oneline --graph --all` offre une vue condensée et plus visuelle de l’historique. Cela facilite le suivi et la compréhension du travail réalisé.

---
### 🌳 Branches

#### Lister les branches

```bash
git branch
```

Affiche toutes les branches présentes dans votre dépôt local, en indiquant celle sur laquelle vous vous trouvez actuellement. Les branches sont des « lignes de développement » indépendantes.
#### Créer une nouvelle branche

```bash
git branch <nom_branche>
```

Crée une nouvelle branche à partir de la branche courante sans basculer dessus. Cela vous permet de travailler sur une fonctionnalité ou un correctif isolé du reste du projet.
#### Changer de branche

```bash
git checkout <nom_branche>
```

Bascule sur la branche spécifiée, en mettant à jour votre environnement de travail local pour refléter l’état de cette branche. Assurez-vous d’avoir commité ou sauvegardé vos modifications avant de changer de branche.
#### Créer et changer de branche

```bash
git checkout -b <nom_branche>
```

Combine la création d’une branche et le basculement sur cette dernière en une seule étape. Pratique pour gagner du temps lorsque vous débutez une nouvelle fonctionnalité.
#### Fusionner une branche dans la branche courante

```bash
git merge <nom_branche>
```

Fusionne les modifications de la branche indiquée vers la branche sur laquelle vous vous situez. Attention aux éventuels conflits qu’il faudra résoudre si des modifications contradictoires ont été réalisées.
#### Supprimer une branche

```bash
git branch -d <nom_branche>
```

Supprime la branche spécifiée si elle a déjà été fusionnée ou si vous avez bien géré son contenu. C’est une bonne pratique pour garder un environnement propre lorsque la branche n’est plus nécessaire.

---
### 🛰️ Remote Repositories

#### Ajouter un dépôt distant

```bash
git remote add origin <url>
```

Associe le dépôt local à un dépôt distant (souvent appelé `origin`). Indispensable pour pouvoir partager votre code ou récupérer les modifications d’autres contributeurs.
#### Vérifier les dépôts distants

```bash
git remote -v
```

Liste les dépôts distants (par exemple `origin`) ainsi que leurs URLs. Vous pouvez ainsi confirmer l’adresse du serveur ou du service hébergeant votre code.
#### Récupérer les modifications depuis le dépôt distant

```bash
git fetch origin
```

Télécharge les nouveaux commits et branches depuis le dépôt distant sans les fusionner automatiquement dans votre branche locale. C’est utile pour voir ce qui a changé avant de décider de fusionner.
#### Récupérer et fusionner les modifications du dépôt distant

```bash
git pull origin <nom_branche>
```

Fait à la fois un `fetch` et un `merge` (ou un `rebase`, selon la configuration). C’est la méthode la plus courante pour mettre à jour votre branche locale avec les derniers changements de vos collaborateurs.
#### Envoyer les commits locaux vers le dépôt distant

```bash
git push origin <nom_branche>
```

Envoie vos commits locaux (qui ne sont pas encore sur le serveur) vers la branche spécifiée du dépôt distant. Ainsi, les autres contributeurs peuvent récupérer vos dernières modifications.
#### Supprimer un dépôt distant

```bash
git remote remove <nom_dépôt>
```

Retire la référence au dépôt distant de votre configuration locale. Les fichiers locaux restent inchangés, mais vous ne pourrez plus effectuer de `push` ou `pull` vers le dépôt distant supprimé.
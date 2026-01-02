### 🚀 Configuration Initiale

#### Vérifier la version de Docker

```bash
docker --version
```

Affiche la version installée de Docker sur votre système. Utile pour vérifier que Docker est bien installé.

#### Lancer le service Docker

```bash
sudo systemctl start docker
```

Démarre le service Docker sur votre machine (nécessaire sous Linux).

#### Activer Docker au démarrage

```bash
sudo systemctl enable docker
```

Configure Docker pour se lancer automatiquement au démarrage du système.

#### Vérifier si Docker fonctionne

```bash
docker info
```

Affiche des informations détaillées sur l’installation, y compris l’état du daemon et les paramètres de configuration.

---

### 📦 Gestion des Conteneurs

#### Lister les conteneurs actifs

```bash
docker ps
```

Affiche la liste des conteneurs actuellement en cours d'exécution.

#### Lister tous les conteneurs (y compris stoppés)

```bash
docker ps -a
```

Affiche tous les conteneurs, y compris ceux qui sont arrêtés.

#### Lancer un conteneur

```bash
docker run <image>
```

Crée et exécute un conteneur basé sur l’image spécifiée.

#### Lancer un conteneur en arrière-plan (détaché)

```bash
docker run -d <image>
```

Exécute un conteneur en arrière-plan et renvoie son ID.

#### Lancer un conteneur interactif

```bash
docker run -it <image> /bin/bash
```

Lance un conteneur en mode interactif et ouvre un terminal (`bash` dans cet exemple).

#### Arrêter un conteneur

```bash
docker stop <id_containeur>
```

Arrête un conteneur en cours d'exécution.

#### Redémarrer un conteneur

```bash
docker restart <id_containeur>
```

Arrête et relance un conteneur.

#### Supprimer un conteneur

```bash
docker rm <id_containeur>
```

Supprime un conteneur arrêté. Il faut d’abord l’arrêter si nécessaire.

#### Supprimer tous les conteneurs arrêtés

```bash
docker container prune
```

Nettoie et supprime tous les conteneurs qui ne sont pas en cours d'exécution.

---

### 🏗 Gestion des Images

#### Lister les images disponibles

```bash
docker images
```

Affiche la liste des images Docker présentes sur votre machine.

#### Télécharger une image

```bash
docker pull <image>
```

Récupère l’image spécifiée depuis Docker Hub ou un registre privé.

#### Supprimer une image

```bash
docker rmi <image_id>
```

Supprime l’image spécifiée.

#### Supprimer toutes les images inutilisées

```bash
docker image prune
```

Supprime toutes les images qui ne sont plus utilisées par des conteneurs.

---

### 🔄 Gestion des Volumes

#### Lister les volumes

```bash
docker volume ls
```

Affiche tous les volumes Docker disponibles.

#### Créer un volume

```bash
docker volume create <nom_volume>
```

Crée un volume qui pourra être utilisé par les conteneurs.

#### Supprimer un volume

```bash
docker volume rm <nom_volume>
```

Supprime un volume inutilisé.

#### Supprimer tous les volumes non utilisés

```bash
docker volume prune
```

Nettoie et supprime tous les volumes qui ne sont plus utilisés.

---

### 🏗 Gestion des Réseaux

#### Lister les réseaux Docker

```bash
docker network ls
```

Affiche tous les réseaux disponibles sur Docker.

#### Créer un réseau

```bash
docker network create <nom_reseau>
```

Crée un réseau personnalisé pour connecter des conteneurs.

#### Ajouter un conteneur à un réseau

```bash
docker network connect <nom_reseau> <id_conteneur>
```

Ajoute un conteneur spécifique à un réseau Docker.

#### Supprimer un réseau

```bash
docker network rm <nom_reseau>
```

Supprime un réseau qui n’est plus utilisé.

---

### 🔍 Inspection et Debug

#### Voir les logs d'un conteneur

```bash
docker logs <id_containeur>
```

Affiche les logs générés par le conteneur en cours d'exécution.

#### Suivre les logs en temps réel

```bash
docker logs -f <id_containeur>
```

Affiche les logs en continu (`-f` pour _follow_).

#### Inspecter un conteneur

```bash
docker inspect <id_containeur>
```

Renvoie toutes les informations détaillées sur un conteneur (réseau, montage de volumes, environnement...).

#### Voir l'utilisation des ressources par les conteneurs

```bash
docker stats
```

Affiche en temps réel l’utilisation CPU/mémoire/disque/réseau de chaque conteneur actif.

---

### ⚙ Exécuter des Commandes dans un Conteneur

#### Exécuter une commande dans un conteneur en cours d'exécution

```bash
docker exec -it <id_containeur> /bin/bash
```

Ouvre un shell interactif dans le conteneur (utile pour le débogage).

#### Copier un fichier de l’hôte vers un conteneur

```bash
docker cp <fichier_local> <id_containeur>:/chemin/destination
```

Copie un fichier depuis l’hôte vers un conteneur.

#### Copier un fichier d’un conteneur vers l’hôte

```bash
docker cp <id_containeur>:/chemin/source <destination_local>
```

Extrait un fichier du conteneur vers la machine hôte.

---

### 📜 Gestion des Dockerfiles et Builds

#### Construire une image depuis un Dockerfile

```bash
docker build -t <nom_image> .
```

Construit une nouvelle image Docker en utilisant un `Dockerfile` dans le dossier courant.

#### Lancer un conteneur depuis une image locale

```bash
docker run <nom_image>
```

Crée et exécute un conteneur basé sur une image que vous avez construite.

---

### 🛠 Nettoyage et Maintenance

#### Supprimer tous les conteneurs arrêtés

```bash
docker container prune
```

Libère de l’espace en supprimant tous les conteneurs qui ne sont plus en cours d’exécution.

#### Supprimer toutes les images inutilisées

```bash
docker image prune
```

Efface les images qui ne sont plus utilisées par des conteneurs.

#### Supprimer tous les volumes inutilisés

```bash
docker volume prune
```

Nettoie les volumes qui ne sont plus attachés à des conteneurs.

#### Supprimer tous les réseaux inutilisés

```bash
docker network prune
```

Efface les réseaux Docker qui ne sont plus utilisés.

---

### 🏗 Docker Compose (pour les configurations multi-conteneurs)

#### Lancer un projet Docker Compose

```bash
docker-compose up -d
```

Démarre les services définis dans `docker-compose.yml` en mode détaché (`-d`).

#### Arrêter un projet Docker Compose

```bash
docker-compose down
```

Arrête et supprime les conteneurs définis dans `docker-compose.yml`.

#### Vérifier les logs des services

```bash
docker-compose logs -f
```

Affiche en temps réel les logs de tous les services définis dans `docker-compose.yml`.

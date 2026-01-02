**Objectif :** Wireshark est l'analyseur de protocoles réseau le plus utilisé au monde. Il permet de capturer le trafic réseau en temps réel ou d'analyser des fichiers de capture (`.pcap`, `.pcapng`), de décortiquer les protocoles couche par couche, et d'appliquer des filtres puissants pour isoler et comprendre les communications.

**Source :** [https://www.wireshark.org/](https://www.wireshark.org/)

---

### 🚀 **Démarrage et Capture**

  

#### Lancer Wireshark

  

* Généralement lancé depuis le menu de votre OS ou via la commande `wireshark` (peut nécessiter `sudo` sous Linux pour accéder aux interfaces réseau).

  

#### Sélectionner une Interface et Démarrer la Capture

  

* Au démarrage, Wireshark liste les interfaces réseau disponibles.

* Double-cliquez sur l'interface souhaitée (ex: `eth0`, `Wi-Fi`) pour démarrer la capture immédiatement.

* Alternativement, sélectionnez l'interface et cliquez sur l'icône en forme d'aileron de requin bleu (ou `Capture -> Start`).

  

#### Options de Capture (Avant de démarrer)

  

* Accès via `Capture -> Options...` (ou l'icône d'engrenage à côté des interfaces).

* **Filtres de Capture (BPF Syntax):** Permettent de ne capturer *que* le trafic correspondant au filtre. Utile pour limiter la taille des captures sur des réseaux très chargés.

* `host 192.168.1.10` : Trafic vers ou depuis cette IP.

* `net 192.168.1.0/24` : Trafic vers ou depuis ce sous-réseau.

* `port 80` : Trafic sur le port 80 (source ou destination).

* `tcp port 443` : Trafic TCP sur le port 443.

* `udp port 53` : Trafic UDP sur le port 53.

* `src host 10.0.0.5` : Trafic *provenant* de cette IP.

* `dst port 22` : Trafic *destiné* au port 22.

* `icmp` : Trafic ICMP uniquement.

* Combinaisons : `host 192.168.1.10 and port 80`, `not port 22`, `port 80 or port 443`.

* **Fichiers de sortie :** Configurer la sauvegarde automatique dans un ou plusieurs fichiers, avec des limites de taille ou de temps.

  

#### Arrêter la Capture

  

* Cliquez sur l'icône carrée rouge d'arrêt (ou `Capture -> Stop`).

  

---

  

### 🎨 **Interface Principale**

  

Wireshark présente généralement 3 panneaux principaux :

  

1. **Liste des Paquets (Packet List) :** Chaque ligne représente un paquet capturé (Numéro, Temps, Source IP, Destination IP, Protocole, Infos). Les couleurs indiquent souvent le type de trafic (configurable).

2. **Détails du Paquet (Packet Details) :** Arborescence montrant les différentes couches (Frame, Ethernet, IP, TCP/UDP, Application) du paquet sélectionné dans la liste. Permet d'inspecter les en-têtes et les données de chaque couche.

3. **Octets du Paquet (Packet Bytes) :** Représentation hexadécimale et ASCII du contenu brut du paquet sélectionné.

  

---

  

### 🔍 **Filtres d'Affichage (Display Filters)**

  

* **Objectif :** Masquer les paquets non pertinents *après* la capture pour se concentrer sur des communications spécifiques. La syntaxe est différente des filtres de capture.

* **Zone de Saisie :** Barre verte/rouge en haut de la fenêtre principale.

  

#### Syntaxe de Base

  

* `protocole` : Affiche uniquement les paquets de ce protocole (ex: `tcp`, `udp`, `http`, `dns`, `smb`, `arp`, `icmp`).

* `champ [opérateur] valeur` : Filtre basé sur la valeur d'un champ spécifique d'un protocole.

  

#### Opérateurs Courants

  

* `==` ou `eq` : Égal à

* `!=` ou `ne` : Différent de

* `>` ou `gt` : Supérieur à

* `<` ou `lt` : Inférieur à

* `>=` ou `ge` : Supérieur ou égal à

* `<=` ou `le` : Inférieur ou égal à

* `contains` : Le champ (ou le paquet entier `frame`) contient la chaîne de caractères ou la séquence d'octets.

* `matches` ou `~` : Le champ correspond à une expression régulière (PCRE).

  

#### Opérateurs Logiques

  

* `&&` ou `and` : ET logique

* `||` ou `or` : OU logique

* `!` ou `not` : NON logique

* Parenthèses `()` pour grouper les expressions.

  

#### Exemples de Filtres d'Affichage Utiles

  

* **Par IP :**

* `ip.addr == 192.168.1.10` (Source ou Destination)

* `ip.src == 10.0.0.5` (Source uniquement)

* `ip.dst == 8.8.8.8` (Destination uniquement)

* `not ip.addr == 192.168.1.1` (Exclure une IP)

* **Par Port :**

* `tcp.port == 443` (Port TCP source ou destination)

* `udp.port == 53` (Port UDP source ou destination)

* `tcp.dstport == 80` (Port TCP destination uniquement)

* **Par Protocole Applicatif :**

* `http` (Tout le trafic HTTP)

* `http.request.method == "POST"` (Requêtes HTTP POST)

* `http.response.code == 404` (Réponses HTTP 404 Not Found)

* `dns` (Tout le trafic DNS)

* `dns.qry.name == "www.google.com"` (Requêtes DNS pour ce nom)

* `smb2` (Trafic SMB version 2/3)

* `tls` (Trafic TLS/SSL, souvent sur port 443)

* `dhcp` (Trafic DHCP)

* **Par Flags TCP :**

* `tcp.flags.syn == 1 and tcp.flags.ack == 0` (Paquets SYN purs - début de connexion)

* `tcp.flags.reset == 1` (Paquets RST - connexion réinitialisée)

* `tcp.flags.fin == 1` (Paquets FIN - fin de connexion)

* **Par Contenu :**

* `frame contains "password"` (Recherche la chaîne "password" n'importe où dans le paquet)

* `http contains "USER-AGENT: curl"` (Recherche dans les paquets HTTP)

* `tcp.payload contains 4d:5a` (Recherche la séquence d'octets `MZ` dans le payload TCP)

* **Combinaisons :**

* `ip.addr == 192.168.1.50 && tcp.port == 80` (Trafic HTTP vers/depuis 192.168.1.50)

* `http || dns` (Affiche le trafic HTTP ou DNS)

* `ip.addr == 10.0.0.10 and not port 53` (Trafic vers/depuis 10.0.0.10, sauf DNS)

  

> [!Astuce]

> Wireshark propose l'auto-complétion pour les filtres. Commencez à taper un protocole (ex: `ip.`) pour voir les champs disponibles. La barre de filtre devient verte si la syntaxe est valide, rouge sinon. Cliquez sur "Expression..." pour un constructeur de filtres graphique.

  

---

  

### 🔬 **Analyse du Trafic**

  

#### Suivre une Conversation (Stream)

  

* **Objectif :** Reconstituer et visualiser l'échange de données complet entre deux points pour un protocole spécifique.

* **Comment faire :** Clic droit sur un paquet de la conversation -> `Follow` -> `TCP Stream` (ou `UDP Stream`, `HTTP Stream`, `TLS Stream`, etc.).

* **Usage :** Très utile pour lire des requêtes/réponses HTTP, voir des échanges de données applicatives, ou comprendre le déroulement d'une connexion TCP.

  

#### Statistiques

  

* Accès via le menu `Statistics`.

* **Conversations :** Liste les échanges entre paires d'adresses (Ethernet, IPv4, IPv6, TCP, UDP). Utile pour voir qui communique le plus avec qui.

* **Endpoints :** Similaire à Conversations, mais liste toutes les adresses uniques et leurs statistiques de trafic.

* **Protocol Hierarchy :** Montre la répartition du trafic par protocole. Utile pour avoir une vue d'ensemble rapide de ce qui transite sur le réseau.

* **IO Graphs :** Permet de visualiser le débit du trafic (total ou filtré) au fil du temps. Utile pour repérer des pics d'activité ou des transferts de données importants.

* **Resolved Addresses :** Affiche les correspondances entre adresses IP/MAC et les noms résolus (DNS, NetBIOS).

  

#### Exportation d'Objets

  

* **Objectif :** Extraire des fichiers transférés via certains protocoles.

* **Comment faire :** `File -> Export Objects -> HTTP...` (ou `SMB`, `DICOM`, etc.).

* **Usage :** Permet de récupérer des images, des exécutables, des documents, etc., téléchargés via HTTP ou transférés via SMB.

  

#### Analyse Experte

  

* **Objectif :** Laisser Wireshark identifier des problèmes potentiels ou des anomalies dans la capture.

* **Comment faire :** `Analyze -> Expert Information`.

* **Usage :** Peut signaler des retransmissions TCP excessives, des erreurs, des paquets malformés, etc. (Notes, Chats, Warnings, Errors).

  

#### Navigation et Recherche

  

* `Ctrl + F` (ou `Edit -> Find Packet...`) : Rechercher un paquet basé sur un filtre d'affichage, une chaîne hexadécimale ou une chaîne de caractères.

* `Ctrl + G` (ou `Go -> Go to Packet...`) : Aller directement à un numéro de paquet spécifique.

* `Ctrl + Flèche Droite` / `Ctrl + Flèche Gauche` : Naviguer vers le paquet suivant/précédent dans l'historique de sélection.

* `Clic droit -> Apply as Filter` / `Prepare a Filter` : Créer rapidement des filtres basés sur les champs du paquet sélectionné.

  

---

  

### ✨ **Astuces Utiles**

  

* **Coloration :** Personnalisez les règles de coloration (`View -> Coloring Rules...`) pour mettre en évidence le trafic qui vous intéresse le plus (ex: paquets RST en rouge vif, trafic DNS en jaune).

* **Profils :** Créez différents profils (`Edit -> Configuration Profiles...`) pour sauvegarder des ensembles de configurations (colonnes affichées, règles de coloration, filtres préférés) adaptés à différents types d'analyses.

* **Colonnes :** Personnalisez les colonnes affichées dans la liste des paquets (`Edit -> Preferences -> Appearance -> Columns`) pour afficher directement des informations pertinentes (ex: `http.host`, `dns.qry.name`).

* **Résolution de Noms :** Activez/désactivez la résolution de noms (`View -> Name Resolution`) pour voir les noms DNS/NetBIOS au lieu des adresses IP (peut ralentir l'affichage).

* **Commentaires :** Ajoutez des commentaires aux paquets (`Clic droit -> Packet Comment...`) pour annoter vos découvertes pendant l'analyse.
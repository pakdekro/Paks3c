**Objectif :** Nmap (Network Mapper) est un outil open-source incontournable pour l'exploration de réseaux et l'audit de sécurité. Il permet de découvrir des hôtes, les ports ouverts, les services en cours d'exécution, les systèmes d'exploitation, et de détecter des vulnérabilités via son moteur de scripts (NSE).

**Source :** [https://github.com/nmap/nmap](https://github.com/nmap/nmap) | [https://nmap.org/](https://nmap.org/)

**Syntaxe Générale :** `nmap [Type(s) de Scan] [Options] {cible}`

---

### ⚙️ **Options Courantes**

* `-iL <fichier_cibles>` : Lit les cibles depuis un fichier.
* `-p <ports>` : Spécifie les ports à scanner (ex: `-p 22`, `-p 1-100`, `-p U:53,T:21-25,80`). `-p-` pour scanner tous les 65535 ports TCP.
* `-F` : Scan Rapide (moins de ports que le scan par défaut).
* `-n` : Ne pas faire de résolution DNS (accélère le scan).
* `-Pn` : Ne pas faire de découverte d'hôte (ping scan) - Traiter toutes les cibles comme si elles étaient en ligne. Utile si les pings ICMP sont bloqués.
* `-v` / `-vv` : Augmente le niveau de verbosité (plus d'informations pendant le scan).
* `-oN <fichier.nmap>` : Sauvegarde la sortie au format normal.
* `-oX <fichier.xml>` : Sauvegarde la sortie au format XML.
* `-oG <fichier.gnmap>` : Sauvegarde la sortie au format "grepable".
* `-oA <basename>` : Sauvegarde la sortie dans les trois formats principaux (`.nmap`, `.xml`, `.gnmap`).
* `-T<0-5>` : Définit le template de timing (0=paranoïaque, 1=discret, 2=poli, 3=normal, 4=agressif, 5=fou). `-T4` est souvent un bon compromis vitesse/discrétion.
* `--min-rate <paquets/sec>` : Envoie au moins ce nombre de paquets par seconde.
* `--max-retries <nombre>` : Nombre maximal de retransmissions de paquets.

---

### 🎯 **Découverte d'Hôtes (Ping Scan)**

* **Objectif :** Identifier rapidement quels hôtes sont actifs sur un réseau sans scanner leurs ports.

```bash
# Ping Scan simple (ICMP Echo, TCP SYN sur 443, TCP ACK sur 80, ICMP Timestamp)
nmap -sn <cible | plage_reseau>
```

* **Contexte :** Étape initiale de reconnaissance pour cartographier les machines actives.
* **Usage :** Rapide et léger pour déterminer la portée du réseau à analyser plus en profondeur.
* **OPSEC :** Moins bruyant qu'un scan de ports, mais les pings peuvent être détectés ou bloqués.

---

### 🚪 **Scan de Ports**

* **Objectif :** Identifier quels ports TCP ou UDP sont ouverts, fermés ou filtrés sur une cible.

```bash
# Scan TCP SYN (Half-Open) - Défaut pour utilisateur root
nmap -sS <cible>
```

* **Contexte :** Envoie un paquet SYN, attend un SYN/ACK (port ouvert) ou RST (port fermé). Ne complète pas la connexion TCP.
* **Usage :** Scan rapide et relativement discret, souvent le choix par défaut.
* **Prérequis :** Nécessite des privilèges root (ou équivalent) pour créer des paquets bruts.
* **OPSEC :** Plus discret que le scan Connect (`-sT`) car la connexion n'est pas établie, mais reste détectable par les IDS/IPS.

```bash
# Scan TCP Connect - Défaut pour utilisateur non-root
nmap -sT <cible>
```

* **Contexte :** Utilise l'appel système `connect()` pour établir une connexion TCP complète.
* **Usage :** Alternative si `-sS` n'est pas possible (pas de droits root). Plus fiable dans certains cas mais plus lent.
* **OPSEC :** Très bruyant car il établit des connexions complètes, facilement logué par la cible.

```bash
# Scan UDP
nmap -sU <cible>
```

* **Contexte :** Envoie des paquets UDP aux ports spécifiés. L'interprétation des réponses (ou absences de réponse) est complexe (ICMP Port Unreachable = fermé, réponse UDP = ouvert, pas de réponse = ouvert|filtré).
* **Usage :** Découverte de services UDP (DNS, SNMP, DHCP...). Souvent combiné avec `-sV`.
* **OPSEC :** Très lent car UDP est sans connexion et Nmap doit gérer les timeouts et les limitations de débit ICMP.

```bash
# Scans TCP Avancés (FIN, Xmas, Null)
nmap -sF <cible>  # Scan FIN
nmap -sX <cible>  # Scan Xmas (Flags FIN, PSH, URG)
nmap -sN <cible>  # Scan Null (Aucun flag)
```

* **Contexte :** Envoient des paquets TCP avec des combinaisons de flags spécifiques. Exploite les subtilités de la RFC 793 pour différencier les ports ouverts et fermés (un port fermé devrait répondre par RST, un port ouvert devrait ignorer).
* **Usage :** Tentatives de scans plus discrets, peuvent parfois contourner certains firewalls/IDS simples.
* **OPSEC :** Efficacité variable selon l'OS cible (fonctionne bien sur UNIX, moins sur Windows). Facilement détectable par des IDS modernes.

```bash
# Scan TCP ACK
nmap -sA <cible>
```

* **Contexte :** Envoie des paquets ACK. Ne détermine pas si un port est ouvert, mais peut aider à déterminer si un port est *filtré* par un firewall stateful (RST reçu = non filtré, pas de réponse ou ICMP Unreachable = filtré).
* **Usage :** Cartographie des règles de firewall.

---

### 🔬 **Détection de Versions et OS**

* **Objectif :** Identifier le service exact tournant sur un port ouvert, sa version, et le système d'exploitation de la cible.

```bash
# Détection des versions des services
nmap -sV <cible>
```

* **Contexte :** Se connecte aux ports ouverts et envoie une série de sondes pour analyser les bannières et les réponses afin d'identifier le service et sa version.
* **Usage :** Essentiel pour identifier les vulnérabilités potentielles liées à des versions spécifiques de logiciels.
* **OPSEC :** Plus interactif et donc plus bruyant qu'un simple scan de ports.

```bash
# Détection de l'OS
nmap -O <cible>
```

* **Contexte :** Analyse les réponses TCP/IP (fenêtre TCP, options, séquencement ISN, réponses ICMP...) pour deviner le système d'exploitation de la cible.
* **Usage :** Comprendre l'environnement cible.
* **Prérequis :** Nécessite au moins un port ouvert et un port fermé sur la cible pour être fiable.
* **OPSEC :** Peut être détecté. La fiabilité dépend de la cible.

```bash
# Scan Agressif (Combine -sV, -O, -sC, --traceroute)
nmap -A <cible>
```

* **Contexte :** Raccourci pratique pour lancer plusieurs scans utiles en une seule commande : détection OS (`-O`), détection de version (`-sV`), scan avec scripts par défaut (`-sC`) et traceroute.
* **Usage :** Scan de reconnaissance complet et rapide.
* **OPSEC :** Très bruyant en raison de la combinaison de plusieurs techniques intrusives.

---

### 🚒 **Techniques de Contournement et Évasion**

* **Objectif :** Tenter de rendre le scan moins détectable par les firewalls et IDS/IPS.

```bash
# Fragmentation des paquets
nmap -f <cible>
```

* **Contexte :** Divise les paquets TCP en plus petits fragments.
* **Usage :** Peut parfois contourner des filtres de paquets ou IDS anciens qui ne réassemblent pas correctement les fragments.
* **OPSEC :** Efficacité limitée contre les systèmes modernes.

```bash
# Spécifier un MTU (Maximum Transmission Unit)
nmap --mtu <multiple_de_8> <cible>
# Exemple: nmap --mtu 8 <cible>
```

* **Contexte :** Similaire à `-f`, mais permet un contrôle plus fin sur la taille des fragments.
* **Usage :** Technique d'évasion.

```bash
# Utiliser des leurres (Decoys)
nmap -D RND:10,<votre_ip>,<ip_leurre1>,ME <cible>
# RND:10 : 10 adresses IP aléatoires
# ME : Votre propre adresse IP (position importante)
```

* **Contexte :** Envoie des paquets de scan semblant provenir d'autres adresses IP (leurres) en plus de la vôtre.
* **Usage :** Tente de masquer votre adresse IP réelle dans les logs de la cible.
* **OPSEC :** Ne fonctionne que si la cible ne filtre pas les paquets par IP source. Peut inonder la cible et les leurres. Nécessite des privilèges root.

```bash
# Spécifier un port source
nmap --source-port <port> <cible>
# Exemple: nmap -g 53 <cible> (utiliser le port 53, souvent autorisé)
```

* **Contexte :** Force Nmap à utiliser un port source spécifique (ex: 53 pour DNS, 80 pour HTTP) au lieu d'un port aléatoire.
* **Usage :** Peut contourner des firewalls simples qui filtrent sur le port source.

---

### 📜 **Nmap Scripting Engine (NSE)**

* **Objectif :** Automatiser des tâches de reconnaissance et de détection de vulnérabilités grâce à des scripts Lua.

```bash
# Exécuter les scripts par défaut (considérés comme sûrs)
nmap -sC <cible>
# Souvent combiné avec -sV : nmap -sV -sC <cible>
```

* **Contexte :** Lance une sélection de scripts NSE jugés utiles et non intrusifs pour la reconnaissance.
* **Usage :** Découverte d'informations supplémentaires sur les services (titres de pages web, partages SMB, etc.).

```bash
# Exécuter des scripts d'une catégorie spécifique (ex: vulnérabilités)
nmap --script=vuln <cible>
```

* **Contexte :** Lance tous les scripts appartenant à la catégorie `vuln`.
* **Usage :** Détection automatisée de vulnérabilités connues.
* **OPSEC :** Peut être très intrusif et potentiellement dangereux selon les scripts exécutés. À utiliser avec précaution.

```bash
# Exécuter un script spécifique
nmap --script=<nom_script> <cible>
# Exemple: nmap -p 445 --script=smb-os-discovery <cible>
```

* **Usage :** Lancer un script précis pour une tâche spécifique.

```bash
# Exécuter plusieurs scripts ou utiliser des wildcards
nmap --script "http-*" <cible> # Tous les scripts commençant par http-
nmap --script "smb-enum-*,smb-vuln-*" <cible> # Scripts d'énumération et de vulnérabilité SMB
```

* **Usage :** Cibler des ensembles de scripts pour une analyse plus approfondie d'un service.

```bash
# Passer des arguments à un script
nmap --script <nom_script> --script-args <arg1=val1,arg2=val2> <cible>
# Exemple: nmap -p 80 --script http-enum --script-args http-enum.fingerprintfile=custom_fingerprints.txt <cible>
```

* **Usage :** Personnaliser le comportement de certains scripts NSE.

#### Exemples de Scripts NSE Utiles :

* `http-title`: Récupère le titre des pages web.
* `smb-os-discovery`: Tente de déterminer l'OS via SMB.
* `smb-enum-shares`: Énumère les partages SMB.
* `smb-vuln-*`: Recherche des vulnérabilités SMB spécifiques (ex: `smb-vuln-ms17-010`).
* `ssl-enum-ciphers`: Énumère les chiffrements SSL/TLS supportés.
* `dns-zone-transfer`: Tente un transfert de zone DNS.
* `ftp-anon`: Vérifie si une connexion FTP anonyme est possible.

**Actif (Asset)**
*Définition :* Toute ressource ayant de la valeur pour une organisation et nécessitant une protection. Cela peut inclure des données, du matériel, des logiciels, des infrastructures, la réputation, etc.

**Analyse Comportementale (Behavioral Analysis)**
*Définition :* Technique de détection qui se concentre sur les actions et les modèles d'activité (d'un utilisateur, d'un processus, du trafic réseau) plutôt que sur des signatures spécifiques, afin d'identifier des anomalies potentiellement malveillantes.

**Analyse Forensique / Investigation Numérique (Digital Forensics)**
*Définition :* Processus d'investigation scientifique visant à collecter, analyser et préserver des preuves numériques (sur des disques durs, mémoires, logs, etc.) suite à un incident de sécurité, souvent dans un but légal ou de compréhension de l'attaque.

**Antivirus (AV)**
*Définition :* Logiciel conçu pour détecter, prévenir et supprimer les logiciels malveillants (malware), principalement basé sur des signatures de menaces connues. Les versions modernes incluent souvent des analyses heuristiques et comportementales.

**Attaque par Déni de Service (Denial of Service - DoS)**
*Définition :* Attaque visant à rendre une ressource informatique (serveur, service, réseau) indisponible pour ses utilisateurs légitimes, généralement en la submergeant de trafic ou de requêtes.

**Attaque par Déni de Service Distribué (Distributed Denial of Service - DDoS)**
*Définition :* Variante de l'attaque DoS où l'attaque provient de multiples sources compromises (souvent un botnet), rendant la mitigation plus complexe.

**Attaque par Force Brute (Brute Force Attack)**
*Définition :* Méthode d'attaque consistant à essayer systématiquement toutes les combinaisons possibles (de mots de passe, de clés de chiffrement) jusqu'à trouver la bonne.

**Attaque par Homme du Milieu (Man-in-the-Middle - MitM)**
*Définition :* Attaque où l'attaquant s'interpose secrètement entre deux parties qui communiquent, interceptant, voire modifiant, leurs échanges sans qu'elles s'en rendent compte.

**Authentification (Authentication)**
*Définition :* Processus de vérification de l'identité déclarée d'un utilisateur, d'un service ou d'un système. Répond à la question "Qui êtes-vous ?".

**Authentification Multi-Facteurs (Multi-Factor Authentication - MFA)**
*Définition :* Méthode d'authentification nécessitant la validation d'au moins deux facteurs de vérification différents parmi : quelque chose que l'utilisateur connaît (mot de passe), quelque chose qu'il possède (téléphone, token), et quelque chose qu'il est (biométrie).

**Autorisation (Authorization)**
*Définition :* Processus déterminant les droits d'accès d'une identité authentifiée à des ressources spécifiques. Répond à la question "Qu'avez-vous le droit de faire ?".

**Bac à Sable (Sandbox)**
*Définition :* Environnement d'exécution isolé et contrôlé où des logiciels potentiellement dangereux peuvent être exécutés et analysés sans risque pour le système hôte ou le réseau.

**Bastion (Bastion Host / Jump Host)**
*Définition :* Serveur sécurisé et renforcé, servant de point d'accès unique et contrôlé depuis une zone non sécurisée vers une zone sécurisée du réseau.

**Botnet**
*Définition :* Réseau de machines compromises (ordinateurs, objets connectés...) contrôlées à distance par un attaquant (le "botmaster"), souvent utilisé pour lancer des attaques DDoS, envoyer du spam, ou miner des cryptomonnaies.

**Chasse aux Menaces (Threat Hunting)**
*Définition :* Processus proactif et itératif de recherche de menaces ou d'attaquants déjà présents dans un réseau mais non détectés par les outils de sécurité automatisés.

**Chiffrement (Encryption)**
*Définition :* Processus de transformation de données (texte clair) en un format illisible (texte chiffré) à l'aide d'un algorithme et d'une clé, afin d'en assurer la confidentialité. Seul celui qui possède la clé de déchiffrement peut retrouver les données originales.

**Confidentialité, Intégrité, Disponibilité (Confidentiality, Integrity, Availability - CIA Triad)**
*Définition :* Modèle fondamental de la sécurité de l'information.
    * *Confidentialité :* Assurer que l'information n'est accessible qu'aux personnes autorisées.
    * *Intégrité :* Garantir que l'information est exacte, complète et n'a pas été modifiée de manière non autorisée.
    * *Disponibilité :* Assurer que l'information et les systèmes sont accessibles aux utilisateurs autorisés quand ils en ont besoin.

**Contrôle d'Accès (Access Control)**
*Définition :* Ensemble des mécanismes et politiques visant à restreindre l'accès aux ressources (systèmes, données) uniquement aux entités autorisées.

**Contournement de Défenses (Defense Evasion)**
*Définition :* Techniques utilisées par les attaquants pour éviter d'être détectés par les mesures de sécurité (antivirus, EDR, IDS/IPS). Exemples : obfuscation de code, utilisation de chiffrement, modification de signatures.

**Credential Stuffing**
*Définition :* Attaque automatisée consistant à utiliser des listes d'identifiants et mots de passe volés (souvent issus de fuites de données d'autres services) pour tenter de se connecter à de nombreux comptes sur un service cible.

**Cross-Site Scripting (XSS)**
*Définition :* Vulnérabilité web permettant à un attaquant d'injecter du code malveillant (généralement du JavaScript) dans une page web vue par d'autres utilisateurs. Peut servir à voler des cookies de session, rediriger des utilisateurs, etc.

**Défense en Profondeur (Defense in Depth)**
*Définition :* Stratégie de sécurité consistant à mettre en place plusieurs couches de défenses successives, de sorte que si une couche échoue, une autre peut prendre le relais pour arrêter ou ralentir l'attaquant.

**Endpoint Detection and Response (EDR)**
*Définition :* Solution de sécurité pour les terminaux (ordinateurs, serveurs) qui surveille en continu, collecte des données d'activité, analyse les menaces (souvent via analyse comportementale et IA) et fournit des capacités de réponse aux incidents (isolation, remédiation).

**Exploit**
*Définition :* Morceau de code, séquence de commandes ou données spécifiques qui tire parti d'une vulnérabilité dans un système ou un logiciel pour provoquer un comportement imprévu ou non désiré, souvent pour obtenir un accès non autorisé ou exécuter du code.

**Exfiltration (Data Exfiltration)**
*Définition :* Transfert non autorisé de données depuis un système ou un réseau vers une destination externe contrôlée par l'attaquant.

**Faille Zero-Day (Zero-Day Vulnerability / 0-day)**
*Définition :* Vulnérabilité de sécurité qui est inconnue de l'éditeur du logiciel ou du public, et pour laquelle aucun correctif (patch) n'existe encore. Les exploits ciblant ces failles sont appelés "exploits zero-day".

**Fonction de Hachage (Hash Function)**
*Définition :* Algorithme mathématique qui transforme une quantité de données d'entrée (de taille variable) en une chaîne de caractères de taille fixe (le "hash" ou "condensat"). Utilisé pour vérifier l'intégrité des données (si les données changent, le hash change) et stocker les mots de passe de manière sécurisée (on stocke le hash, pas le mot de passe en clair). Exemples : SHA-256, MD5 (obsolète).

**Hameçonnage / Filoutage (Phishing)**
*Définition :* Technique d'ingénierie sociale visant à tromper un utilisateur pour qu'il divulgue des informations sensibles (identifiants, mots de passe, informations bancaires) en se faisant passer pour une entité de confiance (banque, service en ligne) via email, SMS (smishing) ou téléphone (vishing).

**Hameçonnage Ciblé (Spear Phishing)**
*Définition :* Variante du phishing où l'attaque est spécifiquement ciblée sur une personne ou un groupe restreint, utilisant des informations personnelles ou contextuelles pour rendre le message plus crédible.

**Hameçonnage Ciblé de Haut Niveau / Chasse à la Baleine (Whaling)**
*Définition :* Spear phishing visant spécifiquement des cadres dirigeants ou des personnalités importantes ("baleines") au sein d'une organisation.

**Honeypot / Pot de Miel**
*Définition :* Système ou ressource informatique délibérément exposé et configuré pour attirer et piéger les attaquants, afin d'étudier leurs méthodes, collecter des informations sur les menaces ou détourner leur attention des systèmes réels.

**Ingénierie Inverse / Rétro-ingénierie (Reverse Engineering)**
*Définition :* Processus d'analyse d'un système, d'un logiciel ou d'un composant pour comprendre sa conception, son fonctionnement interne ou ses algorithmes, souvent à partir du code compilé ou de l'objet physique. Utilisé pour l'analyse de malware, la recherche de vulnérabilités, ou la compréhension de protocoles.

**Ingénierie Sociale (Social Engineering)**
*Définition :* Art de manipuler psychologiquement les personnes pour les inciter à effectuer des actions ou à divulguer des informations confidentielles. Le phishing est une forme d'ingénierie sociale.

**Injection SQL (SQL Injection - SQLi)**
*Définition :* Vulnérabilité web permettant à un attaquant d'injecter des commandes SQL malveillantes dans les requêtes envoyées par une application à sa base de données. Peut permettre de lire, modifier ou supprimer des données, voire de prendre le contrôle du serveur de base de données.

**Intrusion Detection System (IDS) / Intrusion Prevention System (IPS)**
*Définition :*
    * *IDS :* Système qui surveille le trafic réseau ou l'activité système à la recherche de signes d'activités malveillantes ou de violations de politiques, et génère des alertes.
    * *IPS :* Similaire à l'IDS, mais capable en plus de bloquer activement le trafic ou l'activité détectée comme malveillante.

**Journalisation / Logs (Logging)**
*Définition :* Enregistrement chronologique des événements survenant dans un système ou une application. Essentiel pour la surveillance, le dépannage, l'audit et l'analyse forensique.

**Logiciel Malveillant / Maliciel (Malware - Malicious Software)**
*Définition :* Terme générique désignant tout logiciel conçu dans le but de nuire à un système informatique, de voler des données ou de perturber son fonctionnement. Inclut les virus, vers, chevaux de Troie, ransomwares, spywares, etc.
    * *Virus :* Malware qui s'attache à un programme légitime et se propage lorsque ce programme est exécuté.
    * *Ver (Worm) :* Malware autonome qui se propage activement sur les réseaux en exploitant des vulnérabilités, sans nécessiter d'interaction utilisateur ou de programme hôte.
    * *Cheval de Troie (Trojan Horse) :* Malware déguisé en logiciel légitime ou utile pour tromper l'utilisateur et l'inciter à l'installer. Ne se propage généralement pas de lui-même.
    * *Rançongiciel / Logiciel rançonneur (Ransomware) :* Malware qui chiffre les fichiers de la victime ou bloque l'accès au système, puis exige une rançon en échange de la clé de déchiffrement ou du déblocage.
    * *Logiciel Espion (Spyware) :* Malware qui collecte secrètement des informations sur l'utilisateur ou son activité (frappes clavier, sites visités, identifiants) et les envoie à l'attaquant.

**Mouvement Latéral (Lateral Movement)**
*Définition :* Techniques utilisées par un attaquant, après avoir compromis une première machine dans un réseau, pour se déplacer et accéder à d'autres systèmes au sein de ce même réseau, souvent dans le but d'atteindre des cibles de plus grande valeur ou d'étendre son contrôle.

**Pare-feu / Coupe-feu (Firewall)**
*Définition :* Dispositif matériel ou logiciel qui contrôle le trafic réseau entrant et sortant en fonction de règles de sécurité prédéfinies, agissant comme une barrière entre un réseau de confiance et un réseau non fiable (comme Internet).

**Patch / Correctif**
*Définition :* Morceau de code logiciel conçu pour corriger un bug, une vulnérabilité de sécurité ou améliorer les fonctionnalités d'un programme existant. La gestion des correctifs (Patch Management) est un processus clé de la sécurité.

**Payload / Charge Utile**
*Définition :* Partie d'un malware ou d'un exploit qui exécute l'action malveillante principale (ex: chiffrement des fichiers pour un ransomware, ouverture d'un shell distant, vol de données).

**Pentest / Test d'Intrusion (Penetration Testing)**
*Définition :* Simulation contrôlée d'une attaque informatique sur un système, un réseau ou une application web, réalisée avec l'autorisation du propriétaire, dans le but d'identifier les vulnérabilités exploitables avant qu'un attaquant réel ne le fasse.

**Persistance (Persistence)**
*Définition :* Techniques utilisées par un attaquant pour maintenir son accès à un système compromis même après un redémarrage ou une déconnexion. Exemples : ajout de tâches planifiées, modification de services, clés de registre "Run".

**Posture de Sécurité (Security Posture)**
*Définition :* État global de la sécurité d'une organisation, incluant ses politiques, ses contrôles techniques, la sensibilisation des utilisateurs, sa capacité de détection et de réponse. Évaluation de sa capacité à se défendre contre les menaces.

**Principe du Moindre Privilège (Principle of Least Privilege - PoLP)**
*Définition :* Concept de sécurité selon lequel un utilisateur, un processus ou un programme ne doit disposer que des droits et permissions minimums strictement nécessaires pour accomplir sa tâche légitime, et ce, pour la durée la plus courte possible.

**Privilege Escalation / Élévation de Privilèges**
*Définition :* Processus par lequel un attaquant, ayant obtenu un accès initial avec des droits limités sur un système, exploite une vulnérabilité ou une mauvaise configuration pour obtenir des privilèges plus élevés (ex: passer d'un utilisateur standard à Administrateur ou SYSTEM).

**Red Team / Blue Team**
*Définition :*
    * *Red Team :* Équipe qui simule les attaquants (adversaires) pour tester les défenses d'une organisation de manière réaliste.
    * *Blue Team :* Équipe responsable de la défense de l'organisation, de la détection et de la réponse aux incidents.
    * *Purple Team :* Exercice ou fonction visant à améliorer la collaboration et le partage d'informations entre la Red Team et la Blue Team.

**Réponse à Incident (Incident Response - IR)**
*Définition :* Processus organisé et structuré suivi par une organisation pour gérer les conséquences d'un incident de sécurité (attaque, violation de données). Inclut la préparation, l'identification, le confinement, l'éradication, la récupération et les leçons apprises.

**Risque (Risk)**
*Définition :* Probabilité qu'une menace exploite une vulnérabilité d'un actif, et l'impact résultant pour l'organisation. Souvent exprimé comme Risque = Menace x Vulnérabilité x Impact.

**Security Information and Event Management (SIEM)**
*Définition :* Solution logicielle qui collecte, agrège et analyse les journaux (logs) et les événements de sécurité provenant de diverses sources (serveurs, firewalls, IDS, applications...) pour fournir une vue centralisée, détecter les menaces potentielles, générer des alertes et faciliter les investigations.

**Shellcode**
*Définition :* Petite portion de code machine (assembleur) conçue pour être injectée dans un processus vulnérable (souvent via un exploit de dépassement de tampon) afin d'exécuter des commandes arbitraires, typiquement pour ouvrir un shell (une interface en ligne de commande) distant donnant le contrôle à l'attaquant.

**Signature (Signature)**
*Définition :* Modèle ou motif unique (séquence d'octets, hash de fichier, règle de trafic) associé à une menace connue (malware, attaque réseau). Les outils de détection basés sur les signatures (comme les antivirus traditionnels) comparent les données analysées à une base de signatures connues.

**Surface d'Attaque (Attack Surface)**
*Définition :* Ensemble des points d'entrée potentiels (interfaces, protocoles, services, API, etc.) qu'un attaquant peut utiliser pour tenter d'exploiter des vulnérabilités et compromettre un système ou un réseau. Réduire la surface d'attaque est un objectif clé de la sécurité.

**Threat / Menace**
*Définition :* Tout événement ou acteur potentiel (attaquant, malware, catastrophe naturelle, erreur humaine) susceptible de causer un dommage à un actif en exploitant une vulnérabilité.

**Vulnérabilité (Vulnerability)**
*Définition :* Faiblesse dans la conception, l'implémentation, la configuration ou la gestion d'un système ou d'un processus, qui peut être exploitée par une menace pour causer un dommage.

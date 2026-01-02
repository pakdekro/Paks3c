**Nom Complet :** Local Security Authority Subsystem Service
**Nom du Fichier Exécutable :** `lsass.exe`
**Emplacement Typique :** `%SystemRoot%\System32\` (généralement `C:\Windows\System32\`)

**1. Introduction et Rôle Fondamental**

LSASS est un processus critique du système d'exploitation Windows responsable de la mise en œuvre de la politique de sécurité sur le système. Il ne s'exécute pas en mode noyau (kernel mode) mais en mode utilisateur (user mode), cependant, sa compromission ou son arrêt entraîne généralement une instabilité majeure du système, voire un redémarrage forcé.

Ses fonctions principales incluent :
* La gestion de l'authentification des utilisateurs locaux et distants.
* La génération des jetons d'accès (access tokens).
* L'application des politiques de sécurité (ex: complexité des mots de passe, verrouillage de compte, droits utilisateur).
* La gestion des "secrets" LSA (LSA Secrets).

**2. Processus d'Authentification Détaillé**

Lorsque vous vous connectez à Windows (localement ou via le réseau), le processus `winlogon.exe` (pour les sessions interactives) ou d'autres services (pour les accès réseau) capturent vos informations d'identification (login/mot de passe, carte à puce, biométrie...). Ces informations sont ensuite transmises de manière sécurisée à LSASS.

LSASS prend alors le relais :
* Il fait appel à des **packages d'authentification** enregistrés (DLLs chargées dans l'espace mémoire de LSASS). Les plus courants sont :
    * `msv1_0.dll` : Pour l'authentification NTLM (utilisé principalement pour les comptes locaux ou dans des environnements sans [Kerberos](Kerberos.md)). Il vérifie les informations par rapport à la base SAM (Security Account Manager) locale ou contacte un contrôleur de domaine.
    * `kerberos.dll` : Pour l'authentification Kerberos (standard dans les environnements Active Directory). Il communique avec le Key Distribution Center (KDC) sur un contrôleur de domaine pour obtenir des tickets [Kerberos](Kerberos.md) (TGT, Service Tickets).
    * `schannel.dll` : Pour l'authentification TLS/SSL.
    * `wdigest.dll` (historique, souvent désactivé) : Pour l'authentification Digest Access. Notamment connu car, s'il est activé, il pouvait stocker une copie du mot de passe en clair dans la mémoire de LSASS.
* Ces packages valident les informations d'identification fournies.
* Si l'authentification réussit, LSASS est responsable de la création du **jeton d'accès** (Access Token) initial pour l'utilisateur.

**3. Gestion des Jetons d'Accès**

Après une authentification réussie, LSASS génère un jeton d'accès pour la session de l'utilisateur. Ce jeton contient des informations cruciales :
* L'identifiant de sécurité (SID) de l'utilisateur.
* Les SIDs des groupes auxquels l'utilisateur appartient.
* Les privilèges assignés à l'utilisateur (ex: `SeDebugPrivilege`, `SeShutdownPrivilege`).
* D'autres informations de sécurité.

Ce jeton est ensuite associé au processus initial de l'utilisateur (comme `explorer.exe`) et est hérité par les processus enfants lancés par cet utilisateur. Chaque fois qu'un processus tente d'accéder à une ressource sécurisable (fichier, clé de registre, objet système), le système compare le SID et les privilèges du jeton avec la liste de contrôle d'accès (ACL) de la ressource pour autoriser ou refuser l'accès.

**4. Stockage des Informations Sensibles en Mémoire**

C'est l'aspect qui intéresse le plus les attaquants (Red Team) et que les défenseurs (Blue Team) cherchent à protéger. Pour faciliter le Single Sign-On (SSO) et l'accès transparent aux ressources réseau sans redemander constamment les mots de passe, LSASS conserve diverses formes d'informations d'identification en mémoire *pendant la durée de vie de la session utilisateur ou du système* :
* **Tickets Kerberos (TGT, Service Tickets) :** Utilisés pour l'authentification dans un domaine AD.
* **Hashes NTLM :** Dérivés du mot de passe de l'utilisateur, utilisés pour l'authentification NTLM.
* **Potentiellement des mots de passe en clair :** Si WDigest est activé (moins courant aujourd'hui) ou via d'autres mécanismes/vulnérabilités.
* **Clés de session DPAPI :** Utilisées pour déchiffrer certaines données utilisateur protégées.
* **LSA Secrets :** Mots de passe des comptes de service, clés diverses stockées par le système.

**5. Perspective Attaquant (Red Team)**

LSASS est une cible de choix pour l'extraction d'informations d'identification ("Credential Dumping"). L'objectif est de lire la mémoire du processus `lsass.exe` pour en extraire les informations sensibles listées ci-dessus.

* **Techniques Courantes :**
    * **Utilisation d'outils dédiés :** Le plus célèbre est **Mimikatz** (`sekurlsa::logonpasswords`, `sekurlsa::tickets`, `lsadump::secrets`). Ces outils utilisent des API Windows (comme `DebugActiveProcess`, `ReadProcessMemory`) ou des techniques plus avancées pour lire directement la mémoire de LSASS.
    * **Dump de la mémoire :** Créer un fichier de vidage complet de la mémoire de LSASS (par exemple, via le Gestionnaire des tâches, `procdump.exe` de Sysinternals, ou des API comme `MiniDumpWriteDump`). Ce fichier peut ensuite être analysé hors ligne sur une machine contrôlée par l'attaquant avec des outils comme Mimikatz ou Pypykatz.
* **Prérequis :** L'attaquant a besoin de privilèges élevés sur la machine cible (typiquement Administrateur local ou SYSTEM) pour pouvoir accéder à la mémoire du processus LSASS. `SeDebugPrivilege` est souvent requis.
* **Impact :** La récupération de ces informations permet des mouvements latéraux (pass-the-hash, pass-the-ticket), l'escalade de privilèges, et l'accès à d'autres systèmes et données.

**6. Perspective Défenseur (Blue Team)**

Protéger LSASS et détecter les tentatives de compromission est crucial.

* **Mécanismes de Protection :**
    * **Protected Process Light (PPL) pour LSASS :** Introduit dans Windows 8.1/Server 2012 R2. Si activé (via une clé de registre `RunAsPPL`), LSASS s'exécute comme un processus protégé. Cela empêche les processus non-protégés (même ceux exécutés en tant qu'Administrateur) d'ouvrir un handle sur LSASS avec des droits d'accès étendus (comme la lecture de mémoire ou l'injection de code). Seuls les processus signés par Microsoft et ayant la bonne EKU (Enhanced Key Usage) peuvent interagir pleinement avec un LSASS protégé.
    * **Credential Guard :** Introduit dans Windows 10/Server 2016. Utilise la Sécurité Basée sur la Virtualisation (VBS) pour isoler le processus LSASS (ou plutôt une partie critique appelée LSAIso - LSA Isolated) dans un environnement virtualisé séparé du système d'exploitation principal. Les secrets (comme les hashes NTLM, tickets [Kerberos](Kerberos.md) TGT) sont stockés et gérés dans cet environnement isolé, rendant leur extraction depuis le LSASS normal (tournant dans le système principal) impossible, même avec des privilèges SYSTEM. Mimikatz ne peut pas accéder aux secrets gérés par LSAIso.
    * **Désactivation de WDigest :** Assurer que la clé de registre `UseLogonCredential` sous `HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest` est à 0.
    * **Mises à jour régulières :** Pour corriger les vulnérabilités potentielles dans LSASS ou les composants liés.
    * **Principe du moindre privilège :** Éviter d'utiliser des comptes à privilèges élevés pour les tâches quotidiennes.
* **Détection :**
    * **Surveillance des accès au processus LSASS :** Utiliser des EDR (Endpoint Detection and Response) ou des règles Sysmon (Event ID 10 : ProcessAccess) pour détecter les tentatives d'ouverture de `lsass.exe` avec des droits suspects (ex: `PROCESS_VM_READ`) par des processus inhabituels (non-système, non-sécurité).
    * **Détection comportementale :** Les EDR modernes ont des modules spécifiques pour détecter les techniques connues de credential dumping (patterns d'accès mémoire, chargement de DLL suspectes dans LSASS, appels API caractéristiques).
    * **Analyse des dumps mémoire suspects :** Si des dumps de LSASS sont créés de manière inattendue.
    * **Surveillance des événements d'audit :** Activer et surveiller les événements liés à l'authentification et à l'utilisation des privilèges (ex: Audit Credential Validation, Audit [Kerberos](Kerberos.md) Authentication Service, Audit Sensitive Privilege Use).

**7. Conclusion**

LSASS est un composant fondamental et critique de la sécurité Windows. Sa compréhension est essentielle pour les professionnels de la cybersécurité. Il assure l'authentification et l'application des politiques, mais sa nécessité de conserver des informations d'identification en mémoire en fait une cible privilégiée. Les mécanismes comme PPL et Credential Guard sont des avancées majeures pour sa protection, mais la vigilance via la détection reste indispensable.

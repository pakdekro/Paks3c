### Pilier 1 : Le Principe du Moindre Privilège (PoLP - Principle of Least Privilege)

C'est la règle d'or. Un attaquant qui compromet un compte ne doit obtenir que le strict minimum de droits, limitant ainsi sa capacité à se déplacer latéralement et à escalader ses privilèges.

#### Actions Concrètes :

1. **Modèle d'Administration à Tiers (Tier Model)** : C'est la mesure la plus structurante. L'idée est de segmenter vos ressources et vos comptes d'administration pour que la compromission d'un niveau inférieur ne puisse pas mener à la compromission d'un niveau supérieur.
    
    - **Tier 0 : Contrôle de l'Annuaire.** Contient les contrôleurs de domaine (DCs), les comptes `Domain Admins`, `Enterprise Admins`, les serveurs ADFS, PKI, etc. Les comptes administrateurs de ce niveau ne doivent **jamais** se connecter à des systèmes de tiers inférieurs.
        
    - **Tier 1 : Serveurs d'Entreprise.** Contient les serveurs applicatifs, les serveurs de fichiers, les bases de données. Administré par des comptes du Tier 1.
        
    - **Tier 2 : Postes de Travail Utilisateurs.** Contient les ordinateurs portables, les postes de travail. Administré par les comptes du support technique (Tier 2).
        
    - **Perspective Red Team :** Sans ce modèle, un attaquant qui compromet un PC de helpdesk (Tier 2) peut souvent trouver des identifiants d'admin de domaine (Tier 0) en mémoire (via Mimikatz par exemple) et prendre le contrôle total. Le Tier Model brise cette chaîne d'attaque.
        
2. **Nettoyage des Groupes à Hauts Privilèges** : Les groupes suivants doivent être surveillés de très près et être vides ou quasi-vides en temps normal :
    
    - `Enterprise Admins`
        
    - `Domain Admins`
        
    - `Schema Admins`
        
    - `Backup Operators` (peut lire n'importe quel fichier sur un DC, y compris `NTDS.dit`)
        
    - `Server Operators`
        
    - **Action :** Utilisez des comptes dédiés avec des droits élevés uniquement lorsque c'est nécessaire, via des solutions de **Privileged Access Management (PAM)** ou **Just-In-Time (JIT) Administration**. Pour les tâches courantes, utilisez la **délégation de contrôle** dans l'AD.
        
3. **Utilisation de Just-Enough-Administration (JEA)** : Pour les tâches d'administration via PowerShell, JEA permet de créer des points de terminaison (endpoints) qui n'exposent qu'un sous-ensemble limité de commandes à un administrateur, sans lui donner de droits d'admin locaux sur la machine.
    
4. **Sécurisation des Comptes de Service** :
    
    - Migrez les comptes de service traditionnels vers des **Group Managed Service Accounts (gMSA)**. Leur mot de passe est géré automatiquement par l'AD, est long (240 caractères) et complexe, et ne peut pas être utilisé pour une connexion interactive.
        
    - **Perspective Red Team :** Les comptes de service avec des mots de passe qui n'expirent jamais sont une mine d'or. Une attaque de type **Kerberoasting** vise justement à extraire le hash du mot de passe de ces comptes pour le cracker offline. Les gMSA sont immunisés contre cela.
        

---

### Pilier 2 : Réduction de la Surface d'Attaque

Il s'agit de minimiser le nombre de points d'entrée et de vecteurs d'attaque possibles.

#### Actions Concrètes :

1. **Sécurisation des Contrôleurs de Domaine (DCs)** :
    
    - **Isolation Physique et Logique :** Les DCs sont des joyaux. Ils ne doivent jamais avoir accès à Internet. Le trafic entrant et sortant doit être rigoureusement filtré par un pare-feu.
        
    - **Pas d'autres rôles :** Un DC ne doit être qu'un DC (et serveur DNS/DHCP). N'installez jamais de serveur web, SQL, ou d'autres applications dessus.
        
    - **Utiliser des Read-Only Domain Controllers (RODCs)** dans les sites physiquement moins sécurisés (ex: agences distantes).
        
    - **Désactiver les protocoles obsolètes :** SMBv1, LAN Manager (LM) et NTLMv1 doivent être bannis via GPO. Ils sont cryptographiquement faibles.
        
    - **Secure Boot et Virtualization-Based Security (VBS)** : Sur les DCs virtualisés ou physiques (Windows Server 2016+), activez ces fonctionnalités pour protéger le processus `lsass.exe` (qui stocke les secrets) avec **Credential Guard**.
        
    - **Perspective Red Team :** Si Credential Guard est actif, des outils comme Mimikatz ne peuvent plus extraire les hashes et les tickets Kerberos de la mémoire de `lsass`, neutralisant les attaques de type Pass-the-Hash et Pass-the-Ticket.
        
2. **Postes de Travail d'Accès Privilégié (PAW - Privileged Access Workstation)** :
    
    - Les administrateurs de Tier 0 ne doivent administrer les DCs qu'à partir de machines dédiées, ultra-sécurisées (les PAWs), qui n'ont pas d'accès à Internet, pas de client mail, et sont physiquement sécurisées. Cela évite que le compte admin le plus puissant soit compromis par un simple email de phishing ouvert sur une machine standard.
        
3. **Politiques de Mots de Passe et de Verrouillage Robustes** :
    
    - **Longueur > Complexité :** Imposez une longueur minimale de 15 caractères.
        
    - **MFA Partout :** Rendez l'authentification multifacteur (MFA) obligatoire, surtout pour les comptes à privilèges et les accès externes (VPN, OWA, etc.).
        
    - **Listes de mots de passe bannis :** Utilisez des outils (comme Azure AD Password Protection pour les environnements hybrides) pour empêcher les utilisateurs de choisir des mots de passe courants ou compromis.
        
    - **LAPS (Local Administrator Password Solution)** : Cet outil gratuit de Microsoft est **non négociable**. Il définit un mot de passe unique, complexe et régulièrement renouvelé pour le compte administrateur local de chaque machine du domaine.
        
    - **Perspective Red Team :** Sans LAPS, un attaquant qui obtient le mot de passe de l'admin local d'une machine peut l'utiliser pour se connecter à des centaines d'autres machines (mouvement latéral) si le mot de passe est réutilisé. LAPS neutralise complètement ce vecteur.
        
4. **Hardening via GPO (Stratégies de Groupe)** :
    
    - Appliquez les **lignes de base de sécurité (security baselines)** de Microsoft, du CIS (Center for Internet Security) ou de l'ANSSI.
        
    - **AppLocker ou Windows Defender Application Control (WDAC)** : Pour restreindre les exécutables autorisés sur les postes et serveurs.
        
    - **Désactivation des macros Office** via GPO.
        
    - **Configuration de PowerShell Constrained Language Mode** pour les utilisateurs standards.
        

---

### Pilier 3 : Détection et Surveillance

Si un attaquant parvient à contourner les protections, vous devez le détecter le plus rapidement possible.

#### Actions Concrètes :

1. **Configuration Avancée des Journaux d'Audit** :
    
    - Activez via GPO les politiques d'audit avancées. Ne vous contentez pas des logs par défaut.
        
    - **Événements à surveiller absolument :**
        
        - `4624/4625`: Connexions réussies/échouées.
            
        - `4720/4722/4724`: Création/activation/changement de mot de passe d'un compte.
            
        - `4732`: Ajout d'un membre à un groupe de sécurité local/global. **Alerte critique si le groupe est `Domain Admins`**.
            
        - `4688`: Création de processus (avec la ligne de commande activée).
            
        - `5136`: Modification d'un objet de l'annuaire.
            
        - **Journaux PowerShell :** Activez `Module Logging`, `Script Block Logging` et `Transcription`.
            
    - **Centralisation :** Envoyez tous ces journaux vers un **SIEM** (Security Information and Event Management) pour corrélation et alerte.
        
2. **Déploiement d'Outils de Détection Spécifiques** :
    
    - **Microsoft Defender for Identity** (anciennement Azure ATP) : C'est un outil exceptionnel qui analyse le trafic réseau des DCs (via port mirroring) et les logs pour détecter en temps réel des comportements suspects : Pass-the-Ticket, Pass-the-Hash, Golden Ticket, DCShadow, reconnaissances, etc.
        
    - **Canary Tokens / Comptes "Honeypot"** : Créez un faux compte utilisateur avec un nom alléchant (ex: `SQL_Admin_Prod`). Donnez-lui un SPN (Service Principal Name) pour le rendre vulnérable au Kerberoasting. N'utilisez jamais ce compte. Placez des alertes sur toute tentative de connexion ou de modification de ce compte. Si quelqu'un y touche, c'est une alerte de très haute fidélité.
        
3. **Audits Réguliers avec des Outils Spécialisés** :
    
    - **PingCastle** : Outil gratuit qui génère un rapport de maturité exceptionnel de votre AD en quelques minutes. Il identifie les faiblesses, les comptes dormants, les privilèges à risque, etc.
        
    - **BloodHound** : Outil favori des Red Teams pour cartographier les chemins d'attaque dans un AD. La Blue Team doit l'utiliser pour trouver et corriger ces chemins _avant_ l'attaquant.
        

---

### Pilier 4 : Préparation à la Réponse et Reprise après Sinistre

Partez du principe que vous serez compromis un jour.

#### Actions Concrètes :

1. **Sauvegardes Fiables des Contrôleurs de Domaine** :
    
    - Sauvegardez l'état du système (`System State`) de vos DCs.
        
    - Assurez-vous d'avoir des sauvegardes **offline et immuables** pour vous protéger des ransomwares qui ciblent et chiffrent les sauvegardes en ligne.
        
    - **Testez régulièrement votre procédure de restauration !** Une sauvegarde non testée n'est pas une sauvegarde.
        
2. **Plan de Reprise d'Activité (PRA)** :
    
    - Ayez un plan documenté et testé pour reconstruire votre forêt AD à partir de zéro si nécessaire (le scénario du pire).
        
    - Sachez comment révoquer tous les secrets (le `krbtgt` deux fois), nettoyer le domaine et reconstruire la confiance.
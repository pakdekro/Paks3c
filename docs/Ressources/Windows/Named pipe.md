Un "Named Pipe" est un mécanisme de **Communication Inter-Processus (IPC)**. Il permet à un processus (le "serveur") de créer un point de communication et à un ou plusieurs autres processus (les "clients") de s'y connecter pour échanger des données.

La grande différence avec les "canaux anonymes" (anonymous pipes), c'est que les canaux **nommés** :

1. **Ont un nom**, ce qui permet à des processus non-liés (qui ne sont pas parent/enfant) de se trouver et de communiquer.
    
2. Peuvent être utilisés pour la communication **sur un réseau**, pas seulement sur la même machine.
    

### 2. Les Caractéristiques Clés (Plus en détail)

Pour bien comprendre leur fonctionnement, voici leurs propriétés principales :

- **Nommage :** Un canal nommé a un nom qui suit une convention stricte : `\\.\pipe\NomDeMonCanal`.
    
    - `\\.` indique que l'objet se trouve sur la machine locale.
        
    - `\pipe\` est le "dossier" spécial du système de fichiers virtuel où résident les canaux nommés (le _Named Pipe File System_ ou NPFS).
        
    - Pour accéder à un canal sur une machine distante, on utilise `\\NomMachineDistante\pipe\NomDuCanal`. C'est cette capacité qui est exploitée pour le mouvement latéral.
        
- **Modèle Client/Serveur :**
    
    - **Le serveur :** Un processus crée le canal nommé et attend qu'un client se connecte. Il est "à l'écoute".
        
    - **Le client :** Un autre processus se connecte au canal en utilisant son nom. Une fois la connexion établie, la communication peut commencer.
        
- **Type de Communication :**
    
    - **Bidirectionnelle (Duplex) :** C'est le mode le plus courant. Les données peuvent circuler dans les deux sens, comme une conversation téléphonique.
        
    - **Unidirectionnelle (Simplex) :** Les données ne vont que dans un sens (serveur -> client ou client -> serveur).
        
- **Comportement de Fichier :** Pour un développeur, manipuler un canal nommé ressemble beaucoup à manipuler un fichier. On utilise des fonctions comme `CreateFile` pour se connecter (côté client) ou `CreateNamedPipe` pour créer (côté serveur), puis `ReadFile` et `WriteFile` pour échanger des données. Cette abstraction est très puissante.
    
- **Sécurité :** C'est un point crucial pour vous. Comme les fichiers, les canaux nommés possèdent un **Descripteur de Sécurité (Security Descriptor)**. Celui-ci définit qui a le droit de se connecter au canal, d'y lire ou d'y écrire des données, via des **listes de contrôle d'accès (ACLs)**. Une mauvaise configuration de ces ACLs peut entraîner de graves failles de sécurité.
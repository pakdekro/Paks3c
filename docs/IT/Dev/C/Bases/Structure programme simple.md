```c
#include <stdio.h>

int main() {
    printf("Bonjour, le monde!\n");
    return 0;
}
```

- **`#include <stdio.h>`** : Ceci est une directive de préprocesseur. Elle indique au compilateur d'inclure le contenu du fichier d'en-tête standard `stdio.h`. Ce fichier est nécessaire pour utiliser la fonction `printf`.
- **`int main()`** : Déclare la fonction principale `main`. En C, `main` est le point d'entrée de tout programme. Le programme commence à s'exécuter à partir de cette fonction. `int` signifie que `main` renvoie un entier.
- **`printf("Bonjour, le monde!\n");`** : `printf` est utilisée pour afficher la chaîne de caractères entre guillemets sur la console. `\n` est un caractère spécial qui représente une nouvelle ligne.
- **`return 0;`** : Indique que le programme s'est exécuté avec succès. Le `0` est renvoyé au système d'exploitation.


```c
#include <stdio.h>

int main() {
    int i;

    printf("Boucle for:\n");
    for (i = 0; i < 5; i++) {
        printf("%d ", i);
    }

    printf("\nBoucle while:\n");
    i = 0;
    while (i < 5) {
        printf("%d ", i);
        i++;
    }

    return 0;
}

```

- **Boucle `for`** : Permet de répéter un bloc de code un nombre spécifique de fois. La boucle ici compte de 0 à 4.
- **Boucle `while`** : Une autre structure de boucle. Elle exécute le bloc de code tant que la condition (`i < 5`) est vraie.


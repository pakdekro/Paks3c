```c
#include <stdio.h>

int main() {
    int entier = 10;
    float flottant = 10.5;
    char caractere = 'A';

    printf("Entier: %d, Flottant: %f, Caractère: %c\n", entier, flottant, caractere);
    return 0;
}

```

- Trois types de variables sont déclarés ici : `int` (entier), `float` (nombre à virgule flottante) et `char` (caractère). Chaque type sert à stocker un type de données spécifique.
- La fonction `printf` est utilisée pour afficher les valeurs de ces variables. `%d`, `%f`, et `%c` sont des spécificateurs de format qui indiquent à `printf` comment interpréter les valeurs (respectivement comme entier, flottant, et caractère).
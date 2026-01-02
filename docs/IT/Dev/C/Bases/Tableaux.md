En programmation en C, les tableaux sont des structures de données permettant de stocker une collection ordonnée d'éléments de même type sous un même nom. Voici un exemple détaillé d'un tableau en C et son utilisation :

```c
#include <stdio.h>

int main() {
    // Déclaration et initialisation d'un tableau d'entiers
    int tableau_entiers[5] = {10, 20, 30, 40, 50};

    // Affichage des éléments du tableau
    printf("Eléments du tableau d'entiers :\n");
    for (int i = 0; i < 5; i++) {
        printf("%d ", tableau_entiers[i]);
    }
    printf("\n");

    // Accès et modification d'un élément du tableau
    tableau_entiers[2] = 35;

    // Affichage du tableau après modification
    printf("Tableau après modification :\n");
    for (int i = 0; i < 5; i++) {
        printf("%d ", tableau_entiers[i]);
    }
    printf("\n");

    return 0;
}
```

Dans cet exemple :

- Un tableau d'entiers `tableau_entiers` de taille 5 est déclaré et initialisé avec les valeurs `{10, 20, 30, 40, 50}`.
- Les éléments du tableau sont ensuite affichés à l'aide d'une boucle `for`.
- Un élément du tableau est modifié en accédant à l'indice correspondant (`tableau_entiers[2]`) et en lui attribuant une nouvelle valeur (`35`).
- Le tableau est à nouveau affiché pour montrer la modification.

Les tableaux en C sont utiles pour stocker des collections d'éléments de manière efficace et les manipuler à l'aide d'indices. Ils sont souvent utilisés dans de nombreux algorithmes et structures de données.
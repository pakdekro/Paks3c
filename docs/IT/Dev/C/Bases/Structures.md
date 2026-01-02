En programmation en C, les structures (ou "structs") sont des types de données qui permettent de regrouper plusieurs variables de types différents sous un même nom. Elles sont utiles pour organiser et manipuler des données complexes de manière efficace.

Voici un exemple détaillé d'une structure en C et son utilisation :

```c
#include <stdio.h>
#include <string.h>

// Définition de la structure "Personne"
struct Personne {
    char nom[50];
    int age;
    float taille;
};

int main() {
    // Déclaration d'une variable de type "Personne"
    struct Personne personne1;

    // Initialisation des champs de la structure "personne1"
    strcpy(personne1.nom, "Jean Dupont");
    personne1.age = 30;
    personne1.taille = 1.75;

    // Affichage des informations de la personne
    printf("Nom: %s\n", personne1.nom);
    printf("Age: %d\n", personne1.age);
    printf("Taille: %.2f\n", personne1.taille);

    // Modification de l'âge de la personne
    personne1.age = 35;

    // Affichage des informations mises à jour
    printf("Nouvel âge: %d\n", personne1.age);

    return 0;
}
```

Dans cet exemple :

- Une structure `Personne` est définie avec trois champs : `nom` (une chaîne de caractères), `age` (un entier) et `taille` (un nombre à virgule flottante).
- Dans la fonction `main()`, une variable de type `Personne` appelée `personne1` est déclarée.
- Les champs de la structure `personne1` sont initialisés avec des valeurs spécifiques à l'aide de la fonction `strcpy()` pour le nom et d'assignations directes pour l'âge et la taille.
- Les informations de la personne sont affichées à l'écran.
- L'âge de la personne est ensuite mis à jour en modifiant directement le champ `age` de la structure `personne1`.
- Les informations mises à jour sont ensuite affichées à nouveau.

Les structures en C permettent donc de regrouper des données associées sous une même entité, ce qui facilite la manipulation et la gestion des informations dans un programme.
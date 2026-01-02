```c
#include <stdio.h>

int main() {
    int var = 100;
    int *ptr;

    ptr = &var;

    printf("Valeur de var: %d\n", var);
    printf("Adresse de var: %p\n", &var);
    printf("Valeur pointée par ptr: %d\n", *ptr);

    return 0;
}
```

- Un pointeur `ptr` est déclaré. Il est conçu pour stocker l'adresse d'une variable de type `int`.
- `&var` obtient l'adresse de la variable `var`, et `ptr = &var` assigne cette adresse au pointeur.
- `*ptr` est utilisé pour accéder à la valeur à l'adresse stockée dans le pointeur, affichant ainsi la valeur de `var`.

---

Un cas simple et classique de l'utilisation des pointeurs en C est le passage d'arguments par référence à une fonction. Cela permet à la fonction de modifier la valeur des arguments passés, ce qui est impossible avec un passage d'arguments par valeur (le mode par défaut en C).

Imaginons que vous vouliez écrire une fonction qui échange les valeurs de deux variables. Sans pointeurs, vous ne pourriez pas faire cela directement, car toute modification à une variable passée à une fonction serait locale à cette fonction. Mais avec les pointeurs, vous pouvez passer les adresses des variables et modifier leurs valeurs directement.

Voici un exemple simple :

```c
#include <stdio.h>  
// Fonction pour échanger les valeurs de deux variables 

void swap(int *x, int *y) {     
int temp = *x;     
*x = *y;     
*y = temp; 
}  

int main() {     
int a = 10;     
int b = 20;      
printf("Avant le swap : a = %d, b = %d\n", a, b);      

// Appel de la fonction swap avec les adresses de a et b     

swap(&a, &b);      
printf("Après le swap : a = %d, b = %d\n", a, b);      
return 0; 
}
```

Dans cet exemple :

1. **Fonction `swap`** : Prend deux pointeurs `int *x` et `int *y` comme arguments, qui sont les adresses des variables `a` et `b`.
    
2. **Echange des valeurs** : Dans `swap`, `*x` et `*y` permettent d'accéder aux valeurs stockées aux adresses pointées par `x` et `y`, respectivement. La fonction échange ces valeurs.
    
3. **Passage des adresses** : Lorsque vous appelez `swap(&a, &b)`, vous passez les adresses de `a` et `b`, permettant à la fonction `swap` de modifier les variables originales.
    

Ce cas illustre bien la puissance des pointeurs en permettant des modifications directes sur les variables passées à une fonction, ce qui serait impossible autrement en C.
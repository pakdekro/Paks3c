```c
#include <stdio.h>

int somme(int a, int b) {
    return a + b;
}

int main() {
    int result = somme(5, 3);
    printf("Résultat: %d\n", result);
    return 0;
}
```

- Définit une fonction `somme` qui prend deux paramètres (deux entiers) et renvoie leur somme.
- Dans `main`, la fonction `somme` est appelée avec deux arguments (5 et 3) et le résultat est stocké dans `result`, puis affiché.
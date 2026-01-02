Le groupe Event Log Reader ne permet pas de privesc en soi. Il permet par contre de lire les différents logs, et notamment ceux en lien avec la création d'un process. Éventuellement, la commande permettant la création de ce process pourrait contenir un mot de passe en clair.

#### Utilisation de wevutil.exe pour chercher la chaîne de caractère "/user" dans les logs

```powershell
wevtutil qe Security /rd:true /f:text | Select-String "/user"
```

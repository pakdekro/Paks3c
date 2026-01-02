- `Modified Time (M)`: Ce timestamp capture la dernière instance où le contenu du fichier a été modifié. Toute altération des données du fichier, telle que des modifications du contenu, déclenche une mise à jour de ce timestamp.
- `Accessed Time (A)`: Ce timestamp reflète la dernière occasion où le fichier a été accédé ou lu, se mettant à jour chaque fois que le fichier est ouvert ou consulté.
- `Changed [Change in MFT Record] (C)`: Ce timestamp signifie des changements dans l'enregistrement MFT. Il capture le moment où le fichier a été initialement créé. Cependant, il est important de noter que certains systèmes de fichiers, comme NTFS, peuvent mettre à jour ce timestamp si le fichier est déplacé ou copié.
- `Birth Time (b)`: Souvent appelé timestamp de naissance ou de création, il représente le moment précis où le fichier ou l'objet a été créé sur le système de fichiers. Son importance dans les investigations forensic ne doit pas être sous-estimée, notamment pour déterminer le moment de création initiale d'un fichier.

---

### Création de Fichier :

- **Modified Timestamp (M)** : Le timestamp de modification est mis à jour pour refléter l'heure de la création du fichier.
- **Accessed Timestamp (A)** : Le timestamp d'accès est mis à jour pour refléter que le fichier a été accédé au moment de sa création.
- **Birth (Created) Timestamp (b)** : Le timestamp de naissance est défini à l'heure de création du fichier.

### Modification de Fichier :

- **Modified Timestamp (M)** : Le timestamp de modification est mis à jour pour refléter l'heure à laquelle le contenu ou les attributs du fichier ont été modifiés pour la dernière fois.
- **Accessed Timestamp (A)** : Le timestamp d'accès n'est pas mis à jour lorsque le fichier est modifié.
- **Birth (Created) Timestamp (b)** : Le timestamp de naissance n'est pas mis à jour lorsque le fichier est modifié.

### Copie de Fichier :

- **Modified Timestamp (M)** : Le timestamp de modification n'est généralement pas mis à jour lorsqu'un fichier est copié. Il hérite habituellement du timestamp du fichier source.
- **Accessed Timestamp (A)** : Le timestamp d'accès est mis à jour pour refléter que le fichier a été accédé au moment de la copie.
- **Birth (Created) Timestamp (b)** : Le timestamp de naissance est mis à jour à l'heure de la copie, indiquant le moment où la copie a été créée.

### Accès au Fichier :

- **Modified Timestamp (M)** : Le timestamp de modification n'est pas mis à jour lorsque le fichier est accédé.
- **Accessed Timestamp (A)** : Le timestamp d'accès est mis à jour pour refléter l'heure de l'accès.
- **Birth (Created) Timestamp (b)** : Le timestamp de naissance n'est pas mis à jour lorsque le fichier est accédé.
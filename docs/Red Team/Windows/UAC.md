# User Account Control (UAC)

L'**User Account Control (UAC)** est une fonctionnalité de sécurité de Windows conçue pour empêcher les modifications non autorisées du système d'exploitation. Lorsqu'une action nécessite des privilèges administratifs, l'UAC affiche une invite demandant la confirmation de l'utilisateur.

Il est crucial de comprendre que l'UAC n'est **pas une barrière de sécurité infranchissable**, mais plutôt une protection contre les actions involontaires. De nombreuses techniques permettent de le contourner, souvent en abusant de mécanismes légitimes de Windows.

## Mécanisme et Niveaux d'Intégrité

L'UAC fonctionne grâce à un système de **niveaux d'intégrité**. Un processus ne peut modifier un autre processus ou un objet que si son niveau d'intégrité est égal ou supérieur.
- **Haute Intégrité** : Administrateur avec tous les privilèges (après validation UAC).
- **Moyenne Intégrité** : Administrateur "filtré" (avant validation UAC) ou utilisateur standard.
- **Basse Intégrité** : Processus très restreints (ex: certains onglets de navigateur en sandbox).

Par défaut, même si un utilisateur est administrateur, ses processus démarrent en Moyenne Intégrité. Pour passer en Haute Intégrité, une validation UAC est nécessaire.

### Auto-Elevation

Certains exécutables signés par Microsoft et situés dans des répertoires de confiance (comme `C:\Windows\System32`) sont configurés pour s'élever automatiquement en Haute Intégrité **sans afficher d'invite UAC**. C'est ce mécanisme qui est le plus souvent abusé pour les bypass UAC.

## Techniques de Bypass UAC

Le but d'un bypass UAC est de faire exécuter du code par un processus en Haute Intégrité depuis un contexte en Moyenne Intégrité, sans interaction de l'utilisateur.

### 1. Détournement de clé de registre (ex: fodhelper.exe)

C'est l'une des techniques les plus connues. `fodhelper.exe` est un binaire qui s'auto-élève. À son exécution, il consulte des clés de registre dans le profil de l'utilisateur (`HKCU`), une ruche sur laquelle un processus en Moyenne Intégrité a le droit d'écriture.

**Principe :**
1. L'attaquant écrit le chemin de sa charge malveillante dans une clé de registre spécifique (`HKCU:\Software\Classes\ms-settings\shell\open\command`).
2. L'attaquant exécute `fodhelper.exe`.
3. Le processus `fodhelper.exe` s'auto-élève en Haute Intégrité.
4. Il lit la clé de registre modifiée par l'attaquant et exécute la charge malveillante avec des privilèges élevés.

**Exemple (invite de commande) :**
```powershell
# Créer la clé de registre pour pointer vers notre commande (ici, ouvrir un cmd)
reg add HKCU\Software\Classes\ms-settings\shell\open\command /v DelegateExecute /d "" /f
reg add HKCU\Software\Classes\ms-settings\shell\open\command /d "C:\Windows\System32\cmd.exe" /f

# Lancer fodhelper pour déclencher le payload
fodhelper.exe
```

### 2. DLL Hijacking

Certains binaires auto-élevés tentent de charger des DLL depuis des emplacements où un utilisateur standard peut écrire. Si un attaquant place une DLL malveillante au bon endroit, elle sera chargée et exécutée en Haute Intégrité.

### 3. Abus d'objets COM

Des objets COM peuvent être configurés pour s'exécuter en Haute Intégrité. En instanciant l'un de ces objets (comme `ICMLuaUtil`) depuis un script, un attaquant peut utiliser ses méthodes pour exécuter des commandes avec des privilèges élevés.

## Énumération et Outils

### Vérifier le niveau de l'UAC

On peut vérifier le niveau de l'UAC via le registre.
```powershell
# ConsentPromptBehaviorAdmin: 2=Toujours notifier, 5=Notifier uniquement pour les non-Windows
# PromptOnSecureDesktop: 1=Oui, 0=Non
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" | Select-Object ConsentPromptBehaviorAdmin, PromptOnSecureDesktop
```

### Outils

- **UACME** : Un projet sur GitHub qui compile des dizaines de techniques de bypass UAC. C'est une référence pour comprendre et tester ces vulnérabilités.
- **Metasploit** : Contient de nombreux modules `exploit/windows/local/bypassuac_*` qui automatisent ces techniques.

---

| Catégorie                    | Information                                                                                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | T1548.002 (Abuse Elevation Control Mechanism: Bypass User Account Control)                                                                                                                                                                                                          |
| **Description de l'attaque** | L'attaquant exploite des faiblesses dans la configuration de l'UAC ou des comportements de binaires légitimes pour exécuter du code avec des privilèges élevés (Haute Intégrité) depuis un contexte de privilèges standards (Moyenne Intégrité), sans déclencher d'invite pour l'utilisateur. |
| **Impacts potentiels**       | - Élévation de privilèges locale (de "split-token admin" à "full admin")<br>- Persistance                                                                                                                                                                                          |
| **Comment la détecter**      | - Surveiller les modifications suspectes dans `HKCU\Software\Classes`.<br>- Surveiller l'exécution de binaires connus pour être utilisés dans des bypass (fodhelper.exe, eventvwr.exe, etc.) suivie d'actions inhabituelles.<br>- Détecter la création de DLL dans des chemins inhabituels. |
| **Remédiations/mitigations** | - Configurer l'UAC sur le niveau le plus élevé : **"Toujours notifier"**. Cela demande une confirmation même pour les actions des administrateurs et mitige la plupart des bypass connus.<br>- Ne pas utiliser de compte administrateur pour les tâches quotidiennes. Préférer un compte utilisateur standard. |
| **Lien de référence**        | [MITRE ATT&CK - T1548.002](https://attack.mitre.org/techniques/T1548/002/)                                                                                                                                                                                                  |

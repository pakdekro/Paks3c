## Endiguement

En tant qu'administrateur du domaine :

```powershell
# Pré-requis : Connect-MgGraph ou Connect-AzureAD
$UserUPN = "victime@societe.com"

# Bloquer la connexion
Update-MgUser -UserId $UserUPN -AccountEnabled $false

# Révoquer les tokens (Force la déconnexion immédiate)
Revoke-MgUserSignInSession -UserId $UserUPN -All $true

# Vérifier les méthodes MFA sur le compte compromis
Get-MgUserAuthenticationMethod -UserId $UserUPN | Select-Object MethodType, DeviceTag, CreatedDateTime
```

## Vérification de la portée de l'attaque

```powershell
# Pré-requis : Connect-ExchangeOnline

# Voir les mails envoyés les dernières 24h (ou 48h)
Get-MessageTrace -SenderAddress "victime@societe.com" -StartDate (Get-Date).AddHours(-24) -EndDate (Get-Date) | Select-Object Received, RecipientAddress, Subject, Status, ClientIP

# Eventuellement les grouper pour voir les volumes anormaux
Get-MessageTrace -SenderAddress "victime@societe.com" -StartDate (Get-Date).AddHours(-48) | Group-Object Subject | Sort-Object Count -Descending
```

## Les méthodes de persistance

### Rules

Le principe est de vérifier si des règles de redirection n'ont pas été mises en place par l'attaquant.

```powershell
# Inbox rules
Get-InboxRule -Mailbox "victime@societe.com" | Select-Object Name, Description, RedirectTo, ForwardTo, ForwardAsAttachmentTo

# Forwarding SMTP
Get-Mailbox -Identity "victime@societe.com" | Select-Object DeliverToMailboxAndForward, ForwardingAddress, ForwardingSmtpAddress
```

### Application OAuth

Vérifier si l'attaquant n'a pas enregistré une Application malveillante avec le compte compromis, qui lui permettrait par la suite de garder un accès.

```
Aller sur le portail microsoft => Applications d'entreprise => filtrer sur "toutes les applications" => vérifier les applications par date de création => faire un check des dernières applications et leurs permissions.
```

## Analyse des logs

Chercher les activités de l'utilisateur sur une certaine période de temps.

```powershell
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-2) -EndDate (Get-Date) -FreeText "victime@societe.com" -ResultSize 5000 | Select-Object CreationTime, UserIds, Operations, Workload, IPAddress
```

## Remédiation/Purge via Purview

Si l'attaquant a envoyé des mails en interne, il est possible de les supprimer des boites mails des utilisateurs. Le mieux est d'utiliser Purview, qui est le module compliance de microsoft, l'action sera auditable facilement par la suite en cas de besoin.

```powershell
# Connexion
Connect-IPPSSession

# Définir la requête (Ex: Sujet contient "Le sujet du mail" envoyé par la victime)
$SearchName = "Incident-BEC-Remove-Phish"
$KQLQuery = 'From:victime@societe.com AND Subject:"Le sujet du mail"'

# Créer et lancer la recherche
New-ComplianceSearch -Name $SearchName -ExchangeLocation All -ContentMatchQuery $KQLQuery
Start-ComplianceSearch -Identity $SearchName

# Attendre que le statut soit "Completed"
Get-ComplianceSearch -Identity $SearchName | Select-Object Status

# Obtenir un aperçu des résultats
Get-ComplianceSearchAction -SearchName $SearchName -Preview
```

Nous pouvons ensuite lancer la purge : il existe deux possibilités pour l'effacement des mails:  HardDelete et SoftDelete => le SoftDelete va garder le mail dans les éléments supprimés, ce qui peut être utile dans certains cas.

```powershell
# Lancer la purge (HardDelete = irrécupérable par l'utilisateur)
New-ComplianceSearchAction -SearchName $SearchName -Purge -PurgeType SoftDelete

# Vérifier le statut de la purge
Get-ComplianceSearchAction -Identity "${SearchName}_Purge" | Select-Object Status, Results
```

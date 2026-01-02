### 🚀 Pré-requis

- **Installer Azure CLI** : [Documentation officielle](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli)

#### Se connecter à Azure

```powershell
az login
```
#### Changer d’abonnement

```powershell
az account set --subscription "Nom_de_l'abonnement"
```
#### Afficher l’abonnement courant

```powershell
az account show
```

---
### 🥞 Gestion des Groupes de Ressources

#### Lister les groupes de ressources

```powershell
az group list --output table
```
#### Créer un groupe de ressources

```powershell
az group create --name MyResourceGroup --location eastus
```
#### Supprimer un groupe de ressources

```powershell
az group delete --name MyResourceGroup --yes
```
#### Afficher les détails d’un groupe de ressources

```powershell
az group show --name MyResourceGroup
```

---
### 💻 Gestion des Machines Virtuelles (VM)

#### Créer une VM

```powershell
az vm create --resource-group MyResourceGroup --name MyVM --image UbuntuLTS --admin-username azureuser --generate-ssh-keys
```
#### Démarrer une VM

```powershell
az vm start --resource-group MyResourceGroup --name MyVM
```
#### Arrêter une VM

```powershell
az vm stop --resource-group MyResourceGroup --name MyVM
```
#### Redémarrer une VM

```powershell
az vm restart --resource-group MyResourceGroup --name MyVM
```
#### Supprimer une VM

```powershell
az vm delete --resource-group MyResourceGroup --name MyVM --yes
```
#### Lister toutes les VM dans un groupe de ressources

```powershell
az vm list --resource-group MyResourceGroup --output table
```
#### Afficher les informations détaillées d’une VM

```powershell
az vm show --resource-group MyResourceGroup --name MyVM --show-details
```
#### Obtenir l'adresse IP publique d’une VM

```powershell
az vm list-ip-addresses --resource-group MyResourceGroup --name MyVM --output table
```

---
### 💾 Gestion des Disques

#### Lister les disques d’un groupe de ressources

```powershell
az disk list --resource-group MyResourceGroup --output table
```
#### Créer un disque managé

```powershell
az disk create --resource-group MyResourceGroup --name MyDisk --size-gb 128
```
#### Supprimer un disque

```powershell
az disk delete --resource-group MyResourceGroup --name MyDisk --yes
```

---
### 🗃️ Gestion des Comptes de Stockage

#### Lister les comptes de stockage

```powershell
az storage account list --output table
```
#### Créer un compte de stockage

```powershell
az storage account create --name mystorageaccount --resource-group MyResourceGroup --location eastus --sku Standard_LRS
```
#### Obtenir les clés d’accès d’un compte de stockage

```powershell
az storage account keys list --resource-group MyResourceGroup --account-name mystorageaccount --output table
```
#### Supprimer un compte de stockage

```powershell
az storage account delete --name mystorageaccount --resource-group MyResourceGroup --yes
```

---
### 🌐 Gestion des Réseaux

#### Créer un Virtual Network (VNet)

```powershell
az network vnet create --name MyVNet --resource-group MyResourceGroup --subnet-name MySubnet
```
#### Ajouter un sous-réseau

```powershell
az network vnet subnet create --resource-group MyResourceGroup --vnet-name MyVNet --name MyNewSubnet --address-prefix 10.0.1.0/24
```
#### Créer une adresse IP publique

```powershell
az network public-ip create --resource-group MyResourceGroup --name MyPublicIP
```
#### Créer un Network Security Group (NSG)

```powershell
az network nsg create --resource-group MyResourceGroup --name MyNSG
```
#### Ajouter une règle au NSG

```powershell
az network nsg rule create --resource-group MyResourceGroup --nsg-name MyNSG --name AllowSSH --protocol Tcp --direction Inbound --priority 1000 --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 22 --access Allow
```

---
### 🗄️ Gestion des Bases de Données (SQL)

#### Créer un serveur SQL

```powershell
az sql server create --name myserver --resource-group MyResourceGroup --location eastus --admin-user myadmin --admin-password SecurePassword123!
```
#### Créer une base de données SQL

```powershell
az sql db create --resource-group MyResourceGroup --server myserver --name mydatabase --service-objective S0
```
#### Lister les bases de données SQL d’un serveur

```powershell
az sql db list --resource-group MyResourceGroup --server myserver --output table
```
#### Supprimer une base de données SQL

```powershell
az sql db delete --resource-group MyResourceGroup --server myserver --name mydatabase --yes
```

---
### 🤼 Gestion des Utilisateurs Azure AD

#### Lister tous les utilisateurs

```powershell
az ad user list --output table
```
#### Créer un nouvel utilisateur

```powershell
az ad user create --display-name "John Doe" --user-principal-name jdoe@domain.onmicrosoft.com --password "SecurePassword123!"
```
#### Supprimer un utilisateur

```powershell
az ad user delete --id jdoe@domain.onmicrosoft.com
```

---
### ⚠️ Gestion des Règles d’Alertes

#### Créer une règle d’alerte sur une VM (CPU > 80%)

```powershell
az monitor metrics alert create --name "HighCPUAlert" --resource-group MyResourceGroup --scopes "/subscriptions/<subscription-id>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/MyVM" --condition "avg Percentage CPU > 80" --description "Alerte lorsque le CPU dépasse 80%" --action-group "MyActionGroup"
```
#### Lister les alertes

```powershell
az monitor alert list --output table
```

---
### 💾 Gestion des Sauvegardes

#### Créer un Recovery Vault

```powershell
az backup vault create --resource-group MyResourceGroup --name MyRecoveryVault --location eastus
```
#### Configurer la protection d’une VM

```powershell
az backup protection enable-for-vm --resource-group MyResourceGroup --vault-name MyRecoveryVault --vm MyVM --policy-name DefaultPolicy
```
#### Démarrer une sauvegarde manuelle

```powershell
az backup protection backup-now --resource-group MyResourceGroup --vault-name MyRecoveryVault --container-name MyContainer --item-name MyVM --retain-until 30-12-2024
```

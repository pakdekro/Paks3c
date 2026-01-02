#### Création d'une VM en powershell

```powershell
az vm create \
  --resource-group "[sandbox resource group name]" \
  --name my-vm \
  --public-ip-sku Standard \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys
```


#!/bin/bash

# Azure Virtual Machine Deployment for Kukkuta Kendra

set -e

echo "🚀 Deploying to Azure Virtual Machine..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
VM_NAME="kukkuta-kendra-vm"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "📦 Creating Virtual Machine..."
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard

echo "🔧 Opening port 8000..."
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 8000

echo "📋 Getting VM IP..."
VM_IP=$(az vm show -d -g $RESOURCE_GROUP -n $VM_NAME --query publicIps -o tsv)

echo "✅ VM deployment completed!"
echo "🔗 VM IP: $VM_IP"
echo ""
echo "📝 Next steps:"
echo "1. SSH to the VM: ssh azureuser@$VM_IP"
echo "2. Install Python and dependencies"
echo "3. Deploy your backend code"
echo "4. Start the application"
echo ""
echo "🔧 Quick setup commands:"
echo "ssh azureuser@$VM_IP"
echo "sudo apt update && sudo apt install -y python3 python3-pip git"
echo "git clone <your-repo>"
echo "cd kukkuta-Kendra/backend"
echo "pip3 install -r requirements.txt"
echo "export DATABASE_URL='postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra'"
echo "export SECRET_KEY='your-super-secret-key-change-this-in-production'"
echo "python3 run.py" 
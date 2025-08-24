#!/bin/bash

# Azure Functions Deployment for Kukkuta Kendra

set -e

echo "🚀 Deploying to Azure Functions..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
STORAGE_ACCOUNT="kukkutakendrastorage"
FUNCTION_APP="kukkuta-kendra-functions"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "📦 Creating Storage Account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location eastus \
  --sku Standard_LRS

echo "🔧 Creating Function App..."
az functionapp create \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4 \
  --name $FUNCTION_APP \
  --storage-account $STORAGE_ACCOUNT \
  --os-type linux

echo "⚙️ Configuring environment variables..."
az functionapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $FUNCTION_APP \
  --settings \
    DATABASE_URL="postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra" \
    SECRET_KEY="your-super-secret-key-change-this-in-production" \
    ALLOWED_ORIGINS="*"

echo "✅ Functions deployment completed!"
echo "🔗 URL: https://$FUNCTION_APP.azurewebsites.net" 
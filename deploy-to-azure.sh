#!/bin/bash

# Azure Deployment Script for Kukkuta Kendra
# Make sure you have Azure CLI installed and are logged in

set -e

echo "🚀 Starting Azure deployment for Kukkuta Kendra..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
LOCATION="eastus"
BACKEND_APP_NAME="kukkuta-kendra-backend"
FRONTEND_APP_NAME="kukkuta-kendra-frontend"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "📋 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "🗄️ Creating PostgreSQL Flexible Server..."
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_NAME \
  --admin-user $DB_ADMIN \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_D2ds_v4 \
  --version 14 \
  --location centralus

echo "📊 Creating database..."
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_NAME \
  --database-name kukkuta_kendra

echo "📋 Creating App Service Plan..."
az appservice plan create \
  --name kukkuta-kendra-plan \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

echo "🔧 Creating Web App for backend..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan kukkuta-kendra-plan \
  --name $BACKEND_APP_NAME \
  --runtime "PYTHON:3.11"

echo "⚙️ Configuring backend environment variables..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings \
    DATABASE_URL="postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra" \
    SECRET_KEY="your-super-secret-key-change-this-in-production" \
    ALLOWED_ORIGINS="*"

echo "🌐 Creating Static Web App for frontend..."
az staticwebapp create \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/yourusername/kukkuta-Kendra \
  --location $LOCATION \
  --branch main \
  --app-location "/dist" \
  --output-location ""

echo "✅ Deployment completed!"
echo ""
echo "🔗 Your application URLs:"
echo "Backend: https://$BACKEND_APP_NAME.azurewebsites.net"
echo "Frontend: https://$FRONTEND_APP_NAME.azurestaticapps.net"
echo "API Docs: https://$BACKEND_APP_NAME.azurewebsites.net/api/v1/docs"
echo ""
echo "📝 Next steps:"
echo "1. Update your frontend API URLs to point to the backend"
echo "2. Configure GitHub secrets for automated deployment"
echo "3. Initialize the database with sample data"
echo "4. Test your application" 
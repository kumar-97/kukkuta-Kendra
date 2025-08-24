#!/bin/bash

# Simplified Backend Deployment Script for Kukkuta Kendra
# This version uses Azure App Service with SQLite for simplicity

set -e

echo "🚀 Starting simplified backend deployment for Kukkuta Kendra..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
LOCATION="eastus"
BACKEND_APP_NAME="kukkuta-kendra-backend"
PLAN_NAME="kukkuta-kendra-plan"

echo "📋 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "📋 Creating App Service Plan..."
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

echo "🔧 Creating Web App for backend..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $BACKEND_APP_NAME \
  --runtime "PYTHON:3.11"

echo "⚙️ Configuring backend environment variables..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings \
    DATABASE_URL="sqlite:///./kukkuta_kendra.db" \
    SECRET_KEY="your-super-secret-key-change-this-in-production" \
    ALLOWED_ORIGINS="*" \
    WEBSITES_PORT="8000"

echo "📁 Setting up deployment source..."
az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME

echo "🔧 Configuring startup command..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --startup-file "gunicorn azure_main:app --bind 0.0.0.0:8000 --workers 2 --worker-class uvicorn.workers.UvicornWorker"

echo "✅ Backend deployment completed!"
echo ""
echo "🔗 Your backend URL:"
echo "https://$BACKEND_APP_NAME.azurewebsites.net"
echo ""
echo "📝 Next steps:"
echo "1. Deploy your code to the web app"
echo "2. Test the API endpoints"
echo "3. Update frontend API URLs"
echo ""
echo "📋 To deploy your code:"
echo "cd backend"
echo "git init"
echo "git add ."
echo "git commit -m 'Initial commit'"
echo "git remote add azure <git-url-from-above>"
echo "git push azure main" 
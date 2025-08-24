#!/bin/bash

# Deploy Kukkuta Kendra Backend to Existing Azure Web App

set -e

echo "🚀 Deploying Kukkuta Kendra Backend to existing Azure Web App..."

# Configuration
WEBAPP_NAME="kukkuta-kendra-app"
RESOURCE_GROUP="kukkuta-kendra-rg"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "📋 Current web app status..."
az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --query "{name:name, state:state, defaultHostName:defaultHostName}" --output table

echo ""
echo "🔧 Setting up deployment..."

# Navigate to backend directory
cd backend

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Azure deployment"
fi

# Get the git remote URL
GIT_URL=$(az webapp deployment source config-local-git --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --query url --output tsv)

echo "🔗 Git remote URL: $GIT_URL"

# Add Azure remote if not already added
if ! git remote get-url azure > /dev/null 2>&1; then
    echo "📡 Adding Azure remote..."
    git remote add azure $GIT_URL
else
    echo "📡 Azure remote already exists, updating..."
    git remote set-url azure $GIT_URL
fi

echo "📤 Pushing code to Azure..."
git push azure main

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔗 Your backend URL:"
echo "https://$WEBAPP_NAME-fgbaerahbufsage5.centralus-01.azurewebsites.net"
echo ""
echo "📝 Next steps:"
echo "1. Test the API endpoints"
echo "2. Update frontend API URLs"
echo "3. Check application logs if needed"
echo ""
echo "🔍 To check logs:"
echo "az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "🌐 To test the API:"
echo "curl https://$WEBAPP_NAME-fgbaerahbufsage5.centralus-01.azurewebsites.net/health" 
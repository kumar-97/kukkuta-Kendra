#!/bin/bash

# Deploy Kukkuta Kendra Backend using ZIP deployment
# For existing Azure Web App and PostgreSQL database

set -e

echo "🚀 Deploying Kukkuta Kendra Backend using ZIP deployment..."

# Configuration - UPDATE THESE VALUES
WEBAPP_NAME="kukkuta-kendra-app"
RESOURCE_GROUP="kukkuta-kendra-rg"

# Validate Azure CLI is available
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    echo "❌ Not logged into Azure. Please run 'az login' first."
    exit 1
fi

# Verify Web App exists
echo "🔍 Verifying Web App exists..."
if ! az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "❌ Web App '$WEBAPP_NAME' not found in resource group '$RESOURCE_GROUP'"
    echo "Please update the WEBAPP_NAME and RESOURCE_GROUP variables in this script."
    exit 1
fi

echo "📦 Creating deployment package..."

# Navigate to backend directory
cd backend

# Remove any existing zip file
rm -f ../backend.zip

# Create zip file excluding unnecessary files
echo "Creating zip package..."
zip -r ../backend.zip . -x "venv/*" "*.pyc" "__pycache__/*" ".git/*" "*.log" "kukkuta_kendra.db" "*.sqlite"

# Go back to root directory
cd ..

echo "📤 Deploying to Azure Web App..."
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --src-path backend.zip \
  --type zip

echo "🧹 Cleaning up..."
rm -f backend.zip

# Get the actual Web App URL
WEBAPP_URL=$(az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv)

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔗 Your backend URL:"
echo "https://$WEBAPP_URL"
echo ""
echo "📝 Next steps:"
echo "1. Test the API endpoints"
echo "2. Check application logs if needed"
echo ""
echo "🔍 To check logs:"
echo "az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "🌐 To test the API:"
echo "curl https://$WEBAPP_URL/health"
echo ""
echo "🔄 To restart the app (if needed):"
echo "az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP" 
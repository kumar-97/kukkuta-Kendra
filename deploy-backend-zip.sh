#!/bin/bash

# Deploy Kukkuta Kendra Backend using ZIP deployment

set -e

echo "🚀 Deploying Kukkuta Kendra Backend using ZIP deployment..."

# Configuration
WEBAPP_NAME="kukkuta-kendra-app"
RESOURCE_GROUP="kukkuta-kendra-rg"

echo "📦 Creating deployment package..."

# Navigate to backend directory
cd backend

# Remove any existing zip file
rm -f ../backend.zip

# Create zip file excluding unnecessary files
zip -r ../backend.zip . -x "venv/*" "*.pyc" "__pycache__/*" ".git/*" "*.log"

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
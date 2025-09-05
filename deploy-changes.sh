#!/bin/bash

# Quick Deploy Script for Kukkuta Kendra Backend Changes
# Use this when you just want to deploy code updates to existing Azure infrastructure

set -e

echo "🚀 Quick Deploy - Pushing changes to Azure..."

# Configuration - UPDATE THESE VALUES
WEBAPP_NAME="kukkuta-kendra-app"
RESOURCE_GROUP="kukkuta-kendra-rg"

# Quick validation
if ! az account show &> /dev/null; then
    echo "❌ Please run 'az login' first"
    exit 1
fi

echo "📦 Creating deployment package..."
cd backend
rm -f ../backend.zip
zip -r ../backend.zip . -x "venv/*" "*.pyc" "__pycache__/*" ".git/*" "*.log" "kukkuta_kendra.db" "*.sqlite"
cd ..

echo "📤 Deploying to Azure..."
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --src-path backend.zip \
  --type zip

echo "🧹 Cleaning up..."
rm -f backend.zip

echo "✅ Deployment completed!"
echo "🔗 Your app: https://$(az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv)"
echo ""
echo "💡 Quick commands:"
echo "  View logs: az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"
echo "  Restart:  az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"

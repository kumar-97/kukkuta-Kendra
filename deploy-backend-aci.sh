#!/bin/bash

# Backend Deployment Script for Kukkuta Kendra using Azure Container Instances

set -e

echo "🚀 Starting backend deployment using Azure Container Instances..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
LOCATION="eastus"
CONTAINER_NAME="kukkuta-kendra-backend"
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

echo "🔧 Building and pushing Docker image..."
echo "Note: This requires Docker to be installed and running"

# Build the Docker image
cd backend
docker build -t kukkuta-kendra-backend .

# Tag for Azure Container Registry (if you have one)
# docker tag kukkuta-kendra-backend yourregistry.azurecr.io/kukkuta-kendra-backend:latest

echo "📦 Deploying to Azure Container Instances..."
az container create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_NAME \
  --image kukkuta-kendra-backend:latest \
  --dns-name-label kukkuta-kendra-backend \
  --ports 8000 \
  --environment-variables \
    DATABASE_URL="postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra" \
    SECRET_KEY="your-super-secret-key-change-this-in-production" \
    ALLOWED_ORIGINS="*"

echo "✅ Backend deployment completed!"
echo ""
echo "🔗 Your backend URL:"
echo "http://kukkuta-kendra-backend.eastus.azurecontainer.io:8000"
echo ""
echo "🗄️ Database connection:"
echo "Host: $DB_NAME.postgres.database.azure.com"
echo "Database: kukkuta_kendra"
echo "Username: $DB_ADMIN"
echo ""
echo "📝 Next steps:"
echo "1. Test the API endpoints"
echo "2. Update frontend API URLs"
echo "3. Set up custom domain (optional)" 
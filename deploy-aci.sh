#!/bin/bash

# Azure Container Instances Deployment for Kukkuta Kendra

set -e

echo "🚀 Deploying to Azure Container Instances..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
CONTAINER_NAME="kukkuta-kendra-backend"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "📦 Deploying to Azure Container Instances..."
az container create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_NAME \
  --image python:3.11-slim \
  --dns-name-label kukkuta-kendra-backend \
  --ports 8000 \
  --environment-variables \
    DATABASE_URL="postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra" \
    SECRET_KEY="your-super-secret-key-change-this-in-production" \
    ALLOWED_ORIGINS="*" \
  --command-line "bash -c 'pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-jose passlib python-multipart && python -m uvicorn azure_main:app --host 0.0.0.0 --port 8000'"

echo "✅ ACI deployment completed!"
echo "🔗 URL: http://kukkuta-kendra-backend.eastus.azurecontainer.io:8000" 
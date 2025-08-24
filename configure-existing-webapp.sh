#!/bin/bash

# Configure Existing Azure Web App for Kukkuta Kendra Backend

set -e

echo "🔧 Configuring existing Azure Web App for Kukkuta Kendra..."

# Configuration
WEBAPP_NAME="kukkuta-kendra-app"
RESOURCE_GROUP="kukkuta-kendra-rg"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "⚙️ Setting environment variables..."

# Set database URL
az webapp config appsettings set \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings DATABASE_URL="postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra"

# Set secret key
az webapp config appsettings set \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings SECRET_KEY="your-super-secret-key-change-this-in-production"

# Set CORS origins
az webapp config appsettings set \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings ALLOWED_ORIGINS="*"

# Set port
az webapp config appsettings set \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings WEBSITES_PORT="8000"

echo "🔧 Setting startup command..."
az webapp config set \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --startup-file "gunicorn azure_main:app --bind 0.0.0.0:8000 --workers 2 --worker-class uvicorn.workers.UvicornWorker"

echo "📁 Setting up deployment source..."
az webapp deployment source config-local-git \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP

echo "✅ Web app configuration completed!"
echo ""
echo "🔗 Your backend URL:"
echo "https://$WEBAPP_NAME-fgbaerahbufsage5.centralus-01.azurewebsites.net"
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
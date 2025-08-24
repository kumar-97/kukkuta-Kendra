# Azure Deployment Guide for Kukkuta Kendra

This guide will help you deploy both the backend (FastAPI) and frontend (React Native) to Azure.

## Prerequisites

1. Azure Account with active subscription
2. Azure CLI installed
3. GitHub repository with your code
4. PostgreSQL database (Azure Database for PostgreSQL)

## Step 1: Set Up Azure Resources

### 1.1 Create Resource Group
```bash
az group create --name kukkuta-kendra-rg --location eastus
```

### 1.2 Create PostgreSQL Database
```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group kukkuta-kendra-rg \
  --name kukkuta-kendra-db \
  --admin-user dbadmin \
  --admin-password YourStrongPassword123! \
  --sku-name Standard_B1ms \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group kukkuta-kendra-rg \
  --server-name kukkuta-kendra-db \
  --database-name kukkuta_kendra
```

### 1.3 Create App Service Plan
```bash
az appservice plan create \
  --name kukkuta-kendra-plan \
  --resource-group kukkuta-kendra-rg \
  --sku B1 \
  --is-linux
```

### 1.4 Create Web App for Backend
```bash
az webapp create \
  --resource-group kukkuta-kendra-rg \
  --plan kukkuta-kendra-plan \
  --name kukkuta-kendra-backend \
  --runtime "PYTHON:3.11"
```

### 1.5 Create Static Web App for Frontend
```bash
az staticwebapp create \
  --name kukkuta-kendra-frontend \
  --resource-group kukkuta-kendra-rg \
  --source https://github.com/yourusername/kukkuta-Kendra \
  --location eastus \
  --branch main \
  --app-location "/dist" \
  --output-location ""
```

## Step 2: Configure Environment Variables

### 2.1 Backend Environment Variables
```bash
az webapp config appsettings set \
  --resource-group kukkuta-kendra-rg \
  --name kukkuta-kendra-backend \
  --settings \
    DATABASE_URL="postgresql://dbadmin:YourStrongPassword123!@kukkuta-kendra-db.postgres.database.azure.com:5432/kukkuta_kendra" \
    SECRET_KEY="your-super-secret-key-change-this-in-production" \
    ALLOWED_ORIGINS="https://kukkuta-kendra-frontend.azurestaticapps.net"
```

### 2.2 Frontend Environment Variables
Update your frontend API URLs to point to the deployed backend:
```typescript
// In app/services/authService.ts
const API_URL = 'https://kukkuta-kendra-backend.azurewebsites.net/api/v1/auth';

// In app/services/farmerService.ts
const API_URL = 'https://kukkuta-kendra-backend.azurewebsites.net/api/v1/farmers';

// In app/services/routineService.ts
const API_URL = 'https://kukkuta-kendra-backend.azurewebsites.net/api/v1/routine';
```

## Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. `AZURE_WEBAPP_PUBLISH_PROFILE` - Get from Azure Portal
2. `AZURE_STATIC_WEB_APPS_API_TOKEN` - Get from Azure Portal
3. `AZURE_STATIC_WEB_APPS_URL` - Your Static Web App URL

### How to get publish profile:
1. Go to Azure Portal
2. Navigate to your Web App
3. Go to "Get publish profile"
4. Download and copy the content to GitHub secrets

## Step 4: Database Migration

### 4.1 Initialize Database
```bash
# Connect to your Azure PostgreSQL
psql "host=kukkuta-kendra-db.postgres.database.azure.com port=5432 dbname=kukkuta_kendra user=dbadmin password=YourStrongPassword123! sslmode=require"

# Run the initialization script
\i backend/scripts/init_db.py
```

## Step 5: Deploy

### 5.1 Backend Deployment
The backend will be deployed automatically when you push to the main branch due to the GitHub Actions workflow.

### 5.2 Frontend Deployment
The frontend will also be deployed automatically via GitHub Actions.

## Step 6: Configure CORS

Update your backend CORS settings to allow your frontend domain:

```python
# In azure_config.py
allowed_origins: list = [
    "https://kukkuta-kendra-frontend.azurestaticapps.net",
    "http://localhost:3000"  # For local development
]
```

## Step 7: Test Your Deployment

1. **Backend Health Check**: `https://kukkuta-kendra-backend.azurewebsites.net/health`
2. **API Documentation**: `https://kukkuta-kendra-backend.azurewebsites.net/api/v1/docs`
3. **Frontend**: `https://kukkuta-kendra-frontend.azurestaticapps.net`

## Monitoring and Logs

### View Application Logs
```bash
az webapp log tail --name kukkuta-kendra-backend --resource-group kukkuta-kendra-rg
```

### Monitor Performance
- Use Azure Application Insights
- Set up alerts for errors and performance issues

## Security Considerations

1. **Environment Variables**: Never commit secrets to your repository
2. **HTTPS**: All Azure services use HTTPS by default
3. **Database Security**: Use Azure Key Vault for database credentials
4. **CORS**: Configure CORS properly for production
5. **Rate Limiting**: Consider implementing rate limiting

## Cost Optimization

1. **App Service Plan**: Use B1 for development, scale up for production
2. **Database**: Start with Basic tier, scale as needed
3. **Static Web Apps**: Free tier available for small projects

## Troubleshooting

### Common Issues:

1. **Database Connection**: Ensure firewall rules allow Azure services
2. **CORS Errors**: Check allowed origins configuration
3. **Build Failures**: Check GitHub Actions logs
4. **Environment Variables**: Verify all required variables are set

### Useful Commands:
```bash
# Check app status
az webapp show --name kukkuta-kendra-backend --resource-group kukkuta-kendra-rg

# Restart app
az webapp restart --name kukkuta-kendra-backend --resource-group kukkuta-kendra-rg

# View logs
az webapp log download --name kukkuta-kendra-backend --resource-group kukkuta-kendra-rg
``` 
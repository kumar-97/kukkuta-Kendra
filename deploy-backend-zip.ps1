# Deploy Kukkuta Kendra Backend using ZIP deployment
# For existing Azure Web App and PostgreSQL database
# Windows PowerShell Version

# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying Kukkuta Kendra Backend using ZIP deployment..." -ForegroundColor Green

# Configuration - UPDATE THESE VALUES
$WEBAPP_NAME = "kukkuta-kendra-app"
$RESOURCE_GROUP = "kukkuta-kendra-rg"

# Validate Azure CLI is available
try {
    $null = Get-Command az -ErrorAction Stop
} catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if logged into Azure
try {
    $null = az account show 2>$null
} catch {
    Write-Host "❌ Not logged into Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# Verify Web App exists
Write-Host "🔍 Verifying Web App exists..." -ForegroundColor Yellow
try {
    $null = az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP 2>$null
} catch {
    Write-Host "❌ Web App '$WEBAPP_NAME' not found in resource group '$RESOURCE_GROUP'" -ForegroundColor Red
    Write-Host "Please update the WEBAPP_NAME and RESOURCE_GROUP variables in this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow

# Navigate to backend directory
Set-Location backend

# Remove any existing zip file
if (Test-Path "../backend.zip") {
    Remove-Item "../backend.zip" -Force
}

# Create zip file excluding unnecessary files
Write-Host "Creating zip package..." -ForegroundColor Yellow
Compress-Archive -Path * -DestinationPath "../backend.zip" -Force

# Go back to root directory
Set-Location ..

Write-Host "📤 Deploying to Azure Web App..." -ForegroundColor Yellow
az webapp deploy `
  --resource-group $RESOURCE_GROUP `
  --name $WEBAPP_NAME `
  --src-path backend.zip `
  --type zip

Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
if (Test-Path "backend.zip") {
    Remove-Item "backend.zip" -Force
}

# Get the actual Web App URL
$WEBAPP_URL = az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv

Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Your backend URL:" -ForegroundColor Cyan
Write-Host "https://$WEBAPP_URL" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the API endpoints" -ForegroundColor White
Write-Host "2. Check application logs if needed" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To check logs:" -ForegroundColor Cyan
Write-Host "az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP" -ForegroundColor White
Write-Host ""
Write-Host "🌐 To test the API:" -ForegroundColor Cyan
Write-Host "curl https://$WEBAPP_URL/health" -ForegroundColor White
Write-Host ""
Write-Host "🔄 To restart the app (if needed):" -ForegroundColor Cyan
Write-Host "az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP" -ForegroundColor White

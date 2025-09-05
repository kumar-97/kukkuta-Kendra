# Quick Deploy Script for Kukkuta Kendra Backend Changes
# Use this when you just want to deploy code updates to existing Azure infrastructure
# Windows PowerShell Version

# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Quick Deploy - Pushing changes to Azure..." -ForegroundColor Green

# Configuration - UPDATED WITH ACTUAL VALUES
$WEBAPP_NAME = "kukkuta-kendra-app"
$RESOURCE_GROUP = "kukkuta-kendra-rg"

# Quick validation
try {
    $null = az account show 2>$null
} catch {
    Write-Host "Please run 'az login' first" -ForegroundColor Red
    exit 1
}

Write-Host "Creating deployment package..." -ForegroundColor Yellow
Set-Location backend

if (Test-Path "../backend.zip") {
    Remove-Item "../backend.zip" -Force
}

Compress-Archive -Path * -DestinationPath "../backend.zip" -Force
Set-Location ..

Write-Host "Deploying to Azure..." -ForegroundColor Yellow
az webapp deploy `
  --resource-group $RESOURCE_GROUP `
  --name $WEBAPP_NAME `
  --src-path backend.zip `
  --type zip

Write-Host "Cleaning up..." -ForegroundColor Yellow
if (Test-Path "backend.zip") {
    Remove-Item "backend.zip" -Force
}

Write-Host "Deployment completed!" -ForegroundColor Green
$WEBAPP_URL = az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv
Write-Host "Your app: https://$WEBAPP_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Quick commands:" -ForegroundColor Yellow
Write-Host "  View logs: az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP" -ForegroundColor White
Write-Host "  Restart:  az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP" -ForegroundColor White

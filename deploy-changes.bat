@echo off
REM Quick Deploy Script for Kukkuta Kendra Backend Changes
REM Use this when you just want to deploy code updates to existing Azure infrastructure
REM Windows Batch File Version

echo 🚀 Quick Deploy - Pushing changes to Azure...

REM Configuration - UPDATE THESE VALUES
set WEBAPP_NAME=kukkuta-kendra-app
set RESOURCE_GROUP=kukkuta-kendra-rg

REM Quick validation
az account show >nul 2>&1
if errorlevel 1 (
    echo ❌ Please run 'az login' first
    pause
    exit /b 1
)

echo 📦 Creating deployment package...
cd backend

if exist "..\backend.zip" del "..\backend.zip"

REM Create zip file (requires PowerShell)
powershell -Command "Compress-Archive -Path * -DestinationPath '..\backend.zip' -Force"
cd ..

echo 📤 Deploying to Azure...
az webapp deploy --resource-group %RESOURCE_GROUP% --name %WEBAPP_NAME% --src-path backend.zip --type zip

echo 🧹 Cleaning up...
if exist "backend.zip" del "backend.zip"

echo ✅ Deployment completed!
for /f "tokens=*" %%i in ('az webapp show --name %WEBAPP_NAME% --resource-group %RESOURCE_GROUP% --query "defaultHostName" -o tsv') do set WEBAPP_URL=%%i
echo 🔗 Your app: https://%WEBAPP_URL%
echo.
echo 💡 Quick commands:
echo   View logs: az webapp log tail --name %WEBAPP_NAME% --resource-group %RESOURCE_GROUP%
echo   Restart:  az webapp restart --name %WEBAPP_NAME% --resource-group %RESOURCE_GROUP%
echo.
pause

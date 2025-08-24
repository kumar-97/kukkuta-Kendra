#!/bin/bash

# Azure Kubernetes Service Deployment for Kukkuta Kendra

set -e

echo "🚀 Deploying to Azure Kubernetes Service..."

# Configuration
RESOURCE_GROUP="kukkuta-kendra-rg"
AKS_CLUSTER="kukkuta-kendra-aks"
DB_NAME="kukkuta-kendra-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="YourStrongPassword123!"

echo "📦 Creating AKS Cluster..."
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER \
  --node-count 1 \
  --enable-addons monitoring \
  --generate-ssh-keys

echo "🔧 Getting credentials..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER

echo "📋 Creating Kubernetes deployment..."
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kukkuta-kendra-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kukkuta-kendra-backend
  template:
    metadata:
      labels:
        app: kukkuta-kendra-backend
    spec:
      containers:
      - name: backend
        image: python:3.11-slim
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          value: "postgresql://$DB_ADMIN:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/kukkuta_kendra"
        - name: SECRET_KEY
          value: "your-super-secret-key-change-this-in-production"
        - name: ALLOWED_ORIGINS
          value: "*"
        command: ["bash", "-c"]
        args:
        - |
          pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-jose passlib python-multipart
          python -m uvicorn azure_main:app --host 0.0.0.0 --port 8000
---
apiVersion: v1
kind: Service
metadata:
  name: kukkuta-kendra-service
spec:
  selector:
    app: kukkuta-kendra-backend
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
EOF

echo "✅ AKS deployment completed!"
echo "🔗 Get external IP: kubectl get service kukkuta-kendra-service" 
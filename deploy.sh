#!/bin/bash
# Script de déploiement Azure Kudu
set -e

echo "=== Déploiement App Menus ==="

# 1. Installer les dépendances frontend
echo ">> Installation des dépendances frontend..."
cd "$DEPLOYMENT_SOURCE"
npm install --production=false

# 2. Build React pour la production
echo ">> Build du frontend React..."
npm run build

# 3. Installer les dépendances backend
echo ">> Installation des dépendances backend..."
cd "$DEPLOYMENT_SOURCE/server"
npm install --production

echo "=== Déploiement terminé avec succès ! ==="

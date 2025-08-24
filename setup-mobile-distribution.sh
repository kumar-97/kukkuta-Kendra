#!/bin/bash

# Mobile App Distribution Setup Script for Kukkuta Kendra

echo "📱 Setting up mobile app distribution for Kukkuta Kendra..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install EAS CLI
echo "📦 Installing EAS CLI..."
npm install -g @expo/eas-cli

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI installation failed. Please try again."
    exit 1
fi

echo "✅ EAS CLI installed successfully"

# Install Expo CLI
echo "📦 Installing Expo CLI..."
npm install -g @expo/cli

echo "✅ Expo CLI installed successfully"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p assets/icons
mkdir -p assets/screenshots

echo "✅ Directories created"

# Check if eas.json exists
if [ ! -f "eas.json" ]; then
    echo "❌ eas.json not found. Please run 'eas build:configure' first."
    echo "📝 Run the following commands:"
    echo "   eas login"
    echo "   eas build:configure"
    exit 1
fi

echo "✅ eas.json found"

# Check if app.config.js exists
if [ ! -f "app.config.js" ]; then
    echo "❌ app.config.js not found. Please create it first."
    exit 1
fi

echo "✅ app.config.js found"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Login to Expo: eas login"
echo "2. Configure EAS: eas build:configure"
echo "3. Build for testing: eas build --platform android --profile preview"
echo "4. Build for production: eas build --platform android --profile production"
echo ""
echo "📱 Distribution options:"
echo "• Google Play Store (Android) - $25 one-time fee"
echo "• Apple App Store (iOS) - $99/year"
echo "• Direct APK distribution (Android only) - Free"
echo "• TestFlight/Internal Testing - Free"
echo ""
echo "🔗 Useful links:"
echo "• Expo Dashboard: https://expo.dev"
echo "• Google Play Console: https://play.google.com/console"
echo "• Apple Developer: https://developer.apple.com"
echo "• EAS Documentation: https://docs.expo.dev/eas/" 
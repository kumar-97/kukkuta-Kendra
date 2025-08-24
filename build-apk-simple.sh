#!/bin/bash

echo "=== Kukkuta Kendra APK Build Script (EAS Build) ==="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Checking EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

echo ""
echo "Step 3: Logging into Expo (if not already logged in)..."
eas whoami

echo ""
echo "Step 4: Building APK using EAS Build..."
echo "This will build your APK in the cloud and provide a download link."
echo ""

# Try to build using EAS
if eas build --platform android --profile preview --local; then
    echo ""
    echo "=== BUILD SUCCESSFUL! ==="
    echo "Your APK has been built and should be available for download."
    echo ""
    echo "Alternative methods if EAS Build fails:"
    echo "1. Use the build-apk.sh script (requires Android SDK)"
    echo "2. Install Android Studio and build locally"
    echo "3. Use Expo Go app to test the app during development"
else
    echo ""
    echo "=== EAS BUILD FAILED ==="
    echo ""
    echo "Trying alternative approach..."
    echo ""
    echo "Step 5: Creating development build..."
    
    # Try development build
    if eas build --platform android --profile development --local; then
        echo ""
        echo "=== DEVELOPMENT BUILD SUCCESSFUL! ==="
        echo "Your development APK has been built."
    else
        echo ""
        echo "=== ALL BUILD METHODS FAILED ==="
        echo ""
        echo "Please try one of these alternatives:"
        echo ""
        echo "1. Run the local build script:"
        echo "   ./build-apk.sh"
        echo ""
        echo "2. Install Android Studio and build manually:"
        echo "   - Open android/ folder in Android Studio"
        echo "   - Build > Build Bundle(s) / APK(s) > Build APK(s)"
        echo ""
        echo "3. Use Expo Go for testing:"
        echo "   npx expo start"
        echo "   Then scan QR code with Expo Go app"
    fi
fi 
#!/bin/bash

echo "=== Kukkuta Kendra APK Build Script ==="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Prebuilding Android project..."
npx expo prebuild --platform android --clean

echo ""
echo "Step 3: Setting up Android SDK environment..."

# Check if ANDROID_HOME is set
if [ -z "$ANDROID_HOME" ]; then
    echo "ANDROID_HOME is not set. Please set it to your Android SDK location."
    echo "You can install Android Studio and set ANDROID_HOME to:"
    echo "  Linux: ~/Android/Sdk"
    echo "  macOS: ~/Library/Android/sdk"
    echo "  Windows: C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk"
    echo ""
    echo "Or you can install Android SDK command line tools:"
    echo "  sudo apt install android-sdk"
    echo ""
    echo "After installing, set ANDROID_HOME environment variable:"
    echo "  export ANDROID_HOME=/path/to/your/android/sdk"
    echo ""
    echo "Would you like to continue with a default SDK path? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        export ANDROID_HOME=/home/user/Android/Sdk
    else
        echo "Please set ANDROID_HOME and run this script again."
        exit 1
    fi
fi

echo "ANDROID_HOME is set to: $ANDROID_HOME"

# Create local.properties if it doesn't exist
if [ ! -f "android/local.properties" ]; then
    echo "Creating local.properties..."
    echo "sdk.dir=$ANDROID_HOME" > android/local.properties
fi

echo ""
echo "Step 4: Building APK..."
cd android

# Check if gradlew is executable
if [ ! -x "./gradlew" ]; then
    chmod +x ./gradlew
fi

echo "Building debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "=== BUILD SUCCESSFUL! ==="
    echo ""
    echo "Your APK file is located at:"
    echo "  android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "To install on a connected device:"
    echo "  adb install android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "To install on an emulator:"
    echo "  adb -e install android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo ""
    echo "=== BUILD FAILED ==="
    echo ""
    echo "Common solutions:"
    echo "1. Install Android SDK and set ANDROID_HOME"
    echo "2. Install Android Studio and let it install SDK"
    echo "3. Run: sudo apt install android-sdk"
    echo "4. Make sure you have Java JDK installed"
    echo ""
    echo "For more detailed error information, run:"
    echo "  cd android && ./gradlew assembleDebug --stacktrace"
fi

cd .. 
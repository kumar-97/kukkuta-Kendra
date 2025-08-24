# Kukkuta Kendra - APK Build Guide

This guide provides multiple methods to generate an APK file for your React Native Expo app.

## Method 1: EAS Build (Recommended - Cloud Build)

This method builds your APK in the cloud without requiring local Android SDK setup.

### Prerequisites:
- Expo account (free)
- Internet connection

### Steps:
1. **Run the automated script:**
   ```bash
   ./build-apk-simple.sh
   ```

2. **Or run manually:**
   ```bash
   # Install dependencies
   npm install
   
   # Login to Expo (if not already logged in)
   npx eas login
   
   # Build APK
   npx eas build --platform android --profile preview
   ```

3. **Download the APK:**
   - EAS will provide a download link when the build completes
   - The build typically takes 10-15 minutes

## Method 2: Local Build (Requires Android SDK)

This method builds the APK locally on your machine.

### Prerequisites:
- Android Studio installed
- Android SDK installed
- Java JDK installed

### Steps:
1. **Install Android Studio:**
   ```bash
   # Download from: https://developer.android.com/studio
   # Or install via package manager:
   sudo snap install android-studio --classic
   ```

2. **Set up Android SDK:**
   - Open Android Studio
   - Go to Tools > SDK Manager
   - Install Android SDK (API level 35 recommended)
   - Set ANDROID_HOME environment variable:
     ```bash
     export ANDROID_HOME=$HOME/Android/Sdk
     echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
     ```

3. **Run the automated script:**
   ```bash
   ./build-apk.sh
   ```

4. **Or build manually:**
   ```bash
   # Prebuild Android project
   npx expo prebuild --platform android
   
   # Build APK
   cd android
   ./gradlew assembleDebug
   
   # APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Method 3: Using Android Studio (GUI Method)

### Steps:
1. **Open the Android project:**
   - Open Android Studio
   - Select "Open an existing project"
   - Navigate to your project's `android/` folder
   - Click "OK"

2. **Build the APK:**
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Wait for the build to complete
   - Click "locate" to find the APK file

## Method 4: Development Testing (No APK needed)

For development and testing, you can use Expo Go app:

### Steps:
1. **Start the development server:**
   ```bash
   npx expo start
   ```

2. **Install Expo Go on your Android device:**
   - Download from Google Play Store

3. **Scan the QR code:**
   - Open Expo Go app
   - Scan the QR code displayed in your terminal
   - The app will load on your device

## Troubleshooting

### Common Issues:

1. **"SDK location not found" error:**
   - Install Android Studio and SDK
   - Set ANDROID_HOME environment variable
   - Create `android/local.properties` file with SDK path

2. **"EAS Build failed" error:**
   - Check your internet connection
   - Ensure you're logged into Expo: `npx eas login`
   - Try the local build method instead

3. **"Gradle build failed" error:**
   - Update Java JDK to version 17 or higher
   - Clean the project: `cd android && ./gradlew clean`
   - Try building again

4. **"Permission denied" errors:**
   - Make sure gradlew is executable: `chmod +x android/gradlew`
   - Run with appropriate permissions

### Environment Setup:

```bash
# Install Java JDK
sudo apt update
sudo apt install openjdk-17-jdk

# Install Android Studio (if not using EAS Build)
sudo snap install android-studio --classic

# Set environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Add to .bashrc for persistence
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.bashrc
```

## APK Installation

Once you have the APK file:

1. **Enable "Unknown Sources" on your Android device:**
   - Go to Settings > Security > Unknown Sources
   - Enable it for your file manager

2. **Install the APK:**
   - Transfer the APK to your device
   - Open the APK file
   - Follow the installation prompts

3. **Or install via ADB:**
   ```bash
   adb install app-debug.apk
   ```

## File Locations

- **EAS Build APK:** Downloaded from EAS dashboard
- **Local Build APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Android Studio APK:** `android/app/build/outputs/apk/debug/app-debug.apk`

## Next Steps

After generating the APK:
1. Test the app thoroughly on different devices
2. Consider signing the APK for production release
3. Upload to Google Play Store (if intended for public distribution)
4. Set up automated builds for future releases

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Expo documentation: https://docs.expo.dev/
3. Check React Native documentation: https://reactnative.dev/
4. Search for similar issues on Stack Overflow 
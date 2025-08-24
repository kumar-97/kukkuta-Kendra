# Mobile App Distribution Guide for Kukkuta Kendra

This guide covers how to distribute your React Native app to Android and iOS users.

## Option 1: Expo Application Services (EAS) - Recommended

### Prerequisites
1. Expo account (free)
2. EAS CLI installed: `npm install -g @expo/eas-cli`
3. For Android: Google Play Console account ($25 one-time fee)
4. For iOS: Apple Developer Program account ($99/year)

### Step 1: Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```

### Step 3: Configure EAS
```bash
eas build:configure
```

### Step 4: Build for Development/Testing

#### Android APK (for testing)
```bash
eas build --platform android --profile preview
```

#### iOS Simulator Build
```bash
eas build --platform ios --profile development
```

### Step 5: Build for Production

#### Android App Bundle
```bash
eas build --platform android --profile production
```

#### iOS App Store
```bash
eas build --platform ios --profile production
```

### Step 6: Submit to Stores

#### Google Play Store
```bash
eas submit --platform android
```

#### Apple App Store
```bash
eas submit --platform ios
```

## Option 2: Direct APK Distribution (Android Only)

### Build APK Locally
```bash
# Install Expo CLI
npm install -g @expo/cli

# Build APK
expo build:android -t apk
```

### Distribution Methods:
1. **Email**: Send APK file directly
2. **Google Drive**: Upload and share link
3. **Website**: Host APK on your website
4. **QR Code**: Generate QR code for direct download

## Option 3: TestFlight (iOS) and Internal Testing (Android)

### iOS TestFlight
1. Build with EAS: `eas build --platform ios --profile production`
2. Submit to App Store Connect: `eas submit --platform ios`
3. Add testers in App Store Connect
4. Testers receive email invitation

### Android Internal Testing
1. Build with EAS: `eas build --platform android --profile production`
2. Submit to Google Play Console: `eas submit --platform android`
3. Add testers in Google Play Console
4. Testers receive email invitation

## Option 4: Expo Go (Development Only)

### For Development and Testing
1. Users install Expo Go from App Store/Play Store
2. Share your Expo development URL
3. Users scan QR code or enter URL in Expo Go

```bash
# Start development server
npx expo start

# Share the QR code or URL with testers
```

## Configuration Files

### Update app.config.js for Production
```javascript
export default {
  expo: {
    name: "Kukkuta Kendra",
    slug: "kukkuta-kendra",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kukkutakendra.app",
      buildNumber: "1.0.0"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.kukkutakendra.app",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: ["expo-router"],
    scheme: "kukkuta-kendra",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
```

## Store Requirements

### Google Play Store
1. **App Icon**: 512x512 PNG
2. **Feature Graphic**: 1024x500 PNG
3. **Screenshots**: 2-8 screenshots per device type
4. **App Description**: Compelling description
5. **Privacy Policy**: Required for data collection
6. **Content Rating**: Complete content rating questionnaire

### Apple App Store
1. **App Icon**: 1024x1024 PNG
2. **Screenshots**: 3-10 screenshots per device type
3. **App Description**: Compelling description
4. **Privacy Policy**: Required for data collection
5. **App Review**: Apple reviews all apps

## Cost Breakdown

### Android
- **Google Play Console**: $25 (one-time)
- **EAS Build**: Free tier available
- **Distribution**: Free

### iOS
- **Apple Developer Program**: $99/year
- **EAS Build**: Free tier available
- **Distribution**: Free

## Quick Start Commands

```bash
# 1. Install EAS CLI
npm install -g @expo/eas-cli

# 2. Login to Expo
eas login

# 3. Configure project
eas build:configure

# 4. Build for testing (Android APK)
eas build --platform android --profile preview

# 5. Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# 6. Submit to stores
eas submit --platform android
eas submit --platform ios
```

## Alternative: Direct APK Distribution Script

```bash
#!/bin/bash
# Quick APK build and distribution script

echo "🚀 Building APK for Kukkuta Kendra..."

# Build APK
eas build --platform android --profile preview --non-interactive

echo "✅ APK built successfully!"
echo ""
echo "📱 Distribution options:"
echo "1. Email the APK file to users"
echo "2. Upload to Google Drive and share link"
echo "3. Host on your website"
echo "4. Use QR code for direct download"
echo ""
echo "🔗 Build URL will be provided after completion"
```

## Testing Before Release

### Internal Testing Checklist
- [ ] Test on multiple Android devices
- [ ] Test on multiple iOS devices
- [ ] Test all app features
- [ ] Test offline functionality
- [ ] Test with slow internet
- [ ] Test app performance
- [ ] Test user registration/login
- [ ] Test data submission
- [ ] Test image uploads

### Beta Testing
1. Use TestFlight (iOS) and Internal Testing (Android)
2. Gather feedback from 10-20 users
3. Fix reported issues
4. Release to production

## Monitoring and Analytics

### Recommended Tools
1. **Expo Analytics**: Built-in analytics
2. **Firebase Analytics**: Detailed user insights
3. **Crashlytics**: Crash reporting
4. **App Store Connect**: Download metrics
5. **Google Play Console**: User metrics

## Security Considerations

1. **API Keys**: Store securely in environment variables
2. **Backend Security**: Use HTTPS for all API calls
3. **Data Encryption**: Encrypt sensitive data
4. **App Signing**: Use proper app signing certificates
5. **Code Obfuscation**: Protect your source code 
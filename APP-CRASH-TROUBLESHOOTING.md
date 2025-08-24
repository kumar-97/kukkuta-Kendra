# App Crash Troubleshooting Guide

## Issue: App Crashes After Installation

The app builds successfully but crashes when opened after installation. Here are the most common causes and solutions:

## ✅ Fixed Issues

### 1. Navigation Configuration
**Problem**: `_layout.tsx` had commented out Stack.Screen definitions
**Solution**: ✅ Fixed - Uncommented and properly configured all screen routes

### 2. Network Dependencies on Startup
**Problem**: `BackendStatus` component was making network requests on app startup
**Solution**: ✅ Fixed - Temporarily removed BackendStatus component from WelcomeScreen

### 3. Error Handling
**Problem**: No error handling for navigation failures
**Solution**: ✅ Fixed - Added try-catch blocks for navigation

## 🔍 Common Causes & Solutions

### 1. Network Permissions
**Check**: Ensure the app has internet permissions
**Solution**: Add to `app.config.js`:
```javascript
android: {
  permissions: ["INTERNET", "ACCESS_NETWORK_STATE"]
}
```

### 2. Image Assets
**Check**: Verify all image assets exist and are properly referenced
**Solution**: Ensure these files exist:
- `assets/images/hen.png`
- `assets/images/WelcomeImg.png`
- `assets/icon.png`
- `assets/splash.png`
- `assets/adaptive-icon.png`

### 3. Backend Connection Issues
**Problem**: App tries to connect to backend on startup
**Solution**: 
- Temporarily disable network calls on startup
- Add offline mode support
- Implement proper error handling for network failures

### 4. React Native Version Conflicts
**Problem**: Dependencies might have version conflicts
**Solution**: 
- Use `npm install --legacy-peer-deps`
- Update to compatible versions

## 🛠️ Debugging Steps

### Step 1: Check Device Logs
```bash
# For Android
adb logcat | grep -i "kukkuta\|react\|expo"

# For iOS (if using iOS device)
# Use Xcode Console or device logs
```

### Step 2: Test with Development Build
```bash
# Start development server
npx expo start

# Use Expo Go app to test
# This will show more detailed error messages
```

### Step 3: Check for JavaScript Errors
- Open device developer menu (shake device)
- Check for red error screens
- Look for yellow warning boxes

### Step 4: Test Minimal Version
Create a minimal test screen to isolate the issue:

```javascript
// app/test.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>App is working!</Text>
    </View>
  );
}
```

## 🔧 Quick Fixes to Try

### Fix 1: Add Network Permissions
Update `app.config.js`:
```javascript
android: {
  adaptiveIcon: {
    foregroundImage: "./assets/adaptive-icon.png",
    backgroundColor: "#FFFFFF"
  },
  package: "com.kukkutakendra.app",
  permissions: ["INTERNET", "ACCESS_NETWORK_STATE"]
}
```

### Fix 2: Disable Network Calls Temporarily
Comment out any network requests in:
- `WelcomeScreen.tsx`
- `LoginScreen.tsx`
- `SignUpScreen.tsx`

### Fix 3: Add Error Boundaries
Wrap main components with error handling:

```javascript
import { Alert } from 'react-native';

// Add to navigation calls
try {
  navigation.navigate('/screen');
} catch (error) {
  Alert.alert('Error', 'Navigation failed');
}
```

### Fix 4: Check Asset Sizes
Ensure images aren't too large:
- Compress images if they're > 1MB
- Use appropriate formats (PNG for icons, JPEG for photos)

## 📱 Testing Checklist

- [ ] App installs without errors
- [ ] App opens to welcome screen
- [ ] Navigation between screens works
- [ ] No red error screens appear
- [ ] No network timeout errors
- [ ] Images load properly
- [ ] Buttons respond to touch

## 🚀 Next Steps

1. **Rebuild the app** with the fixes applied
2. **Test on a clean device** (uninstall previous version)
3. **Check device logs** for specific error messages
4. **Test with Expo Go** first to isolate issues
5. **Gradually re-enable features** to identify the problematic component

## 📞 If Issues Persist

1. Check the device logs for specific error messages
2. Test with a minimal version of the app
3. Verify all dependencies are compatible
4. Consider using a development build for better debugging

## 🔄 Rebuild Instructions

After applying fixes:

```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Rebuild APK
npx eas build --platform android --profile preview
```

The app should now work properly after installation! 
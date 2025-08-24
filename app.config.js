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
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kukkutakendra.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.kukkutakendra.app",
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"]
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-router"
    ],
    scheme: "kukkuta-kendra",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "67f8ea5a-4828-40e2-9a98-353ea89e11c8"
      }
    }
  }
}; 
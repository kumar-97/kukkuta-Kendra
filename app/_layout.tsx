import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="test" />
      <Stack.Screen name="screens/HomeScreen" />
      <Stack.Screen name="screens/LoginScreen" />
      <Stack.Screen name="screens/SignUpScreen" />
      <Stack.Screen name="screens/WelcomeScreen" />
      <Stack.Screen name="farmer/FarmerDashboard" />
      <Stack.Screen name="mill/MillDashboard" />
      <Stack.Screen name="admin/AdminScreen" />
      <Stack.Screen name="report/ReportScreen" />
    </Stack>
  );
}

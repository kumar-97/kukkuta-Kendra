
import React from 'react'
import WelcomeScreen from '../screens/WelcomeScreen'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'

const AppNavigation = () => {
  return (
//     <Stack screenOptions={{headerShown:false}}>
//      <Stack.Screen name="screens/index" />
//       <Stack.Screen name="screens/HomeScreen" />
//      <Stack.Screen name="screens/LoginScreen" />
//       <Stack.Screen name="screens/SignUpScreen" />
//    </Stack>
<NavigationContainer>
<Stack.Navigator initialRouteName='Welcome'><Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
  <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
  <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
  <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} />
</Stack.Navigator>
</NavigationContainer>
  )
}

export default AppNavigation
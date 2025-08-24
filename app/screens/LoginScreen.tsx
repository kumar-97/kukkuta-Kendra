import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Using Ionicons
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { login, LoginPayload } from '../services/authService';

const { width, height } = Dimensions.get('window'); // Get screen dimensions
const isSmallScreen = height < 700; // Check for small screens like iPhone SE
export const themeColors = {
  bg: '#8F9779', // Muted olive green
  accent: '#D4A017', // Goldenrod for accents
  text: '#333333', // Dark gray for text
  inputBg: '#F5F5F5', // Light gray for input backgrounds
  white: '#FFFFFF', // White for contrast
};


export default function LoginScreen() {
  const navigation = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Navigation handler
  const navigateByUserType = (userType: string) => {
    if (userType === "farmer" || userType === "FARMER") {
      navigation.navigate("/farmer/FarmerDashboard");
    } 
    if (userType === "mill" || userType === "MILL") {
      navigation.navigate('/mill/MillDashboard');
    }
    if (userType === "admin" || userType === "ADMIN") {
      navigation.navigate('/admin/AdminScreen');
    }
    if (userType === "report" || userType === "REPORT") {
      navigation.navigate('/report/ReportScreen');
    }
  };

  // Login handler
  const handleLogin = async () => {
    try {
      const payload: LoginPayload = { email, password };
      const data = await login(payload);
      console.log('Login response:', data);
      navigateByUserType(data.role);
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Login Failed', (error as any).toString());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.back()}
          >
            {/* <Ionicons name="arrow-back" size={24} color="black" /> Ionicons back arrow */}
          </TouchableOpacity>

          {/* Logo Image */}
          <Image
            source={require('../../assets/images/loginimg.png')}
            style={[
              styles.logoImage,
              isSmallScreen && { width: width * 0.6, height: height * 0.2 }, // Smaller logo for small screens
            ]}
          />

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
            />

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <Text style={styles.divider}>Or</Text>

            {/* Social Login Buttons */}
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../../assets/icons/google.png')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Redirect */}
            <View style={styles.signUpRedirectContainer}>
              <Text style={styles.signUpText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('/screens/SignUpScreen')}>
                <Text style={styles.signUpLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 10 : 20, // Smaller padding for small screens
  },
  backButton: {
    position: 'absolute',
    top: isSmallScreen ? 20 : 40, // Adjust top position for small screens
    left: 20,
    padding: 10,
  },
  logoImage: {
    width: width * 0.8,
    height: height * 0.25,
    resizeMode: 'contain',
    marginBottom: isSmallScreen ? 10 : 20, // Smaller margin for small screens
  },
  formContainer: {
    width: width * 0.9, // 90% of screen width
    backgroundColor: themeColors.white,
    borderRadius: 30,
    padding: isSmallScreen ? 15 : 20, // Smaller padding for small screens
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    color: themeColors.text,
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    backgroundColor: themeColors.inputBg,
    borderRadius: 15,
    padding: isSmallScreen ? 12 : 15, // Smaller padding for small screens
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
    color: themeColors.text,
    marginBottom: isSmallScreen ? 15 : 20, // Smaller margin for small screens
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: isSmallScreen ? 15 : 20, // Smaller margin for small screens
  },
  forgotPasswordText: {
    color: themeColors.text,
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
  },
  loginButton: {
    backgroundColor: themeColors.accent,
    borderRadius: 15,
    padding: isSmallScreen ? 12 : 15, // Smaller padding for small screens
    alignItems: 'center',
    marginBottom: isSmallScreen ? 15 : 20, // Smaller margin for small screens
  },
  buttonText: {
    color: themeColors.white,
    fontSize: isSmallScreen ? 16 : 18, // Smaller font size for small screens
    fontWeight: 'bold',
  },
  divider: {
    color: themeColors.text,
    fontSize: isSmallScreen ? 16 : 18, // Smaller font size for small screens
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 15 : 20, // Smaller margin for small screens
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: isSmallScreen ? 15 : 20, // Smaller margin for small screens
  },
  socialButton: {
    backgroundColor: themeColors.inputBg,
    borderRadius: 15,
    padding: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signUpRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: themeColors.text,
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
    fontWeight: '600',
  },
  signUpLink: {
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
    fontWeight: '600',
    color: themeColors.accent,
    marginLeft: 5,
  },
});

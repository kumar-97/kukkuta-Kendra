import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import { register, RegisterPayload } from '../services/authService';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export const themeColors = {
  bg: '#8F9779', // Muted olive green
  accent: '#D4A017', // Goldenrod for accents
  text: '#333333', // Dark gray for text
  inputBg: '#F5F5F5', // Light gray for input backgrounds
  white: '#FFFFFF', // White for contrast
};

const isSmallScreen = height < 700; // Check for small screens like iPhone SE

const SignUpScreen = () => {
  const navigation = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'mill' | 'admin'>('farmer');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        const payload: RegisterPayload = {
          email,
          full_name: fullName,
          password,
          role,
        };
        await register(payload);
        // Handle success (e.g., show a message or navigate to login)
        alert('Registration successful! Please log in.');
        navigation.navigate('/screens/LoginScreen');
      } catch (error) {
        alert('Registration failed: ' + error);
      }
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
            {/* Add back icon here if needed */}
          </TouchableOpacity>

          {/* Logo Image */}
          <Image
            source={require('../../assets/images/signupimg.png')}
            style={[
              styles.logoImage,
              isSmallScreen && { width: width * 0.7, height: height * 0.1 }, // Smaller logo for small screens
            ]}
          />

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={value => setFullName(value)}
              placeholder="Enter Name"
              placeholderTextColor="#999"
            />

            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={value => setEmail(value)}
              placeholder="Enter Email"
              placeholderTextColor="#999"
            />

            {/* Role Selection Buttons */}
            <Text style={styles.label}>Role</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: isSmallScreen ? 15 : 20 }}>
              {(['farmer', 'mill', 'admin'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleButton,
                    role === r && styles.roleButtonSelected
                  ]}
                  onPress={() => setRole(r)}
                >
                  <Text style={role === r ? styles.roleButtonTextSelected : styles.roleButtonText}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={value => setPassword(value)}
              secureTextEntry
              placeholder="Enter Password"
              placeholderTextColor="#999"
            />

            

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
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

            {/* Login Redirect */}
            <View style={styles.loginRedirectContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('/screens/LoginScreen')}>
                <Text style={styles.loginLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    height: height * 0.15,
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
  signUpButton: {
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
  loginRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: themeColors.text,
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
    fontWeight: '600',
  },
  loginLink: {
    fontSize: isSmallScreen ? 14 : 16, // Smaller font size for small screens
    fontWeight: '600',
    color: themeColors.accent,
    marginLeft: 5,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: themeColors.inputBg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  roleButtonSelected: {
    backgroundColor: themeColors.accent,
    borderColor: themeColors.accent,
  },
  roleButtonText: {
    color: themeColors.text,
    fontWeight: '600',
  },
  roleButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
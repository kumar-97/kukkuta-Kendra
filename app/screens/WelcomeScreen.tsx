import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export const themeColors = {
    bg: '#8F9779',
 }

const WelcomeScreen = () => {
    const navigation = useRouter();

    const handleSignUp = () => {
        try {
            navigation.navigate("/screens/SignUpScreen");
        } catch (error) {
            Alert.alert('Navigation Error', 'Could not navigate to Sign Up screen');
        }
    };

    const handleLogin = () => {
        try {
            navigation.navigate('/screens/LoginScreen');
        } catch (error) {
            Alert.alert('Navigation Error', 'Could not navigate to Login screen');
        }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Simple Title */}
        <Text style={styles.title}>Kukkuta Kendra</Text>
        
        {/* Simple Subtitle */}
        <Text style={styles.subtitle}>Welcome to the Poultry Management System</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  signUpButton: {
    backgroundColor: '#D4A017',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  loginLink: {
    color: '#D4A017',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
  
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen dimensions
export const themeColors = {
    bg: '#8F9779',
 }
const WelcomeScreen = () => {
    const navigation = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Image
            source={require("../../assets/images/hen.png")}
            style={styles.imageLogo}
          />
        <Text style={styles.title}>Kukkuta Kendra</Text>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/WelcomeImg.png")}
            style={styles.image}
          />
        </View>

        {/* Buttons and Links */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("/screens/SignUpScreen")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('/screens/LoginScreen')}>
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
    backgroundColor: themeColors.bg, // Replace with your theme color
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32, // Equivalent to text-4xl in Tailwind
    textAlign: 'center',
    marginBottom: 20, // Add space below the title
  },
  imageLogo: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    resizeMode: 'contain', // Ensure the image fits within the dimensions
    marginRight: 10, // Add some spacing between the image and text
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Add space below the image
  },
  image: {
    width: width * 0.8, // 80% of screen width
    height: width * 0.8, // Maintain aspect ratio
    maxWidth: 350, // Limit maximum width
    maxHeight: 350, // Limit maximum height
  },
  buttonContainer: {
    width: '100%', // Take full width
    paddingHorizontal: 20, // Add horizontal padding
  },
  signUpButton: {
    backgroundColor: '#D4A017', // Equivalent to bg-blue-900 in Tailwind
    paddingVertical: 12, // Equivalent to py-3 in Tailwind
    borderRadius: 12, // Equivalent to rounded-xl in Tailwind
    marginBottom: 16, // Add space below the button
  },
  buttonText: {
    color: 'white',
    fontSize: 20, // Equivalent to text-xl in Tailwind
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontWeight: '600', // Equivalent to font-semibold in Tailwind
  },
  loginLink: {
    fontWeight: '600', // Equivalent to font-semibold in Tailwind
    color: '#3b82f6', // Equivalent to text-black-500 in Tailwind (replace with your color)
    marginLeft: 5, // Add space between text and link
  },
});

export default WelcomeScreen;
  
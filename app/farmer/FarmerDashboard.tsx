import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'routine' | 'order' | 'sell'>('routine');
  
  // Routine Section States
  const [mortalityCount, setMortalityCount] = useState('');
  const [feedConsumption, setFeedConsumption] = useState('');
  const [birdWeight, setBirdWeight] = useState('');
  const [mortalityImage, setMortalityImage] = useState<string | null>(null);
  
  // Order Section States
  const [prestarter, setPrestarter] = useState('');
  const [starter, setStarter] = useState('');
  const [finisher, setFinisher] = useState('');
  
  // Sell Section States
  const [sellWeight, setSellWeight] = useState('');
  const [birdCount, setBirdCount] = useState('');
  const [description, setDescription] = useState('');
  const [sellImage, setSellImage] = useState<string | null>(null);

  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  // Image Picker Function
  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Submit Handlers
  const handleRoutineSubmit = () => {
    if (!mortalityCount || !feedConsumption || !birdWeight) {
      Alert.alert('Error', 'Please fill all routine fields');
      return;
    }
    Alert.alert('Success', 'Routine data submitted!');
    // Here you would make API call
  };

  const handleOrderSubmit = () => {
    if (!prestarter && !starter && !finisher) {
      Alert.alert('Error', 'Please order at least one feed type');
      return;
    }
    Alert.alert('Success', 'Feed order submitted!');
    // API call would go here
  };

  const handleSellSubmit = () => {
    if (!sellWeight || !birdCount || !description) {
      Alert.alert('Error', 'Please fill all selling fields');
      return;
    }
    Alert.alert('Success', 'Bird selling data submitted!');
    // API call would go here
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Farmer Dashboard</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'routine' && styles.activeTab]}
          onPress={() => setActiveTab('routine')}
        >
          <Text style={styles.tabText}>Unity Routine</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'order' && styles.activeTab]}
          onPress={() => setActiveTab('order')}
        >
          <Text style={styles.tabText}>Order Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'sell' && styles.activeTab]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={styles.tabText}>Bird Selling</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content Area */}
      <ScrollView style={styles.contentContainer}>
        {/* Routine Section */}
        {activeTab === 'routine' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Daily Farm Routine</Text>
            
            {/* Mortality */}
            <Text style={styles.label}>Mortality Count</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of birds lost"
              keyboardType="numeric"
              value={mortalityCount}
              onChangeText={setMortalityCount}
            />
            
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={() => pickImage(setMortalityImage)}
            >
              <Text style={styles.buttonText}>Upload Mortality Photo</Text>
            </TouchableOpacity>
            
            {mortalityImage && (
              <Image 
                source={{ uri: mortalityImage }} 
                style={styles.imagePreview} 
              />
            )}
            
            {/* Feed Consumption */}
            <Text style={styles.label}>Feed Consumption (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Total feed consumed today"
              keyboardType="numeric"
              value={feedConsumption}
              onChangeText={setFeedConsumption}
            />
            
            {/* Bird Average */}
            <Text style={styles.label}>Average Bird Weight (grams)</Text>
            <TextInput
              style={styles.input}
              placeholder="Average weight of birds"
              keyboardType="numeric"
              value={birdWeight}
              onChangeText={setBirdWeight}
            />
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleRoutineSubmit}
            >
              <Text style={styles.buttonText}>Submit Routine Data</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Order Section */}
        {activeTab === 'order' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Place Feed Order</Text>
            
            <Text style={styles.label}>Prestarter Feed (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity needed"
              keyboardType="numeric"
              value={prestarter}
              onChangeText={setPrestarter}
            />
            
            <Text style={styles.label}>Starter Feed (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity needed"
              keyboardType="numeric"
              value={starter}
              onChangeText={setStarter}
            />
            
            <Text style={styles.label}>Finisher Feed (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity needed"
              keyboardType="numeric"
              value={finisher}
              onChangeText={setFinisher}
            />
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleOrderSubmit}
            >
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Sell Section */}
        {activeTab === 'sell' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Sell Birds</Text>
            
            <Text style={styles.label}>Total Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Total weight of birds"
              keyboardType="numeric"
              value={sellWeight}
              onChangeText={setSellWeight}
            />
            
            <Text style={styles.label}>Number of Birds</Text>
            <TextInput
              style={styles.input}
              placeholder="How many birds are you selling?"
              keyboardType="numeric"
              value={birdCount}
              onChangeText={setBirdCount}
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Describe the birds (age, health, etc.)"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={() => pickImage(setSellImage)}
            >
              <Text style={styles.buttonText}>Upload Bird Photos</Text>
            </TouchableOpacity>
            
            {sellImage && (
              <Image 
                source={{ uri: sellImage }} 
                style={styles.imagePreview} 
              />
            )}
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSellSubmit}
            >
              <Text style={styles.buttonText}>List Birds for Sale</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const themeColors = {
  bg: '#f8f9fa',
  white: '#ffffff',
  text: '#2c3e50',
  accent: '#3498db',
  inputBg: '#f1f2f6',
  success: '#28a745',
  info: '#17a2b8',
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    padding: isSmallScreen ? 10 : 20,
  },
  header: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: isSmallScreen ? 10 : 15,
    color: themeColors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: isSmallScreen ? 10 : 15,
    backgroundColor: themeColors.inputBg,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    padding: isSmallScreen ? 8 : 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: themeColors.accent,
  },
  tabText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '500',
    color: themeColors.text,
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: themeColors.white,
    borderRadius: 20,
    padding: isSmallScreen ? 15 : 20,
    marginBottom: isSmallScreen ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: isSmallScreen ? 12 : 15,
    color: themeColors.text,
    textAlign: 'center',
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    marginBottom: 6,
    color: themeColors.text,
    fontWeight: '600',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 15,
    padding: isSmallScreen ? 12 : 15,
    marginBottom: isSmallScreen ? 12 : 15,
    fontSize: isSmallScreen ? 14 : 16,
    backgroundColor: themeColors.inputBg,
    color: themeColors.text,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: themeColors.info,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: themeColors.success,
    padding: isSmallScreen ? 14 : 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: themeColors.white,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 16 : 18,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: isSmallScreen ? 12 : 15,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
});

export default FarmerDashboard;
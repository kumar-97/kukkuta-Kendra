// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';
// import * as SecureStore from 'expo-secure-store';

// export default function AdminScreen() {
//   const router = useRouter();
//   const handleLogout = async () => {
//     await SecureStore.deleteItemAsync('userRole');
//     router.replace('/screens/LoginScreen');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome, Admin!</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   text: { fontSize: 20, marginBottom: 20 }
// });

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Image,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AdminDashboard = () => {
  const [farmers, setFarmers] = useState([
    { 
      id: '1', 
      name: 'John Farmer', 
      address: '123 Farm Road, Countryside', 
      mobile: '9876543210', 
      type: 'Poultry', 
      document: null 
    },
    { 
      id: '2', 
      name: 'Sarah Grower', 
      address: '456 Orchard Lane, Farmville', 
      mobile: '9123456780', 
      type: 'Dairy', 
      document: null 
    }
  ]);
  
  const [currentFarmer, setCurrentFarmer] = useState({
    id: '',
    name: '',
    address: '',
    mobile: '',
    type: '',
    document: null
  });
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [documentImage, setDocumentImage] = useState(null);
  const [activeTab, setActiveTab] = useState('farmers'); // 'farmers' or 'reports'
  
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  const handleAddFarmer = () => {
    if (!currentFarmer.name || !currentFarmer.address || !currentFarmer.mobile || !currentFarmer.type) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    if (isEditing) {
      setFarmers(farmers.map(f => f.id === currentFarmer.id ? currentFarmer : f));
    } else {
      setFarmers([...farmers, { ...currentFarmer, id: Date.now().toString() }]);
    }
    
    resetForm();
  };

  const handleEditFarmer = (farmer :any) => {
    setCurrentFarmer(farmer);
    setDocumentImage(farmer.document);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDeleteFarmer = (id:any) => {
    setFarmers(farmers.filter(farmer => farmer.id !== id));
  };

  const resetForm = () => {
    setCurrentFarmer({
      id: '',
      name: '',
      address: '',
      mobile: '',
      type: '',
      document: null
    });
    setDocumentImage(null);
    setIsFormVisible(false);
    setIsEditing(false);
  };

  const pickDocument = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to upload documents');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      // setDocumentImage(result.assets[0].uri);
      // setCurrentFarmer({ ...currentFarmer, document: result.assets[0].uri });
    }
  };
 // Changed from 'reports' to 'batch'
const [searchQuery, setSearchQuery] = useState('');
const [batches, setBatches] = useState([
  {
    id: '1',
    batchNumber: 'BATCH-2024-001',
    noOfChicks: 5000,
    aandaDate: '2024-01-15',
    farmLocation: 'Chittoor, AP',
    farmerName: 'Rajesh Kumar',
    breedType: 'Broiler',
    ageDays: 42,
    status: 'Completed'
  },
  {
    id: '2',
    batchNumber: 'BATCH-2024-002',
    noOfChicks: 7500,
    aandaDate: '2024-01-20',
    farmLocation: 'Tirupati, AP',
    farmerName: 'Suresh Reddy',
    breedType: 'Layer',
    ageDays: 35,
    status: 'In Progress'
  },
  {
    id: '3',
    batchNumber: 'BATCH-2024-003',
    noOfChicks: 6000,
    aandaDate: '2024-01-25',
    farmLocation: 'Nellore, AP',
    farmerName: 'Mohan Das',
    breedType: 'Broiler',
    ageDays: 28,
    status: 'Active'
  }
]);

const [filteredBatches, setFilteredBatches] = useState(batches);

const handleSearchBatch = (query: string) => {
  setSearchQuery(query);
  if (!query.trim()) {
    setFilteredBatches(batches);
    return;
  }
  const filtered = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(query.toLowerCase()) ||
    batch.farmerName.toLowerCase().includes(query.toLowerCase()) ||
    batch.farmLocation.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredBatches(filtered);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return '#28a745';
    case 'Active': return '#17a2b8';
    case 'In Progress': return '#ffc107';
    case 'Pending': return '#6c757d';
    default: return '#6c757d';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN');
};

const handleViewBatch = (batchId: string) => {
  // Navigate to batch detail screen
  console.log('View batch:', batchId);
};

const handleEditBatch = (batchId: string) => {
  // Navigate to edit batch screen
  console.log('Edit batch:', batchId);
};

const handleDeleteBatch = (batchId: string) => {
  // Show confirmation and delete batch
  console.log('Delete batch:', batchId);
};

const handleAddBatch = () => {
  // Navigate to add batch screen
  console.log('Add new batch');
};

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Admin Dashboard</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'farmers' && styles.activeTab]}
          onPress={() => setActiveTab('farmers')}
        >
          <Text style={styles.tabText}>Manage Farmers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={styles.tabText}>View Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'batch' && styles.activeTab]}
          onPress={() => setActiveTab('batch')}
        >
          <Text style={styles.tabText}>View Batch</Text>
        </TouchableOpacity>
      </View>
      
      {/* Farmers Management */}
      {activeTab === 'farmers' && (
        <ScrollView style={styles.contentContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setIsFormVisible(true);
            }}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Add New Farmer</Text>
          </TouchableOpacity>
          
          {/* Farmers List */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Registered Farmers</Text>
            
            {farmers.length === 0 ? (
              <Text style={styles.emptyText}>No farmers registered yet</Text>
            ) : (
              <View>
                {farmers.map(farmer => (
                  <View key={farmer.id} style={styles.farmerCard}>
                    <View style={styles.farmerInfo}>
                      <Text style={styles.farmerName}>{farmer.name}</Text>
                      <Text style={styles.farmerDetail}>{farmer.type} Farmer</Text>
                      <Text style={styles.farmerDetail}>{farmer.mobile}</Text>
                      <Text style={styles.farmerDetail}>{farmer.address}</Text>
                    </View>
                    
                    <View style={styles.farmerActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditFarmer(farmer)}
                      >
                        <MaterialIcons name="edit" size={20} color="#3498db" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteFarmer(farmer.id)}
                      >
                        <MaterialIcons name="delete" size={20} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
      
      {/* Reports View */}
      {activeTab === 'reports' && (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Farmer Reports</Text>
            
            <View style={styles.filterContainer}>
              <TextInput
                style={styles.filterInput}
                placeholder="Search by farmer name..."
                placeholderTextColor="#999"
              />
              
              <TouchableOpacity style={styles.filterButton}>
                <MaterialIcons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.reportList}>
              {farmers.map(farmer => (
                <TouchableOpacity key={farmer.id} style={styles.reportCard}>
                  <Text style={styles.reportFarmerName}>{farmer.name}</Text>
                  <Text style={styles.reportDetail}>{farmer.type} Farmer</Text>
                  <Text style={styles.reportDetail}>Last report: Jan 15, 2024</Text>
                  
                  <TouchableOpacity style={styles.viewReportButton}>
                    <Text style={styles.viewReportText}>View Reports</Text>
                    <MaterialCommunityIcons name="file-document" size={20} color="#3498db" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
      {/* batch */}
      {activeTab === 'batch' && (
  <ScrollView style={styles.contentContainer}>
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Batch Management</Text>
      
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search by batch number..."
          placeholderTextColor="#999"
          onChangeText={(text) => handleSearchBatch(text)}
        />
        
        <TouchableOpacity style={styles.filterButton} onPress={() => handleSearchBatch(searchQuery)}>
          <MaterialIcons name="search" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.filterButton, { backgroundColor: themeColors.success }]} onPress={() => handleAddBatch()}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.reportList}>
        {filteredBatches.map(batch => (
          <TouchableOpacity key={batch.id} style={styles.reportCard} onPress={() => handleViewBatch(batch.id)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.reportFarmerName}>Batch #{batch.batchNumber}</Text>
              <View style={{ 
                backgroundColor: getStatusColor(batch.status), 
                paddingHorizontal: 12, 
                paddingVertical: 4, 
                borderRadius: 12 
              }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>{batch.status}</Text>
              </View>
            </View>
            
            <View style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <MaterialIcons name="numbers" size={16} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.reportDetail}>No of Chicks: {batch.noOfChicks.toLocaleString()}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <MaterialIcons name="calendar-today" size={16} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.reportDetail}>Aanda Date: {formatDate(batch.aandaDate)}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <MaterialIcons name="location-on" size={16} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.reportDetail}>Farm: {batch.farmLocation}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <MaterialIcons name="person" size={16} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.reportDetail}>Farmer: {batch.farmerName}</Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <MaterialIcons name="pets" size={16} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.reportDetail}>Breed: {batch.breedType}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <MaterialIcons name="schedule" size={16} color="#666" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.reportDetail}>Age: {batch.ageDays} days</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ddd' }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleViewBatch(batch.id)}>
                <Text style={styles.viewReportText}>View Details</Text>
                <MaterialIcons name="visibility" size={18} color={themeColors.accent} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
              
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginLeft: 15, padding: 8 }} onPress={() => handleEditBatch(batch.id)}>
                  <MaterialIcons name="edit" size={18} color={themeColors.success} />
                </TouchableOpacity>
                
                <TouchableOpacity style={{ marginLeft: 15, padding: 8 }} onPress={() => handleDeleteBatch(batch.id)}>
                  <MaterialIcons name="delete" size={18} color={themeColors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBatches.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <MaterialIcons name="inbox" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No batches found</Text>
          <Text style={[styles.reportDetail, { textAlign: 'center', marginBottom: 20 }]}>Create your first batch to get started</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddBatch()}>
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Create New Batch</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </ScrollView>
)}
      {/* Add/Edit Farmer Modal */}
      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {isEditing ? 'Edit Farmer' : 'Add New Farmer'}
            </Text>
            
            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Farmer Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={currentFarmer.name}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, name: text })}
              />
              
              <Text style={styles.label}>Address*</Text>
              <TextInput
                style={styles.input}
                placeholder="Full address"
                value={currentFarmer.address}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, address: text })}
              />
              
              <Text style={styles.label}>Mobile Number*</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                value={currentFarmer.mobile}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, mobile: text })}
              />
              
              <Text style={styles.label}>Farmer Type*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Poultry, Dairy, Crop"
                value={currentFarmer.type}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, type: text })}
              />
              
              <Text style={styles.label}>Document Upload</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <MaterialIcons name="cloud-upload" size={24} color="#3498db" />
                <Text style={styles.uploadButtonText}>
                  {documentImage ? 'Document Uploaded' : 'Upload Document'}
                </Text>
              </TouchableOpacity>
              
              {documentImage && (
                <Image 
                  source={{ uri: documentImage }} 
                  style={styles.documentPreview} 
                />
              )}
            </ScrollView>
            
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={[styles.formButton, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddFarmer}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update Farmer' : 'Add Farmer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Theme colors
const themeColors = {
  bg: '#f8f9fa',
  white: '#ffffff',
  text: '#2c3e50',
  accent: '#3498db',
  inputBg: '#f1f2f6',
  success: '#28a745',
  danger: '#e74c3c',
  cardBg: '#ffffff',
};

const { width } = Dimensions.get('window');
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
  addButton: {
    backgroundColor: themeColors.success,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 15,
    marginBottom: isSmallScreen ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: themeColors.white,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 16 : 18,
    marginLeft: 10,
  },
  section: {
    backgroundColor: themeColors.cardBg,
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
    borderBottomWidth: 1,
    borderBottomColor: themeColors.inputBg,
    paddingBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: themeColors.text,
    fontSize: isSmallScreen ? 16 : 18,
    marginVertical: 20,
  },
  farmerCard: {
    backgroundColor: themeColors.inputBg,
    borderRadius: 15,
    padding: isSmallScreen ? 12 : 15,
    marginBottom: isSmallScreen ? 12 : 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmerInfo: {
    flex: 3,
  },
  farmerName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  farmerDetail: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginBottom: 3,
  },
  farmerActions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: isSmallScreen ? 12 : 15,
  },
  filterInput: {
    flex: 1,
    backgroundColor: themeColors.inputBg,
    borderRadius: 10,
    padding: isSmallScreen ? 12 : 15,
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: themeColors.accent,
    borderRadius: 10,
    padding: isSmallScreen ? 12 : 15,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportList: {
    marginTop: isSmallScreen ? 10 : 15,
  },
  reportCard: {
    backgroundColor: themeColors.inputBg,
    borderRadius: 15,
    padding: isSmallScreen ? 12 : 15,
    marginBottom: isSmallScreen ? 12 : 15,
  },
  reportFarmerName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  reportDetail: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginBottom: 3,
  },
  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'flex-end',
  },
  viewReportText: {
    color: themeColors.accent,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 14 : 16,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: themeColors.white,
    borderRadius: 20,
    padding: isSmallScreen ? 15 : 20,
    width: isSmallScreen ? width * 0.9 : width * 0.8,
    // maxHeight: height * 0.8,
  },
  modalHeader: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 12 : 15,
    color: themeColors.text,
  },
  formScroll: {
    // maxHeight: height * 0.6,
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    marginBottom: 6,
    color: themeColors.text,
    fontWeight: '600',
    marginLeft: 5,
  },
  input: {
    backgroundColor: themeColors.inputBg,
    borderRadius: 10,
    padding: isSmallScreen ? 12 : 15,
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginBottom: isSmallScreen ? 12 : 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.inputBg,
    borderRadius: 10,
    padding: isSmallScreen ? 12 : 15,
    marginBottom: isSmallScreen ? 12 : 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginLeft: 10,
  },
  documentPreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: isSmallScreen ? 12 : 15,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: themeColors.inputBg,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: themeColors.success,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: themeColors.text,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 16 : 18,
  },
  saveButtonText: {
    color: themeColors.white,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 16 : 18,
  },
});

export default AdminDashboard;
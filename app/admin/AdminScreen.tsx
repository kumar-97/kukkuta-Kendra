import  { useState, useEffect } from 'react';
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
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AdminFarmerService, { 
  AdminFarmerCreate, 
  AdminFarmerUpdate, 
  FarmerListItem,
  FarmersCountResponse 
} from '../services/adminService';

const AdminDashboard = () => {
  // State for real data from backend
  const [farmers, setFarmers] = useState<FarmerListItem[]>([]);
  const [farmersCount, setFarmersCount] = useState<FarmersCountResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form state
  const [currentFarmer, setCurrentFarmer] = useState<AdminFarmerCreate>({
    email: '',
    full_name: '',
    password: '',
    phone: '',
    address: '',
    farm_type: '',
    experience_years: 0,
    is_verified: false
  });
  
  // UI state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFarmerId, setEditingFarmerId] = useState<number | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('farmers');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmType, setSelectedFarmType] = useState<string>('');
  const [verificationFilter, setVerificationFilter] = useState<boolean | null>(null);
  
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  // Load farmers data on component mount
  useEffect(() => {
    loadFarmers();
    loadFarmersCount();
  }, []);

  // Load farmers with current filters
  const loadFarmers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (searchQuery) params.search = searchQuery;
      if (selectedFarmType) params.farm_type = selectedFarmType;
      if (verificationFilter !== null) params.is_verified = verificationFilter;
      
      const data = await AdminFarmerService.getAllFarmers(params);
      setFarmers(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  // Load farmers count and statistics
  const loadFarmersCount = async () => {
    try {
      const data = await AdminFarmerService.getFarmersCount();
      setFarmersCount(data);
    } catch (error: any) {
      console.error('Failed to load farmers count:', error);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadFarmers(), loadFarmersCount()]);
    setRefreshing(false);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounce search - implement if needed
  };

  // Handle farm type filter
  const handleFarmTypeFilter = (farmType: string) => {
    setSelectedFarmType(selectedFarmType === farmType ? '' : farmType);
  };

  // Handle verification filter
  const handleVerificationFilter = (verified: boolean | null) => {
    setVerificationFilter(verificationFilter === verified ? null : verified);
  };

  // Apply filters
  useEffect(() => {
    loadFarmers();
  }, [selectedFarmType, verificationFilter]);

  // Create or update farmer
  const handleSubmitFarmer = async () => {
    try {
      if (!currentFarmer.email || !currentFarmer.full_name || !currentFarmer.password || 
          !currentFarmer.phone || !currentFarmer.address || !currentFarmer.farm_type) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      setLoading(true);
      
      if (isEditing && editingFarmerId) {
        // Update existing farmer
        const updateData: AdminFarmerUpdate = {
          full_name: currentFarmer.full_name,
          phone: currentFarmer.phone,
          address: currentFarmer.address,
          farm_type: currentFarmer.farm_type,
          experience_years: currentFarmer.experience_years,
          is_verified: currentFarmer.is_verified
        };
        
        await AdminFarmerService.updateFarmer(editingFarmerId, updateData);
        Alert.alert('Success', 'Farmer updated successfully');
      } else {
        // Create new farmer
        await AdminFarmerService.createFarmer(currentFarmer);
        Alert.alert('Success', 'Farmer created successfully');
      }
      
      resetForm();
      loadFarmers();
      loadFarmersCount();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save farmer');
    } finally {
      setLoading(false);
    }
  };

  // Edit farmer
  const handleEditFarmer = (farmer: FarmerListItem) => {
    setCurrentFarmer({
      email: farmer.user_email,
      full_name: farmer.user_full_name,
      password: '', // Don't show password when editing
      phone: farmer.phone,
      address: farmer.address,
      farm_type: farmer.farm_type,
      experience_years: farmer.experience_years,
      is_verified: farmer.is_verified
    });
    setEditingFarmerId(farmer.id);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Delete farmer
  const handleDeleteFarmer = async (farmerId: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this farmer? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Farmer Only', 
          style: 'destructive',
          onPress: () => deleteFarmer(farmerId, false)
        },
        { 
          text: 'Delete Farmer & User', 
          style: 'destructive',
          onPress: () => deleteFarmer(farmerId, true)
        }
      ]
    );
  };

  const deleteFarmer = async (farmerId: number, deleteUserAccount: boolean) => {
    try {
      setLoading(true);
      await AdminFarmerService.deleteFarmer(farmerId, deleteUserAccount);
      Alert.alert('Success', 'Farmer deleted successfully');
      loadFarmers();
      loadFarmersCount();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete farmer');
    } finally {
      setLoading(false);
    }
  };

  // Bulk verify/unverify farmers
  const handleBulkVerify = async (farmerIds: number[], isVerified: boolean) => {
    try {
      setLoading(true);
      const result = await AdminFarmerService.bulkVerifyFarmers(farmerIds, isVerified);
      Alert.alert('Success', result.message);
      loadFarmers();
      loadFarmersCount();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update farmers');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentFarmer({
      email: '',
      full_name: '',
      password: '',
      phone: '',
      address: '',
      farm_type: '',
      experience_years: 0,
      is_verified: false
    });
    setEditingFarmerId(null);
    setIsEditing(false);
    setIsFormVisible(false);
    setDocumentImage(null);
  };

  // Pick document image
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
      setDocumentImage(result.assets[0].uri);
    }
  };

  // Get unique farm types for filter
  const getUniqueFarmTypes = () => {
    const types = [...new Set(farmers.map(f => f.farm_type))];
    return types;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      
      {/* Statistics Cards */}
      {farmersCount && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{farmersCount.total_farmers}</Text>
            <Text style={styles.statLabel}>Total Farmers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{farmersCount.verified_farmers}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{farmersCount.unverified_farmers}</Text>
            <Text style={styles.statLabel}>Unverified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{farmersCount.verification_rate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Verification Rate</Text>
          </View>
        </View>
      )}
      
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
        <ScrollView 
          style={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filters */}
          <View style={styles.filtersContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search farmers..."
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={() => loadFarmers()}
            />
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity 
                style={[styles.filterChip, selectedFarmType === '' && styles.activeFilterChip]}
                onPress={() => handleFarmTypeFilter('')}
              >
                <Text style={styles.filterChipText}>All Types</Text>
              </TouchableOpacity>
              {getUniqueFarmTypes().map(type => (
                <TouchableOpacity 
                  key={type}
                  style={[styles.filterChip, selectedFarmType === type && styles.activeFilterChip]}
                  onPress={() => handleFarmTypeFilter(type)}
                >
                  <Text style={styles.filterChipText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.verificationFilters}>
              <TouchableOpacity 
                style={[styles.verificationChip, verificationFilter === null && styles.activeFilterChip]}
                onPress={() => handleVerificationFilter(null)}
              >
                <Text style={styles.filterChipText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.verificationChip, verificationFilter === true && styles.activeFilterChip]}
                onPress={() => handleVerificationFilter(true)}
              >
                <Text style={styles.filterChipText}>Verified</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.verificationChip, verificationFilter === false && styles.activeFilterChip]}
                onPress={() => handleVerificationFilter(false)}
              >
                <Text style={styles.filterChipText}>Unverified</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add New Farmer Button */}
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
          
          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={themeColors.accent} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          
          {/* Farmers List */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              Registered Farmers ({farmers.length})
            </Text>
            
            {farmers.length === 0 && !loading ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="people" size={64} color="#ddd" />
                <Text style={styles.emptyText}>No farmers found</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery || selectedFarmType || verificationFilter !== null 
                    ? 'Try adjusting your filters' 
                    : 'Add your first farmer to get started'}
                </Text>
              </View>
            ) : (
              <View>
                {farmers.map(farmer => (
                  <View key={farmer.id} style={styles.farmerCard}>
                    <View style={styles.farmerInfo}>
                      <View style={styles.farmerHeader}>
                        <Text style={styles.farmerName}>{farmer.user_full_name}</Text>
                        <View style={styles.farmerStatus}>
                          <View style={[
                            styles.statusDot, 
                            { backgroundColor: farmer.is_verified ? themeColors.success : themeColors.warning }
                          ]} />
                          <Text style={styles.statusText}>
                            {farmer.is_verified ? 'Verified' : 'Unverified'}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.farmerEmail}>{farmer.user_email}</Text>
                      <Text style={styles.farmerDetail}>{farmer.farm_type} Farmer</Text>
                      <Text style={styles.farmerDetail}>{farmer.phone}</Text>
                      <Text style={styles.farmerDetail}>{farmer.address}</Text>
                      <Text style={styles.farmerDetail}>
                        Experience: {farmer.experience_years} years | Farms: {farmer.farm_count}
                      </Text>
                    </View>
                    
                    <View style={styles.farmerActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditFarmer(farmer)}
                      >
                        <MaterialIcons name="edit" size={20} color={themeColors.accent} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteFarmer(farmer.id)}
                      >
                        <MaterialIcons name="delete" size={20} color={themeColors.danger} />
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
                  <Text style={styles.reportFarmerName}>{farmer.user_full_name}</Text>
                  <Text style={styles.reportDetail}>{farmer.farm_type} Farmer</Text>
                  <Text style={styles.reportDetail}>Last report: {new Date(farmer.updated_at || farmer.created_at).toLocaleDateString()}</Text>
                  
                  <TouchableOpacity style={styles.viewReportButton}>
                    <Text style={styles.viewReportText}>View Reports</Text>
                    <MaterialCommunityIcons name="file-document" size={20} color={themeColors.accent} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
      
      {/* Batch Management */}
      {activeTab === 'batch' && (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Batch Management</Text>
            
            <View style={styles.filterContainer}>
              <TextInput
                style={styles.filterInput}
                placeholder="Search by batch number..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              
              <TouchableOpacity style={styles.filterButton} onPress={() => loadFarmers()}>
                <MaterialIcons name="search" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.filterButton, { backgroundColor: themeColors.success }]}>
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={64} color="#ddd" />
              <Text style={styles.emptyText}>Batch management coming soon</Text>
              <Text style={styles.emptySubtext}>This feature will be implemented in the next phase</Text>
            </View>
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
              <Text style={styles.label}>Email Address*</Text>
              <TextInput
                style={[styles.input, isEditing && styles.disabledInput]}
                placeholder="Email address"
                value={currentFarmer.email}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, email: text })}
                editable={!isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Text style={styles.label}>Full Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={currentFarmer.full_name}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, full_name: text })}
              />
              
              {!isEditing && (
                <>
                  <Text style={styles.label}>Password*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={currentFarmer.password}
                    onChangeText={text => setCurrentFarmer({ ...currentFarmer, password: text })}
                    secureTextEntry
                  />
                </>
              )}
              
              <Text style={styles.label}>Phone Number*</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={currentFarmer.phone}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, phone: text })}
                keyboardType="phone-pad"
              />
              
              <Text style={styles.label}>Address*</Text>
              <TextInput
                style={styles.input}
                placeholder="Full address"
                value={currentFarmer.address}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, address: text })}
                multiline
                numberOfLines={3}
              />
              
              <Text style={styles.label}>Farm Type*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Poultry, Dairy, Crop"
                value={currentFarmer.farm_type}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, farm_type: text })}
              />
              
              <Text style={styles.label}>Experience (Years)</Text>
              <TextInput
                style={styles.input}
                placeholder="Years of experience"
                value={currentFarmer.experience_years.toString()}
                onChangeText={text => setCurrentFarmer({ ...currentFarmer, experience_years: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
              
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setCurrentFarmer({ ...currentFarmer, is_verified: !currentFarmer.is_verified })}
                >
                  {currentFarmer.is_verified && (
                    <MaterialIcons name="check" size={20} color={themeColors.success} />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Mark as verified</Text>
              </View>
              
              <Text style={styles.label}>Document Upload (Optional)</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <MaterialIcons name="cloud-upload" size={24} color={themeColors.accent} />
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
                onPress={handleSubmitFarmer}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {isEditing ? 'Update Farmer' : 'Add Farmer'}
                  </Text>
                )}
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
  warning: '#ffc107',
  cardBg: '#ffffff',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isSmallScreen ? 15 : 20,
  },
  statCard: {
    backgroundColor: themeColors.cardBg,
    borderRadius: 15,
    padding: isSmallScreen ? 12 : 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: themeColors.accent,
  },
  statLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    color: themeColors.text,
    marginTop: 5,
    textAlign: 'center',
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
  filtersContainer: {
    backgroundColor: themeColors.cardBg,
    borderRadius: 15,
    padding: isSmallScreen ? 15 : 20,
    marginBottom: isSmallScreen ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: themeColors.inputBg,
    borderRadius: 10,
    padding: isSmallScreen ? 12 : 15,
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginBottom: 15,
  },
  filterScroll: {
    marginBottom: 15,
  },
  filterChip: {
    backgroundColor: themeColors.inputBg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: themeColors.accent,
  },
  filterChipText: {
    color: themeColors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  verificationFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  verificationChip: {
    backgroundColor: themeColors.inputBg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    color: themeColors.text,
    fontSize: 16,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: themeColors.text,
    fontSize: isSmallScreen ? 16 : 18,
    marginVertical: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: themeColors.text,
    fontSize: 14,
    opacity: 0.7,
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
  farmerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  farmerName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  farmerEmail: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginBottom: 3,
    opacity: 0.8,
  },
  farmerDetail: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginBottom: 3,
  },
  farmerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: themeColors.text,
    fontWeight: '500',
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
    maxHeight: height * 0.8,
  },
  modalHeader: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 12 : 15,
    color: themeColors.text,
  },
  formScroll: {
    maxHeight: height * 0.6,
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: themeColors.accent,
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: themeColors.text,
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
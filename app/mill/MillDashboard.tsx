import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MillDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  // Mock data - orders from farmers
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      farmer: 'John Farmer',
      date: '2023-06-15',
      items: [
        { type: 'Prestarter', quantity: 50 },
        { type: 'Starter', quantity: 75 },
        { type: 'Finisher', quantity: 100 }
      ],
      status: 'pending'
    },
    {
      id: 'ORD002',
      farmer: 'Sarah Grower',
      date: '2023-06-16',
      items: [
        { type: 'Prestarter', quantity: 30 },
        { type: 'Finisher', quantity: 90 }
      ],
      status: 'pending'
    },
    {
      id: 'ORD003',
      farmer: 'Mike Producer',
      date: '2023-06-17',
      items: [
        { type: 'Starter', quantity: 60 },
        { type: 'Finisher', quantity: 120 }
      ],
      status: 'dispatched'
    }
  ]);

  const handleDispatch = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'dispatched' } : order
    ));
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API fetch
    setTimeout(() => {
      // In a real app, this would update orders from your API
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Feed Mill Dashboard</Text>
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {orders.filter(o => o.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {orders.filter(o => o.status === 'dispatched').length}
          </Text>
          <Text style={styles.statLabel}>Dispatched</Text>
        </View>
      </View>
      
      {/* Orders Section */}
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[themeColors.accent]}
          />
        }
      >
        <Text style={styles.sectionHeader}>Recent Orders</Text>
        
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id}</Text>
              <Text style={[
                styles.statusBadge,
                order.status === 'dispatched' ? styles.dispatchedBadge : styles.pendingBadge
              ]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={16} color={themeColors.text} />
                <Text style={styles.detailText}>{order.farmer}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <MaterialIcons name="date-range" size={16} color={themeColors.text} />
                <Text style={styles.detailText}>{order.date}</Text>
              </View>
            </View>
            
            {/* Order Items */}
            <View style={styles.itemsContainer}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemType}>{item.type}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity} kg</Text>
                </View>
              ))}
            </View>
            
            {/* Action Button */}
            {order.status === 'pending' && (
              <TouchableOpacity 
                style={styles.dispatchButton}
                onPress={() => handleDispatch(order.id)}
              >
                <Text style={styles.buttonText}>Mark as Dispatched</Text>
              </TouchableOpacity>
            )}
            
            {order.status === 'dispatched' && (
              <View style={styles.dispatchedContainer}>
                <MaterialIcons name="check-circle" size={24} color={themeColors.success} />
                <Text style={styles.dispatchedText}>Feed dispatched to farmer</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Theme colors matching your design
const themeColors = {
  bg: '#f8f9fa',
  white: '#ffffff',
  text: '#2c3e50',
  accent: '#3498db',
  inputBg: '#f1f2f6',
  success: '#28a745',
  info: '#17a2b8',
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
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: 'bold',
    color: themeColors.accent,
  },
  statLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: themeColors.text,
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: isSmallScreen ? 12 : 15,
    color: themeColors.text,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: themeColors.warning + '30',
    color: themeColors.warning,
  },
  dispatchedBadge: {
    backgroundColor: themeColors.success + '30',
    color: themeColors.success,
  },
  orderDetails: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.inputBg,
    paddingBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    marginLeft: 8,
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.inputBg,
  },
  itemType: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    fontWeight: 'bold',
  },
  dispatchButton: {
    backgroundColor: themeColors.accent,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dispatchedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: themeColors.success + '20',
    borderRadius: 15,
  },
  dispatchedText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.success,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonText: {
    color: themeColors.white,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 16 : 18,
  },
});

export default MillDashboard;
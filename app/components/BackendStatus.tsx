import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_CONFIG } from '../config/api';
import axios from 'axios';

export default function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [response, setResponse] = useState<string>('');

  const testConnection = async () => {
    setStatus('checking');
    try {
      const healthResponse = await axios.get(`${API_CONFIG.BASE_URL}/health`);
      setResponse(JSON.stringify(healthResponse.data, null, 2));
      setStatus('connected');
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
      setStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'error': return '#F44336';
      case 'checking': return '#FF9800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected to Azure Backend';
      case 'error': return 'Connection Failed';
      case 'checking': return 'Checking Connection...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      
      <TouchableOpacity style={styles.testButton} onPress={testConnection}>
        <Text style={styles.buttonText}>Test Connection</Text>
      </TouchableOpacity>
      
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Response:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
      
      <Text style={styles.urlText}>Backend URL: {API_CONFIG.BASE_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  responseContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  urlText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
}); 
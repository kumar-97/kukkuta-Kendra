import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { getProfile, updateProfile } from '../services/farmerService';

const FarmerProfileScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      });
      Alert.alert('Success', 'Profile updated!');
    } catch (err: any) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', margin: 20 }}>{error}</Text>;
  if (!profile) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Farmer Profile</Text>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={profile.full_name || ''}
        onChangeText={v => handleChange('full_name', v)}
      />
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={profile.phone || ''}
        onChangeText={v => handleChange('phone', v)}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={profile.address || ''}
        onChangeText={v => handleChange('address', v)}
        multiline
      />
      <Button title={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
});

export default FarmerProfileScreen; 
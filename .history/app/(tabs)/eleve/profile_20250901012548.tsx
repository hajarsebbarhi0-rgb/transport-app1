import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../../../config'; // chemin relatif vers ton config

export default function Profile() {
  const [user, setUser] = useState<any>({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${API_URL}/eleve/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de récupérer le profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/eleve/profile`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Succès', response.data.message);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible de mettre à jour');
    }
  };

  if (loading) return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={text => setUser({ ...user, name: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={text => setUser({ ...user, email: text })}
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={user.phone}
        onChangeText={text => setUser({ ...user, phone: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Mettre à jour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginTop: 5 },
  button: { marginTop: 20, backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

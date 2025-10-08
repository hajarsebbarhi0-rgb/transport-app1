import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignalerProbleme() {
  const [probleme, setProbleme] = useState('');
  const [loading, setLoading] = useState(false);

  const envoyerProbleme = async () => {
    if (!probleme.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire le problème.');
      return;
    }

    try {
      // Récupérer token et trajet depuis AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      const trajetIdStr = await AsyncStorage.getItem('trajetId');

      if (!token) {
        return Alert.alert('Erreur', 'Token manquant. Veuillez vous reconnecter.');
      }
      if (!trajetIdStr) {
        return Alert.alert('Erreur', 'Trajet manquant. Veuillez choisir un trajet.');
      }

      const trajetId = parseInt(trajetIdStr, 10);

      setLoading(true);

      // Envoi de l'incident à l'API
      const response = await axios.post(
        'http://10.130.235.1:8000/api/chauffeur/incidents',
        { trajet_id: trajetId, description: probleme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Incident signalé:', response.data);

      Alert.alert('✅ Succès', 'Problème signalé !');
      setProbleme('');
    } catch (error: any) {
      console.log('Erreur API:', error.response?.data || error.message);
      Alert.alert('Erreur', 'Impossible de signaler le problème.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Signaler un problème</Text>

      <TextInput
        placeholder="Décrivez le problème..."
        value={probleme}
        onChangeText={setProbleme}
        style={styles.input}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={envoyerProbleme}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5a7d9a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

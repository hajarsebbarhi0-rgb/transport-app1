import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
    setLoading(true);

    try {
      // Récupérer le token et le trajet depuis AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      const storedTrajetId = await AsyncStorage.getItem('trajetId');
      const trajetId = storedTrajetId ? parseInt(storedTrajetId, 10) : null;

      if (!token || !trajetId) {
        Alert.alert('Erreur', 'Impossible de récupérer le token ou le trajet.');
        setLoading(false);
        return;
      }

      if (!probleme.trim()) {
        Alert.alert('Erreur', 'Veuillez décrire le problème.');
        setLoading(false);
        return;
      }

      // Appel API
      await axios.post(
        'http://10.130.235.1:8000/api/chauffeur/incidents',
        { trajet_id: trajetId, description: probleme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('✅ Succès', 'Problème signalé !');
      setProbleme('');
    } catch (error: any) {
      console.log('Erreur:', error.response?.data || error.message);
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
        style={styles.button}
        onPress={envoyerProbleme}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Envoyer</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push('/(tabs)/chauffeur')}
      >
        <Text style={styles.homeText}>🏠 Retour à l'accueil</Text>
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
  homeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#3E0703',
  },
  homeText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

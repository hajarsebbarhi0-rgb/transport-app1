import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ListeEleves() {
  const [eleves, setEleves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        // 🔐 Récupération du token depuis AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erreur', 'Utilisateur non authentifié.');
          setIsLoading(false);
          return;
        }

        // ⚡ Requête API avec token dans les headers
        const response = await axios.get(
  'http://192.168.152.1:8000/api/chauffeur/eleves',
  {
    headers: {
      Accept: 'application/json',   // ✅ obligatoire
      Authorization: `Bearer ${token}`,
    },
  }
);


        setEleves(response.data);
      } catch (error: any) {
  console.error('Erreur lors de la récupération des élèves:', error.response?.data || error.message);
  Alert.alert(
    'Erreur',
    'Impossible de charger la liste des élèves. Veuillez vérifier votre connexion ou vos identifiants.'
  );
}
 finally {
        setIsLoading(false);
      }
    };

    fetchEleves();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a8e9e" />
        <Text style={styles.loadingText}>Chargement de la liste des élèves...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Liste des élèves</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chauffeur')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={eleves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.eleve}>• {item.prenom} {item.nom}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#5d1e1d' },
  linkText: { color: '#4a8e9e', fontWeight: 'bold', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8e6df' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#7a6c62' },
  eleve: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#d5d8d6', fontSize: 16, color: '#4a8e9e', backgroundColor: '#edece5', borderRadius: 8, marginVertical: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
});

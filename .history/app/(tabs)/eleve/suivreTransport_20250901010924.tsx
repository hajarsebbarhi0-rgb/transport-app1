import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const API_URL = 'http://192.168.200.1:8000/api';

export default function SuivreTransport() {
  const [busLocation, setBusLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  // Remplacer par l'ID réel du trajet de l'élève
  const trajetId = 1; 

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const response = await axios.get(`${API_URL}/bus-location/${trajetId}`);

        if (response.data.latitude && response.data.longitude) {
          setBusLocation({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } else {
          console.warn('Aucune position disponible pour ce trajet');
          setBusLocation(null);
        }
      } catch (error: any) {
        console.error("Erreur récupération bus:", error);

        if (error.response) {
          if (error.response.status === 404) {
            Alert.alert('Erreur', 'Aucune position trouvée pour ce bus.');
          } else if (error.response.status === 500) {
            Alert.alert('Erreur serveur', 'Problème interne du serveur. Vérifie Laravel.');
          } else {
            Alert.alert('Erreur', `Statut: ${error.response.status}`);
          }
        } else {
          Alert.alert('Erreur', 'Impossible de contacter le serveur.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000); // actualisation toutes les 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Lien Accueil */}
      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => router.replace('/(tabs)/eleve')}
      >
        <Text style={styles.linkText}>Accueil</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🚌 Suivi du transport</Text>

      {loading ? (
        <Text>Chargement de la localisation du bus...</Text>
      ) : busLocation ? (
        <MapView style={styles.map} region={busLocation}>
          <Marker
            coordinate={{
              latitude: busLocation.latitude,
              longitude: busLocation.longitude,
            }}
            title="Votre bus"
            description="Position en temps réel"
          />
        </MapView>
      ) : (
        <Text>Aucune position du bus disponible.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#e8e6df' },
  linkContainer: { alignSelf: 'flex-end', marginBottom: 10 },
  linkText: { color: '#4a8e9e', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  map: { width: '100%', height: '80%' },
});

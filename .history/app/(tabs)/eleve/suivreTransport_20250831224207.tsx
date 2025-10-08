import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const API_URL = 'http://192.168.200.1:8000/api';

export default function SuivreTransport() {
  const [busLocation, setBusLocation] = useState<Region | null>(null);

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const busId = 'bus_id_de_l_eleve';
        const response = await axios.get(`${API_URL}/bus-location/${busId}`);
        const { latitude, longitude } = response.data;

        if (latitude && longitude) {
          setBusLocation({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.error("Erreur récupération bus:", error);
      }
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Conteneur pour la barre supérieure */}
      <View style={styles.header}>
        <Text style={styles.title}>🚌 Suivi du transport</Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/eleve')}
        >
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>

      {busLocation ? (
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
        <Text>Chargement de la localisation du bus...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#e8e6df' },
  // Header contenant le titre centré et le lien à droite
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // titre à gauche, lien à droite
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4a8e9e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  map: { width: '100%', height: '80%' },
});

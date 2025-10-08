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
      {/* ===== Lien texte "Accueil" ===== */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/eleve')}>
        <Text style={styles.linkText}>Accueil</Text>
      </TouchableOpacity>
      {/* ================================= */}

      <Text style={styles.title}>🚌 Suivi du transport</Text>

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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  linkText: {
    color: '#4a8e9e',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start', // place le lien à gauche
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  map: { width: '100%', height: '80%' },
});

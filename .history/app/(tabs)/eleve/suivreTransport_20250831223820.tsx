import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

// Import du router pour naviguer vers l'accueil
import { router } from 'expo-router';

// Adresse de votre API (à ajuster si nécessaire)
const API_URL = 'http://192.168.200.1:8000/api';

export default function SuivreTransport() {
  // L'état 'busLocation' stocke la position du bus
  const [busLocation, setBusLocation] = useState<Region | null>(null);

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const busId = 'bus_id_de_l_eleve'; // Remplacer par l'ID réel
        const response = await axios.get(`${API_URL}/bus-location/${busId}`);
        const { latitude, longitude } = response.data;

        if (latitude && longitude) {
          setBusLocation({
            latitude,
            longitude,
            latitudeDelta: 0.01,  // Zoom plus proche
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la localisation du bus:", error);
      }
    };

    // Appel initial + toutes les 5 secondes
    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000);

    // Nettoyage à la fin
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Titre de la page */}
      <Text style={styles.title}>🚌 Suivi du transport</Text>

      {/* ===== AJOUT DU BOUTON DE RETOUR À L'ACCUEIL ===== */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)/eleve')} // Redirection vers la page index du dossier élève
      >
        <Text style={styles.backButtonText}>⬅ Retour à l'accueil</Text>
      </TouchableOpacity>
      {/* ================================================ */}

      {busLocation ? (
        <MapView
          style={styles.map}
          region={busLocation} // Utilisation de region pour se recentrer à chaque mise à jour
        >
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '80%',
  },
  // ===== Styles du bouton ajouté =====
  backButton: {
    backgroundColor: '#4a8e9e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '90%', // pour que le bouton ne prenne pas toute la largeur
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // ===================================
});

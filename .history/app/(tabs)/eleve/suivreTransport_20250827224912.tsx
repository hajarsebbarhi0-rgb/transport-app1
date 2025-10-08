import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Adresse de votre API (à ajuster si nécessaire)
const API_URL = 'http://192.168.103.1:8000/api';

export default function SuivreTransport() {
  // L'état 'busLocation' stocke la position du bus (latitude et longitude)
  const [busLocation, setBusLocation] = useState(null);

  // Utilisez useEffect pour appeler l'API toutes les 5 secondes
  useEffect(() => {
    // Fonction pour récupérer la localisation du bus
    const fetchBusLocation = async () => {
      try {
        // Remplacez 'busId' par l'ID réel du bus que l'élève suit
        const busId = 'bus_id_de_l_eleve'; 
        const response = await axios.get(`${API_URL}/bus-location/${busId}`);
        
        // Mettez à jour la localisation du bus
        setBusLocation({
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération de la localisation du bus:", error);
      }
    };

    // Appelez la fonction immédiatement puis toutes les 5 secondes
    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000); // 5000 ms = 5 secondes

    // Nettoyage de l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une seule fois

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Suivi du transport</Text>
      
      {busLocation ? (
        <MapView
          style={styles.map}
          // La région de la carte est centrée sur la localisation du bus
          initialRegion={busLocation}
        >
          {/* Affichez le marqueur pour le bus */}
          <Marker
            coordinate={{
              latitude: busLocation.latitude,
              longitude: busLocation.longitude
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  map: {
    // La carte prend toute la place disponible
    width: '100%',
    height: '80%',
  },
});

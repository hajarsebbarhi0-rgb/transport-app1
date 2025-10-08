import axios from 'axios';
import * as Location from 'expo-location'; // Import the geolocation library
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

// API address (adjust if necessary)
const API_URL = 'http://192.168.103.1:8000/api';

export default function LancerTrajet() {
  const [enCours, setEnCours] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Use useRef to store the geolocation subscription
  const locationSubscription = useRef(null);

  // Request geolocation permission on startup
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission d\'accès à la localisation refusée');
        Alert.alert('Erreur', 'Permission d\'accès à la localisation refusée.');
        return;
      }
    })();

    // Cleanup function to ensure the interval is stopped if the component is unmounted
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Function to send the location to the server API
  const sendLocationToServer = async (location) => {
    try {
      // Replace 'busId' with the real ID of the bus or the driver user
      const busId = 'bus_id_du_chauffeur'; 
      await axios.post(`${API_URL}/update-bus-location/${busId}`, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Position sent successfully to the server!");
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  const handleStart = async () => {
    setEnCours(true);
    Alert.alert("Trajet lancé 🚍", "Le trajet a bien démarré !");
    
    // Start tracking the position
    const subscription = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // Send data every 5 seconds
      distanceInterval: 1 // Update every 1 meter
    }, (location) => {
      // Call the function to send the location to the server
      sendLocationToServer(location);
    });

    // Store the subscription in the reference
    locationSubscription.current = subscription;
  };

  const handleStop = async () => {
    setEnCours(false);
    Alert.alert("Trajet terminé ✅", "Le trajet a été terminé avec succès !");

    // Stop the geolocation subscription if it exists
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚦 Lancer le trajet</Text>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}
      {!enCours ? (
        <Button title="▶️ Démarrer" onPress={handleStart} />
      ) : (
        <Button title="⏹️ Terminer" onPress={handleStop} color="red" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  errorText: { color: 'red', marginTop: 10 }
});

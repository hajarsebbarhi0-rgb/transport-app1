import axios from 'axios';
import * as Location from 'expo-location'; // Importez la bibliothèque de géolocalisation
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

// Adresse de votre API (à ajuster si nécessaire)
const API_URL = 'http://192.168.103.1:8000/api';

export default function LancerTrajet() {
  const [enCours, setEnCours] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Utilisez useRef pour stocker la souscription à la géolocalisation
  const locationSubscription = useRef(null);

  // Demande la permission de géolocalisation au démarrage
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission d\'accès à la localisation refusée');
        Alert.alert('Erreur', 'Permission d\'accès à la localisation refusée.');
        return;
      }
    })();

    // Fonction de nettoyage pour s'assurer que l'intervalle est arrêté si le composant est démonté
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Fonction pour envoyer la position à l'API du serveur
  const sendLocationToServer = async (location) => {
    try {
      // Remplacez 'busId' par l'ID réel du bus ou de l'utilisateur chauffeur
      const busId = 'bus_id_du_chauffeur'; 
      await axios.post(`${API_URL}/update-bus-location/${busId}`, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Position envoyée avec succès au serveur !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la position:", error);
    }
  };

  const handleStart = async () => {
    setEnCours(true);
    Alert.alert("Trajet lancé 🚍", "Le trajet a bien démarré !");
    
    // Lance le suivi de la position
    const subscription = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // Envoie les données toutes les 5 secondes
      distanceInterval: 1 // Met à jour toutes les 1 mètre
    }, (location) => {
      // Appelle la fonction pour envoyer la position au serveur
      sendLocationToServer(location);
    });

    // Stockez la souscription dans la référence
    locationSubscription.current = subscription;
  };

  const handleStop = async () => {
    setEnCours(false);
    Alert.alert("Trajet terminé ✅", "Le trajet a été terminé avec succès !");

    // Arrêtez la souscription à la géolocalisation si elle existe
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

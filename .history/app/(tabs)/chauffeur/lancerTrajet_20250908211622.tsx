import axios from 'axios';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = 'http://192.168.152.1:8000/api';

export default function LancerTrajet() {
  const [enCours, setEnCours] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const msg = "Permission d'accès à la localisation refusée";
        setErrorMsg(msg);
        Alert.alert("Erreur", msg);
      }
    })();

    return () => {
      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, []);

  const sendLocationToServer = async (location: Location.LocationObject) => {
    try {
      const trajetId = 1; // ⚠️ Remplacer par l'ID réel du trajet actif
      await axios.post(`${API_URL}/send-location`, {
        trajet_id: trajetId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Position envoyée avec succès !");
    } catch (error) {
      console.error("Erreur envoi position :", error);
    }
  };

  const handleStart = async () => {
    setEnCours(true);
    Alert.alert("Trajet lancé 🚍", "Le trajet a bien démarré !");
    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 1 },
      (location: Location.LocationObject) => sendLocationToServer(location)
    );
    locationSubscription.current = subscription;
  };

  const handleStop = async () => {
    setEnCours(false);
    Alert.alert("Trajet terminé ✅", "Le trajet a été terminé avec succès !");
    locationSubscription.current?.remove();
    locationSubscription.current = null;
  };

  return (
    <View style={styles.container}>
      {/* ===== Header avec titre et lien Accueil ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>🚦 Lancer le trajet</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chauffeur')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>
      {/* ============================================= */}

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      {!enCours ? (
        <Button title="▶️ Démarrer" onPress={handleStart} />
      ) : (
        <Button title="⏹️ Terminer" onPress={handleStop} color="red" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  linkText: { color: '#4a8e9e', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', marginTop: 10 }
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.2.16:8000/api';

export default function LancerTrajet() {
  const [enCours, setEnCours] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [trajetId, setTrajetId] = useState<number | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const msg = "Permission d'accès à la localisation refusée";
        setErrorMsg(msg);
        Alert.alert("Erreur", msg);
        return;
      }

      // 🔹 Récupérer le token et le trajet du chauffeur
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/trajets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length === 0) {
          Alert.alert("Erreur", "Aucun trajet assigné.");
          return;
        }
        // On prend le premier trajet assigné
        setTrajetId(response.data[0].id);
      } catch (err: any) {
        console.error("Erreur récupération trajet :", err.response?.data || err.message);
        Alert.alert("Erreur", "Impossible de récupérer le trajet du chauffeur.");
      }
    })();

    return () => {
      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, []);

  const sendLocationToServer = async (location: Location.LocationObject) => {
    if (!trajetId) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${API_URL}/send-location`, {
        trajet_id: trajetId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      console.error("Erreur envoi position :", error.response?.data || error.message);
    }
  };

  const handleStart = async () => {
    if (!trajetId) {
      Alert.alert("Erreur", "Trajet non défini.");
      return;
    }
    setEnCours(true);
    Alert.alert("Trajet lancé 🚍", "Le trajet a bien démarré !");
    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 1 },
      sendLocationToServer
    );
    locationSubscription.current = subscription;
  };

  const handleStop = () => {
    setEnCours(false);
    Alert.alert("Trajet terminé ✅", "Le trajet a été terminé avec succès !");
    locationSubscription.current?.remove();
    locationSubscription.current = null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚦 Lancer le trajet</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chauffeur')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>

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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  linkText: { color: '#4a8e9e', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', marginTop: 10 }
});

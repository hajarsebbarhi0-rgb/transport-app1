// SuivreTransport.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from "react-native-maps";



const API_URL = 'http://192.168.2.5:8000/api';

// Haversine -> distance en mètres
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function SuivreTransport() {
  const [busLocation, setBusLocation] = useState<Region | null>(null);
  const [trajetId, setTrajetId] = useState<number | null>(null);
  const [eleveArret, setEleveArret] = useState<{ latitude: number; longitude: number } | null>(null);
  const [alerteJouee, setAlerteJouee] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<number | null>(null);

  // charger profil élève (doit renvoyer user.trajet_id et user.arret {latitude, longitude})
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('Token introuvable');

        const res = await axios.get(`${API_URL}/eleve/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userTrajetId = res.data.trajet_id ?? res.data.trajet?.id;
        const arret = res.data.arret ?? res.data.trajet?.arret ?? res.data.arret_selected;

        if (!userTrajetId || !arret || arret.latitude == null || arret.longitude == null) {
          Alert.alert('Erreur', 'Impossible de récupérer le trajet ou l’arrêt. Vérifie le profil.');
          return;
        }

        setTrajetId(userTrajetId);
        setEleveArret({ latitude: Number(arret.latitude), longitude: Number(arret.longitude) });
      } catch (err: any) {
        console.error('Erreur récupération profil :', err.response?.data || err.message);
        Alert.alert('Erreur', 'Impossible de récupérer le profil.');
      }
    })();

    // cleanup
    return () => { unloadSound(); if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // charger et jouer le son d'alerte
  const loadAndPlayAlert = async () => {
    try {
      // charge le son si pas déjà chargé
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
  require('../../../assets/alert.mp3')
);
        soundRef.current = sound;
      }
      await soundRef.current.replayAsync();
    } catch (e) {
      console.error('Erreur son alerte', e);
    }
  };

  const unloadSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      /* silent */
    }
  };

  // fetch périodique de la position du bus
  useEffect(() => {
    if (!trajetId || !eleveArret) return;

    const fetchBusLocation = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/bus-location/${trajetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { latitude, longitude } = response.data;
        if (latitude == null || longitude == null) return;

        setBusLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // calcul distance
        const distance = getDistanceFromLatLonInMeters(
          Number(latitude),
          Number(longitude),
          eleveArret.latitude,
          eleveArret.longitude
        );

        console.log('Distance bus->arret (m):', Math.round(distance));

        // logique d'alerte
        if (distance <= 10 && !alerteJouee) {
          // jouer son + popup
          Alert.alert('🛎️ Attention', 'Le bus est proche de votre arrêt.');
          loadAndPlayAlert();
          setAlerteJouee(true);
        } else if (distance > 20 && alerteJouee) {
          // si le bus s'éloigne au-delà de 20m, on réarme pour future alerte
          setAlerteJouee(false);
        }
      } catch (error: any) {
        console.error('Erreur récupération bus:', error.response?.data || error.message);
      }
    };

    // run tout de suite puis toutes les 5s
    fetchBusLocation();
    intervalRef.current = setInterval(fetchBusLocation, 5000) as unknown as number;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trajetId, eleveArret, alerteJouee]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.linkContainer} onPress={() => router.replace('/(tabs)/eleve')}>
        <Text style={styles.linkText}>Accueil</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🚌 Suivi du transport</Text>

      {busLocation ? (
        <MapView style={styles.map} region={busLocation}>
          <Marker coordinate={{ latitude: busLocation.latitude, longitude: busLocation.longitude }} title="Votre bus" />
          {eleveArret && (
            <Marker coordinate={{ latitude: eleveArret.latitude, longitude: eleveArret.longitude }} title="Votre arrêt" pinColor="green" />
          )}
        </MapView>
      ) : (
        <Text>Chargement de la localisation du bus...</Text>
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

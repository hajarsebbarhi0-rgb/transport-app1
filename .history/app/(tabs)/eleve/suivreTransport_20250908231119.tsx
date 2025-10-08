import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const API_URL = 'http://192.168.152.1:8000/api';

export default function SuivreTransport() {
  const [busLocation, setBusLocation] = useState<Region | null>(null);
  const [trajetId, setTrajetId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await axios.get(`${API_URL}/eleve/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userTrajetId = res.data.trajet_id;
        if (!userTrajetId) {
          Alert.alert("Erreur", "Aucun trajet choisi.");
          return;
        }
        setTrajetId(userTrajetId);
      } catch (err) {
        console.error("Erreur récupération profil :", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!trajetId) return;
    const fetchBusLocation = async () => {
      try {
        const response = await axios.get(`${API_URL}/bus-location/${trajetId}`);
        const { latitude, longitude } = response.data;
        if (latitude && longitude) {
          setBusLocation({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        }
      } catch (error) {
        console.error("Erreur récupération bus:", error);
      }
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000);

    return () => clearInterval(interval);
  }, [trajetId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.linkContainer} onPress={() => router.replace('/(tabs)/eleve')}>
        <Text style={styles.linkText}>Accueil</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🚌 Suivi du transport</Text>

      {busLocation ? (
        <MapView style={styles.map} region={busLocation}>
          <Marker coordinate={{ latitude: busLocation.latitude, longitude: busLocation.longitude }} title="Votre bus" description="Position en temps réel" />
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

export default function ChoisirTrajet() {
  const [trajets, setTrajets] = useState<any[]>([]);
  const [arrets, setArrets] = useState<any[]>([]);
  const [selectedTrajet, setSelectedTrajet] = useState<number | null>(null);
  const [selectedArret, setSelectedArret] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert("Erreur", "Utilisateur non authentifié.");
          return;
        }

        const res = await axios.get(
          'http://192.168.2.7:8000/api/trajets',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTrajets(res.data);
      } catch (error: any) {
        console.error("Erreur fetch trajets:", error);
        Alert.alert("Erreur", "Impossible de charger les trajets.");
      }
    };

    fetchTrajets();
  }, []);

  const handleTrajetSelect = async (trajetId: number) => {
    setSelectedTrajet(trajetId);
    setSelectedArret(null); // reset l'arrêt sélectionné
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Erreur", "Utilisateur non authentifié.");
        return;
      }

      const res = await axios.get(
        `http://192.168.2.7:8000/api/trajets/${trajetId}/arrets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setArrets(res.data);
    } catch (error: any) {
      console.error("Erreur fetch arrêts:", error);
      Alert.alert("Erreur", "Impossible de charger les arrêts.");
    }
  };

  const handleSaveChoice = async () => {
    if (!selectedTrajet || !selectedArret) {
      Alert.alert("Attention", "Veuillez choisir un trajet et un arrêt.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      await axios.put(
        'http://192.168.2.7:8000/api/eleves/choisir-trajet-arret',
        {
          trajet_id: selectedTrajet,
          arret_id: selectedArret,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Succès", "Votre choix a été enregistré !");
      router.replace("/(tabs)/eleve");
    } catch (error: any) {
      console.error("Erreur save choix:", error);
      Alert.alert("Erreur", JSON.stringify(error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚌 Choisir mon trajet</Text>

      <Text style={styles.subtitle}>Sélectionner un trajet :</Text>
      {trajets.map((trajet) => (
        <TouchableOpacity
          key={trajet.id}
          style={[
            styles.option,
            selectedTrajet === trajet.id && styles.selectedOption,
          ]}
          onPress={() => handleTrajetSelect(trajet.id)}
        >
          <Text style={styles.optionText}>{trajet.nom}</Text>
        </TouchableOpacity>
      ))}

      {selectedTrajet && (
        <>
          <Text style={styles.subtitle}>📍 Choisir un arrêt :</Text>
          {arrets.map((arret) => (
            <TouchableOpacity
              key={arret.id}
              style={[
                styles.option,
                selectedArret === arret.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedArret(arret.id)}
            >
              <Text style={styles.optionText}>{arret.nom}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChoice}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>✅ Enregistrer mon choix</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/(tabs)/eleve")}
      >
        <Text style={styles.homeText}>🏠 Retour à l'accueil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#e8e6df" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#5d1e1d" },
  subtitle: { fontSize: 18, marginVertical: 10, fontWeight: "600" },
  option: { padding: 15, backgroundColor: "#c8d0d2", borderRadius: 10, marginBottom: 10 },
  selectedOption: { backgroundColor: "#89A8B2" },
  optionText: { fontSize: 16, color: "#3E0703" },
  saveButton: { marginTop: 20, backgroundColor: "#b13623", padding: 15, borderRadius: 10, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  homeButton: { marginTop: 15, padding: 12, borderRadius: 10, alignItems: "center", backgroundColor: "#3E0703" },
  homeText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

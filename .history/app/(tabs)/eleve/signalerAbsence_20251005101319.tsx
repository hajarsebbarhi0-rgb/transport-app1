import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignalerAbsence() {
  const [motif, setMotif] = useState("");
  const [loading, setLoading] = useState(false);

  const envoyerAbsence = async () => {
    if (!motif.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un motif.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Erreur", "Utilisateur non authentifié");
        return;
      }

      // 🔥 Envoi au backend Laravel
      await axios.post(
        "http://192.168.2.16:8000/api/eleve/absence",
        { raison: motif },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Succès", "Absence signalée ✅");
      setMotif("");
      router.replace("/(tabs)/eleve"); // retour accueil élève
    } catch (error: any) {
  console.log("Erreur absence:", error.response?.status, error.response?.data || error.message);
  Alert.alert(
    "Erreur",
    error.response?.data?.message || "Impossible de signaler l’absence"
  );
}

  };

  return (
    <View style={styles.container}>
      {/* ===== Barre supérieure avec lien Accueil ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>📌 Signaler une absence</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/eleve')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>
      {/* ============================================= */}

      <TextInput
        placeholder="Motif de l’absence"
        style={styles.input}
        value={motif}
        onChangeText={setMotif}
      />

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.6 }]} 
        onPress={envoyerAbsence}
        disabled={loading}
      >
        <Text style={styles.text}>
          {loading ? "Envoi..." : "Envoyer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  linkText: {
    color: '#4a8e9e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 20, 
    backgroundColor: '#fff'
  },
  button: { 
    backgroundColor: "#5a7d9a",
    padding: 15, 
    borderRadius: 10, 
    alignItems: "center" 
  },
  text: { color: "#fff", fontWeight: "bold" },
});

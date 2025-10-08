import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignalerProbleme() {
  const [probleme, setProbleme] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [trajetId, setTrajetId] = useState<number | null>(null);

  // ⚡ Récupérer token et trajet au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedTrajetId = await AsyncStorage.getItem("trajetId");

        if (!storedToken) return Alert.alert("Erreur", "Token introuvable, veuillez vous reconnecter.");
        if (!storedTrajetId) return Alert.alert("Erreur", "Trajet introuvable, veuillez choisir un trajet.");

        setToken(storedToken);
        setTrajetId(parseInt(storedTrajetId, 10)); // ⚠️ convertir en integer
      } catch (e) {
        console.error("Erreur récupération token/trajet:", e);
        Alert.alert("Erreur", "Impossible de récupérer le token ou le trajet.");
      }
    };

    loadData();
  }, []);

  const envoyerProbleme = async () => {
    if (!probleme.trim()) {
      return Alert.alert("Erreur", "Veuillez décrire le problème.");
    }
    if (!token || !trajetId) {
      return Alert.alert("Erreur", "Token ou trajet manquant.");
    }

    try {
      const response = await axios.post(
        "http://10.130.235.1:8000/api/chauffeur/incidents",
        { trajet_id: trajetId, description: probleme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("✅ Succès", "Problème signalé !");
      setProbleme("");
    } catch (error: any) {
      console.log("Erreur:", error.response?.data || error.message);
      Alert.alert("Erreur", "Impossible de signaler le problème.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Signaler un problème</Text>

      <TextInput
        placeholder="Décrivez le problème..."
        value={probleme}
        onChangeText={setProbleme}
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={envoyerProbleme}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e8e6df" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#5a7d9a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

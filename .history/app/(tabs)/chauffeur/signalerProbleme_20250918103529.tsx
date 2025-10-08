import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignalerProbleme() {
  const [probleme, setProbleme] = useState("");

  const envoyerProbleme = async () => {
    if (!probleme.trim()) {
      Alert.alert("Erreur", "Veuillez décrire le problème.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const trajetId = await AsyncStorage.getItem("trajetId"); // ⚠️ tu dois stocker le trajet du chauffeur au login

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
      <View style={styles.topLinkContainer}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/chauffeur")}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>

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
  topLinkContainer: { width: "100%", alignItems: "flex-end", marginBottom: 20 },
  linkText: { color: "#4a8e9e", fontWeight: "bold", fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1, padding: 10, borderRadius: 8,
    marginBottom: 20, minHeight: 100, textAlignVertical: "top", backgroundColor: "#fff",
  },
  button: { backgroundColor: "#5a7d9a", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

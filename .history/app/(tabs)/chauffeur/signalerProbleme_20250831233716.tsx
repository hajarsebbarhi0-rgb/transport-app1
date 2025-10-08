import { router } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignalerProbleme() {
  const [probleme, setProbleme] = useState("");

  const envoyerProbleme = () => {
    Alert.alert("Problème signalé ⚠️", probleme || "Aucun détail fourni");
    setProbleme("");
  };

  return (
    <View style={styles.container}>
      {/* ===== Lien Accueil tout en haut ===== */}
      <View style={styles.topLinkContainer}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chauffeur')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>
      {/* =================================== */}

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
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  topLinkContainer: {
    width: '100%',
    alignItems: 'flex-end', // lien à droite
    marginBottom: 15,
  },
  linkText: { color: '#4a8e9e', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: "#5a7d9a", // bleu-gris
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

import { router } from 'expo-router'; // 👈 ajout pour navigation
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignalerAbsence() {
  const [motif, setMotif] = useState("");

  const envoyerAbsence = () => {
    Alert.alert("Absence signalée", `Motif : ${motif}`);
    setMotif("");
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
      <TouchableOpacity style={styles.button} onPress={envoyerAbsence}>
        <Text style={styles.text}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  // Header contenant le titre et le lien Accueil
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  linkText: {
    color: '#4a8e9e', // couleur du lien Accueil
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
    backgroundColor: "#5a7d9a", // bleu-gris
    padding: 15, 
    borderRadius: 10, 
    alignItems: "center" 
  },
  text: { color: "#fff", fontWeight: "bold" },
});

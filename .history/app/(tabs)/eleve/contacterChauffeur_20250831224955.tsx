import { router } from 'expo-router'; // 👈 ajout pour navigation
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ContacterChauffeur() {
  const [message, setMessage] = useState("");

  const envoyerMessage = () => {
    Alert.alert("Message envoyé", message);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      {/* ===== Header avec titre et lien Accueil ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>☎️ Contacter le chauffeur</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/eleve')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>
      {/* ============================================= */}

      <TextInput
        placeholder="Votre message..."
        style={styles.input}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={envoyerMessage}>
        <Text style={styles.text}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  // Header pour aligner titre et lien
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // titre à gauche, lien à droite
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

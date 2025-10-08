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
      <Text style={styles.title}>☎️ Contacter le chauffeur</Text>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: "#3498db", padding: 15, borderRadius: 10, alignItems: "center" },
  text: { color: "#fff", fontWeight: "bold" },
});

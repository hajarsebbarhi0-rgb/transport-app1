import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Inscription() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  const inscrire = () => {
    Alert.alert("Inscription envoyée", `${nom} (${email})`);
    setNom("");
    setEmail("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Inscription</Text>
      <TextInput placeholder="Nom" style={styles.input} value={nom} onChangeText={setNom} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TouchableOpacity style={styles.button} onPress={inscrire}>
        <Text style={styles.text}>S’inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: "#9b59b6", padding: 15, borderRadius: 10, alignItems: "center" },
  text: { color: "#fff", fontWeight: "bold" },
});

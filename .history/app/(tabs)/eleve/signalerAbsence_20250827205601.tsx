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
      <Text style={styles.title}>📌 Signaler une absence</Text>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: "#2ecc71", padding: 15, borderRadius: 10, alignItems: "center" },
  text: { color: "#fff", fontWeight: "bold" },
});

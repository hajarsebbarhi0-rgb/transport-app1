import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignalerProbleme() {
  const [probleme, setProbleme] = useState("");

  const envoyerProbleme = () => {
    Alert.alert("Problème signalé", probleme || "Aucun détail fourni");
    setProbleme("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signaler un problème</Text>
      <TextInput
        placeholder="Décrivez le problème..."
        value={probleme}
        onChangeText={setProbleme}
        style={styles.input}
        multiline
      />
      <Button title="Envoyer" onPress={envoyerProbleme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 15, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 20, minHeight: 100 },
});

import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function LancerTrajet() {
  const [enCours, setEnCours] = useState(false);

  const handleStart = () => {
    setEnCours(true);
    Alert.alert("Trajet lancé 🚍", "Le trajet a bien démarré !");
  };

  const handleStop = () => {
    setEnCours(false);
    Alert.alert("Trajet terminé ✅", "Le trajet a été terminé avec succès !");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚦 Lancer le trajet</Text>
      {!enCours ? (
        <Button title="▶️ Démarrer" onPress={handleStart} />
      ) : (
        <Button title="⏹️ Terminer" onPress={handleStop} color="red" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});

import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LancerTrajet() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚍 Lancer le trajet</Text>
      <Text style={styles.text}>Ici, le chauffeur peut démarrer le trajet.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>⬅️ Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ecf0f1" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: "#3498db", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" }
});

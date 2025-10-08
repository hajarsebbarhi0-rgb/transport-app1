import { StyleSheet, Text, View } from "react-native";

export default function SuivreTransport() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Suivi du transport</Text>
      <Text>📍 Localisation du bus en temps réel (à connecter avec Google Maps)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});

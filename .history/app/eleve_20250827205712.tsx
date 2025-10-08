import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EleveDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🎓 Tableau de bord Élève</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/eleve/suivreTransport")}>
        <Text style={styles.text}>🚌 Suivre le transport</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/eleve/signalerAbsence")}>
        <Text style={styles.text}>📌 Signaler une absence</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/eleve/notifications")}>
        <Text style={styles.text}>🔔 Voir les notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/eleve/contacterChauffeur")}>
        <Text style={styles.text}>☎️ Contacter le chauffeur</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/eleve/inscription")}>
        <Text style={styles.text}>📝 Inscription</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  button: { backgroundColor: "#3498db", padding: 15, marginVertical: 10, borderRadius: 10, width: "90%", alignItems: "center" },
  text: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

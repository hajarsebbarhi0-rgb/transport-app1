import { router } from 'expo-router'; // 👈 ajout pour navigation
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const notifications = [
  { id: "1", message: "Le bus est en retard de 10 minutes" },
  { id: "2", message: "Trajet annulé demain" },
];

export default function Notifications() {
  return (
    <View style={styles.container}>
      {/* ===== Header avec titre et lien Accueil ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/eleve')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>
      {/* ============================================= */}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.notif}>• {item.message}</Text>}
      />
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
  notif: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

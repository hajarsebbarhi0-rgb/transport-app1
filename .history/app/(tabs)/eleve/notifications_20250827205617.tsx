import { FlatList, StyleSheet, Text, View } from "react-native";

const notifications = [
  { id: "1", message: "Le bus est en retard de 10 minutes" },
  { id: "2", message: "Trajet annulé demain" },
];

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.notif}>• {item.message}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  notif: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const eleves = [
  { id: "1", nom: "Ali" },
  { id: "2", nom: "Sara" },
  { id: "3", nom: "Youssef" },
];

export default function ListeEleves() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Liste des élèves</Text>
      <FlatList
        data={eleves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.eleve}>• {item.nom}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  eleve: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

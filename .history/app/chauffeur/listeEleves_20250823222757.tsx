import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

const eleves = [
  { id: "1", nom: "Ali" },
  { id: "2", nom: "Sara" },
  { id: "3", nom: "Youssef" },
];

export default function PresenceEleves() {
  const [presence, setPresence] = useState({});

  const togglePresence = (id) => {
    setPresence((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valider la présence</Text>
      <FlatList
        data={eleves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.nom}</Text>
            <Button
              title={presence[item.id] ? "Présent ✅" : "Absent ❌"}
              onPress={() => togglePresence(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 15, fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
});

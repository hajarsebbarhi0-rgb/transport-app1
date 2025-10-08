import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function ListeEleves() {
  const [eleves, setEleves] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://192.168.103.1:8000/api/eleves") 
      .then((res) => res.json())
      .then((data) => setEleves(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Liste des élèves</Text>
      <FlatList
        data={eleves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.eleve}>• {item.nom}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  eleve: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

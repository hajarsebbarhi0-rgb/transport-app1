import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";

type Eleve = {
  id: number;
  nom: string;
  prenom?: string;
  email?: string;
};

export default function ValidationPresence() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [presence, setPresence] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remplace l'URL par l'adresse correcte de ton API
    fetch("http://192.168.200.1:8081/api/eleves") 
      .then((res) => res.json())
      .then((data) => {
        setEleves(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch:", err);
        setLoading(false);
      });
  }, []);

  const togglePresence = (id: number) => {
    setPresence((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des élèves...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Validation de la présence</Text>
      <FlatList
        data={eleves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.nom} {item.prenom}</Text>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

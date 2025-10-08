import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    fetch("http://192.168.171.1:8000/api/eleves")
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
      {/* ===== Header avec titre et lien Accueil ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>✅ Validation de la présence</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chauffeur')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>
      {/* ============================================= */}

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
  container: { flex: 1, padding: 20, backgroundColor: '#e8e6df' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // titre à gauche, lien à droite
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  linkText: { color: '#4a8e9e', fontWeight: 'bold', fontSize: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Erreur récupération user :", error);
      }
    };

    loadUserData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil de l'élève</Text>
      <Text style={styles.label}>Nom : <Text style={styles.value}>{user.nom}</Text></Text>
      <Text style={styles.label}>Prénom : <Text style={styles.value}>{user.prenom}</Text></Text>
      <Text style={styles.label}>Email : <Text style={styles.value}>{user.email}</Text></Text>
      <Text style={styles.label}>Téléphone : <Text style={styles.value}>{user.telephone}</Text></Text>
      <Text style={styles.label}>Rôle : <Text style={styles.value}>{user.role}</Text></Text>
      <Text style={styles.label}>Statut : <Text style={styles.value}>{user.status}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
});

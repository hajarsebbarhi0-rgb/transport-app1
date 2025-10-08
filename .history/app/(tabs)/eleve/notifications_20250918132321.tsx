import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get("http://10.130.235.1:8000/api/eleve/incidents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ Correction : accéder à response.data.incidents
        setNotifications(response.data.incidents);
      } catch (error: any) {
        console.log("Erreur notifications:", error.response?.data || error.message);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/eleve")}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.notif}>• {item.description}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e8e6df" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  linkText: { color: "#4a8e9e", fontWeight: "bold", fontSize: 16 },
  notif: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

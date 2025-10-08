import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedName = await AsyncStorage.getItem("userName");
        setEmail(storedEmail);
        setName(storedName);
      } catch (error) {
        console.error("Erreur lors du chargement des infos utilisateur", error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/"); // Retourne à l’accueil (index)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil de l’élève</Text>
      <Text style={styles.info}>Nom : {name ?? "Non défini"}</Text>
      <Text style={styles.info}>Email : {email ?? "Non défini"}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Se déconnecter" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },
});

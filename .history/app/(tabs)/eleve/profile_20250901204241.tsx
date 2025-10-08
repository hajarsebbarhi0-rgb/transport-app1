import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from "react-native";

// Définition du type Eleve
interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  date_de_naissance: string;
  genre: string;
  ecole: string;
  niveau: string;
  photo?: string;
}

export default function Profile() {
  const [eleve, setEleve] = useState<Eleve | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      // 1. Débogage : Vérifier si le jeton est présent
      console.log("Tentative de récupération du jeton...");
      const token = await AsyncStorage.getItem("userToken");
      console.log("Jeton récupéré:", token ? "Jeton trouvé" : "Jeton manquant");

      if (!token) {
        Alert.alert("Erreur", "Jeton d'authentification manquant. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // 2. Débogage : Envoi de la requête à l'API
      console.log("Envoi de la requête au serveur...");
      const response = await axios.get("http://192.168.200.1:8000/api/eleve/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Débogage : Vérifier la réponse du serveur
      console.log("Réponse du serveur reçue:", response.data);

      setEleve(response.data);
    } catch (error: any) {
      // 4. Débogage : Afficher les détails de l'erreur
      console.error(
        "Erreur de récupération du profil:",
        error.response ? JSON.stringify(error.response.data, null, 2) : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  if (!eleve) {
    return (
      <View style={styles.center}>
        <Text>Profil introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {eleve.photo && (
        <Image
          source={{ uri: `http://192.168.200.1:8000/${eleve.photo}` }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{eleve.nom} {eleve.prenom}</Text>
      <Text>🎂 Date de naissance : {eleve.date_de_naissance}</Text>
      <Text>👩 Genre : {eleve.genre}</Text>
      <Text>🏫 École : {eleve.ecole}</Text>
      <Text>📘 Niveau : {eleve.niveau}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erreur", "Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://192.168.200.1:8000/api/eleve/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEleve(response.data);
    } catch (error: any) {
      console.error("Erreur de récupération du profil:", error.response?.data || error.message);
      Alert.alert("Erreur", "Impossible de récupérer le profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission refusée", "Autorisez l'accès aux photos.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", // CORRECTION : "images" en minuscules
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("photo", {
        uri: pickerResult.assets[0].uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      try {
        const response = await axios.post(
          "http://192.168.200.1:8000/api/eleve/photo",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEleve({ ...eleve!, photo: response.data.photo });
      } catch (error: any) {
        console.error("Erreur upload photo:", error.response?.data || error.message);
        Alert.alert("Erreur", "Impossible de mettre à jour la photo.");
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.photoContainer}>
        <Image
          source={{
            uri: eleve.photo ? `http://192.168.200.1:8000/${eleve.photo}` : undefined,
          }}
          style={styles.photo}
        />
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>
            {uploading ? "Mise à jour..." : "Modifier la photo"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {eleve.nom} {eleve.prenom}
        </Text>
        <Text style={styles.info}>🎂 Date de naissance : {eleve.date_de_naissance}</Text>
        <Text style={styles.info}>👩 Genre : {eleve.genre}</Text>
        <Text style={styles.info}>🏫 École : {eleve.ecole}</Text>
        <Text style={styles.info}>📘 Niveau : {eleve.niveau}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  photoContainer: { alignItems: "center", marginBottom: 20 },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  photoButton: {
    marginTop: 10,
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  photoButtonText: { color: "#fff", fontWeight: "bold" },
  infoContainer: {
    width: "100%",
    backgroundColor: "#f0f8ff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  info: { fontSize: 16, marginBottom: 5 },
});

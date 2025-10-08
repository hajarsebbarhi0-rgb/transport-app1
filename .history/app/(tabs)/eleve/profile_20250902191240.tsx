import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [saving, setSaving] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateDeNaissance, setDateDeNaissance] = useState("");
  const [genre, setGenre] = useState("");
  const [ecole, setEcole] = useState("");
  const [niveau, setNiveau] = useState("");

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erreur", "Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const response = await axios.get<Eleve>(
        "http://192.168.200.1:8000/api/eleve/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      setEleve(data);

      setNom(data.nom || "");
      setPrenom(data.prenom || "");
      setDateDeNaissance(data.date_de_naissance || "");
      setGenre(data.genre || "");
      setEcole(data.ecole || "");
      setNiveau(data.niveau || "");
    } catch (error: unknown) {
      console.error("Erreur de récupération du profil:", error);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        setEleve(prev => prev ? { ...prev, photo: response.data.photo } : null);
      } catch (error: unknown) {
        console.error("Erreur upload photo:", error);
        Alert.alert("Erreur", "Impossible de mettre à jour la photo.");
      } finally {
        setUploading(false);
      }
    }
  };

  const updateProfile = async () => {
    if (!eleve) return;
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return;

    if (!nom || !prenom || !dateDeNaissance || !genre || !ecole || !niveau) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs avant de sauvegarder.");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(
        "http://192.168.200.1:8000/api/eleve/profile",
        { nom, prenom, date_de_naissance: dateDeNaissance, genre, ecole, niveau },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEleve(response.data.eleve);
      Alert.alert("Succès", "Profil mis à jour avec succès !");
    } catch (error: unknown) {
      console.error("Erreur mise à jour profil:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#b13623" />
        <Text style={{ color: "#5d1e1d", marginTop: 10 }}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!eleve) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#5d1e1d" }}>Profil introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: eleve.photo ? `http://192.168.200.1:8000/${eleve.photo}` : undefined }}
          style={styles.photo}
        />
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>{uploading ? "Mise à jour..." : "Modifier la photo"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom :</Text>
        <TextInput style={styles.input} placeholder="Ex: Ahmed" value={nom} onChangeText={setNom} />

        <Text style={styles.label}>Prénom :</Text>
        <TextInput style={styles.input} placeholder="Ex: Fatima" value={prenom} onChangeText={setPrenom} />

        <Text style={styles.label}>Date de naissance :</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={dateDeNaissance} onChangeText={setDateDeNaissance} />

        <Text style={styles.label}>Genre :</Text>
        <TextInput style={styles.input} placeholder="Masculin / Féminin" value={genre} onChangeText={setGenre} />

        <Text style={styles.label}>École :</Text>
        <TextInput style={styles.input} placeholder="Ex: Lycée Hassan II" value={ecole} onChangeText={setEcole} />

        <Text style={styles.label}>Niveau :</Text>
        <TextInput style={styles.input} placeholder="Ex: 3ème année" value={niveau} onChangeText={setNiveau} />

        <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
          <Text style={styles.saveButtonText}>{saving ? "Enregistrement..." : "Mettre à jour le profil"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/eleve")}>
          <Text style={styles.homeButtonText}>Aller à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#e8e6df" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e8e6df" },
  photoContainer: { alignItems: "center", marginBottom: 20 },
  photo: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#fff" },
  photoButton: { marginTop: 10, backgroundColor: "#b13623", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  photoButtonText: { color: "#fff", fontWeight: "bold" },
  infoContainer: {
    width: "100%",
    backgroundColor: "#edece5",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#7a6c62",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  label: { fontWeight: "bold", marginBottom: 5, fontSize: 16, color: "#5d1e1d" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 15, fontSize: 16, color: "#4a8e9e" },
  saveButton: { backgroundColor: "#8DBCC7", padding: 12, borderRadius: 25, marginTop: 10, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  homeButton: { backgroundColor: "#b13623", padding: 12, borderRadius: 25, marginTop: 15, alignItems: "center" },
  homeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

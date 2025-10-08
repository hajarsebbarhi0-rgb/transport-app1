import { Feather } from "@expo/vector-icons";
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
import { COLORS } from "../theme"; // ✅ import du thème

interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  date_de_naissance: string;
  genre: string;
  ecole: string;
  niveau: string;
  photo?: string;
  email?: string;      // si tu veux l’ajouter
  telephone?: string;  // si tu veux l’ajouter
}

export default function Profile() {
  const [eleve, setEleve] = useState<Eleve | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateDeNaissance, setDateDeNaissance] = useState("");
  const [genre, setGenre] = useState("");
  const [ecole, setEcole] = useState("");
  const [niveau, setNiveau] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erreur", "Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const response = await axios.get<Eleve>(
        "http://192.168.2.23:8000/api/eleve/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      setEleve(data);

      setNom(data.nom || "");
      setPrenom(data.prenom || "");
      setDateDeNaissance(data.date_de_naissance || "");
      setGenre(data.genre || "");
      setEcole(data.ecole || "");
      setNiveau(data.niveau || "");
      setEmail(data.user?.email || "");
      setTelephone(data.user?.telephone || "");
    } catch (error) {
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
    if (!isEditing) return;

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
          "http://192.168.2.23:8000/api/eleve/photo",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEleve(prev => prev ? { ...prev, photo: response.data.photo } : null);
      } catch (error) {
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
        "http://192.168.2.23:8000/api/eleve/profile",
        {
          nom,
          prenom,
          date_de_naissance: dateDeNaissance,
          genre,
          ecole,
          niveau,
          email,
          telephone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEleve(response.data.eleve);
      Alert.alert("Succès", "Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.textSecondary, marginTop: 10 }}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!eleve) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.background }]}>
        <Text style={{ color: COLORS.text }}>Profil introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: COLORS.primary }]}>Mon Profil</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Feather name={isEditing ? "x" : "edit"} size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.photoContainer}>
        <Image
          source={{ uri: eleve.photo ? `http://192.168.2.23:8000/${eleve.photo}` : undefined }}
          style={styles.photo}
        />
        {isEditing && (
          <TouchableOpacity style={[styles.photoButton, { backgroundColor: COLORS.primary }]} onPress={pickImage}>
            <Text style={styles.photoButtonText}>{uploading ? "Mise à jour..." : "Modifier la photo"}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.infoContainer, { backgroundColor: COLORS.card }]}>
        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Nom :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={nom} onChangeText={setNom} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Prénom :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={prenom} onChangeText={setPrenom} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Date de naissance :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={dateDeNaissance} onChangeText={setDateDeNaissance} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Genre :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={genre} onChangeText={setGenre} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>École :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={ecole} onChangeText={setEcole} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Niveau :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={niveau} onChangeText={setNiveau} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Email :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={email} onChangeText={setEmail} editable={isEditing} />

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Téléphone :</Text>
        <TextInput style={[styles.input, { color: COLORS.text }]} value={telephone} onChangeText={setTelephone} editable={isEditing} />

        {isEditing && (
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: COLORS.primary }]} onPress={updateProfile}>
            <Text style={styles.saveButtonText}>{saving ? "Enregistrement..." : "Sauvegarder les modifications"}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.homeButton, { backgroundColor: COLORS.secondary }]} onPress={() => router.push("/eleve")}>
          <Text style={styles.homeButtonText}>Aller à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  photoContainer: { alignItems: "center", marginBottom: 20 },
  photo: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#fff" },
  photoButton: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, alignItems: "center" },
  photoButtonText: { color: "#fff", fontWeight: "bold" },
  infoContainer: { width: "100%", padding: 20, borderRadius: 15, shadowColor: "#7a6c62", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  label: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  saveButton: { padding: 12, borderRadius: 25, marginTop: 10, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  homeButton: { padding: 12, borderRadius: 25, marginTop: 15, alignItems: "center" },
  homeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

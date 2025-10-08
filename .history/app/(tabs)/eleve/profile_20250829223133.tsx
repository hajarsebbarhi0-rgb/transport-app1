import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Profile() {
  const [eleve, setEleve] = useState({
    nom: "",
    prenom: "",
    date_de_naissance: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEleveData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          router.replace("/");
          return;
        }

        const response = await axios.get(
          "http://192.168.103.1:8000/api/profile", // Nouvel endpoint à créer dans votre API
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEleve(response.data);
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Impossible de charger vos informations. Veuillez réessayer."
        );
        console.error("Erreur de récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEleveData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.put(
        "http://192.168.103.1:8000/api/profile", // Nouvel endpoint pour la mise à jour
        eleve,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Succès", "Vos informations ont été mises à jour !");
      router.back();
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de mettre à jour vos informations. Veuillez réessayer."
      );
      console.error("Erreur de mise à jour:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a8e9e" />
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Modifier mes informations</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#7a6c62"
            onChangeText={(text) => setEleve({ ...eleve, nom: text })}
            value={eleve.nom}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#7a6c62"
            onChangeText={(text) => setEleve({ ...eleve, prenom: text })}
            value={eleve.prenom}
          />
          <TextInput
            style={styles.input}
            placeholder="Date de naissance (AAAA-MM-JJ)"
            placeholderTextColor="#7a6c62"
            onChangeText={(text) =>
              setEleve({ ...eleve, date_de_naissance: text })
            }
            value={eleve.date_de_naissance}
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e8e6df",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#5d1e1d",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#edece5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d5d8d6",
    color: "#4a8e9e",
  },
  button: {
    backgroundColor: "#b13623",
    padding: 18,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8e6df",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7a6c62",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";

const ListeEleves = () => {
  const [eleves, setEleves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // récupère le token stocké

        if (!token) {
          Alert.alert("Erreur", "Token non trouvé. Veuillez vous reconnecter.");
          return;
        }

        const response = await axios.get(
          "http://192.168.205.1:8000/api/chauffeur/eleves",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEleves(response.data);
      } catch (error: any) {
        console.error(
          "Erreur lors de la récupération des élèves:",
          error.response ? error.response.data : error.message
        );
        Alert.alert("Erreur", "Impossible de charger la liste des élèves.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEleves();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Liste des élèves
      </Text>
      <FlatList
        data={eleves}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.nom} {item.prenom}</Text>
            <Text style={{ color: "gray" }}>{item.ecole}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ListeEleves;

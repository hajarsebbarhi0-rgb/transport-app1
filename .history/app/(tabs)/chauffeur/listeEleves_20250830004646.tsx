import axios from 'axios';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function ListeEleves() {
  const [eleves, setEleves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const response = await axios.get("http://192.168.200.1:8081/api/eleves");
        setEleves(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
        Alert.alert('Erreur', 'Impossible de charger la liste des élèves. Veuillez vérifier votre connexion.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEleves();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a8e9e" />
        <Text style={styles.loadingText}>Chargement de la liste des élèves...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Liste des élèves</Text>
      <FlatList
        data={eleves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.eleve}>• {item.prenom} {item.nom}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#e8e6df' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e6df',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7a6c62',
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: '#5d1e1d' 
  },
  eleve: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#d5d8d6",
    fontSize: 16,
    color: '#4a8e9e',
    backgroundColor: '#edece5',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

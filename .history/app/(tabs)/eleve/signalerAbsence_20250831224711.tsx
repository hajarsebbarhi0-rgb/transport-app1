import { router } from 'expo-router';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignalerAbsence() {
  const [motif, setMotif] = useState("");

  const envoyerAbsence = () => {
    Alert.alert("Absence signalée", `Motif : ${motif}`);
    setMotif("");
  };

  return (
    <View style={styles.container}>
      {/* En-tête de la page */}
      <View style={styles.header}>
        <Text style={styles.title}>📌 Signaler une absence</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/eleve')}>
          <Text style={styles.linkText}>Accueil</Text>
        </TouchableOpacity>
      </View>

      {/* Espace pour faire descendre la page */}
      <View style={{ height: 30 }} />

      {/* Formulaire de signalement */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Motif de l’absence"
          style={styles.input}
          value={motif}
          onChangeText={setMotif}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={envoyerAbsence}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#e8e6df' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
    color: '#5d1e1d',
  },
  linkText: {
    color: '#4a8e9e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5a7d9a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});

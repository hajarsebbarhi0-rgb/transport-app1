import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const Profile = () => {
  const [eleve, setEleve] = useState<any>({
    nom: '',
    prenom: '',
    date_de_naissance: '',
    genre: '',
    ecole: '',
    niveau: '',
    photo: ''
  });

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Assurez-vous de stocker le token lors de la connexion
      const response = await axios.get('http://localhost:8000/api/eleve/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEleve(response.data);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de récupérer le profil');
    }
  };

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put('http://localhost:8000/api/eleve/profile', eleve, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      {Object.keys(eleve).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={eleve[key]}
            onChangeText={(text) => setEleve({ ...eleve, [key]: text })}
          />
        </View>
      ))}

      <Button title="Mettre à jour" onPress={updateProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
});

export default Profile;

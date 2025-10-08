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
      // 1. Récupération du jeton
      console.log('1. Tentative de récupération du jeton...');
      // ⚠️ ATTENTION : La clé est 'userToken', pas 'token'
      const token = await AsyncStorage.getItem('userToken'); 
      console.log('2. Jeton récupéré :', token);

      if (!token) {
        Alert.alert('Erreur', 'Jeton d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      // 2. Appel à l'API de profil
      console.log('3. Envoi de la requête à l\'API de profil...');
      // ⚠️ IMPORTANT : Remplacer 'localhost' par votre adresse IPv4 locale.
      const response = await axios.get('http://192.168.200.1:8000/api/eleve/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('4. Profil récupéré avec succès:', response.data);
      setEleve(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération du profil:', error.response ? error.response.data : error.message);
      Alert.alert('Erreur', 'Impossible de récupérer le profil');
    }
  };

  const updateProfile = async () => {
    try {
      // 1. Récupération du jeton pour la mise à jour
      const token = await AsyncStorage.getItem('userToken'); 

      if (!token) {
        Alert.alert('Erreur', 'Jeton d\'authentification manquant. Impossible de mettre à jour le profil.');
        return;
      }

      // 2. Appel à l'API de mise à jour
      console.log('5. Envoi de la requête de mise à jour...');
      await axios.put('http://192.168.200.1:8000/api/eleve/profile', eleve, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('6. Profil mis à jour avec succès.');
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error.response ? error.response.data : error.message);
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

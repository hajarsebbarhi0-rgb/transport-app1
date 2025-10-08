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
      // ✅ Correction : Utilisation de la clé 'userToken'
      const token = await AsyncStorage.getItem('userToken'); 

      if (!token) {
        Alert.alert('Erreur', 'Jeton d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      // ✅ Correction : Utilisation de la même adresse IP que pour la connexion
      const response = await axios.get('http://192.168.200.1:8000/api/eleve/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEleve(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération du profil:', error.response ? error.response.data : error.message);
      Alert.alert('Erreur', 'Impossible de récupérer le profil');
    }
  };

  const updateProfile = async () => {
    try {
      // ✅ Correction : Utilisation de la clé 'userToken'
      const token = await AsyncStorage.getItem('userToken'); 

      if (!token) {
        Alert.alert('Erreur', 'Jeton d\'authentification manquant. Impossible de mettre à jour le profil.');
        return;
      }

      // ✅ Correction : Utilisation de la même adresse IP que pour la connexion
      await axios.put('http://192.168.200.1:8000/api/eleve/profile', eleve, {
        headers: { Authorization: `Bearer ${token}` }
      });

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

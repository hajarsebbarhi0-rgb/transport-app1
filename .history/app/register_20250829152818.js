import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // Endpoint d'inscription (à créer sur votre backend)
      const response = await axios.post('http://192.168.103.1:8000/api/register', {
        email,
        password,
        nom,
        prenom,
        role: 'eleve' // L'inscription est seulement pour les élèves
      });
      
      // ✅ Le code côté client est correct, il envoie bien les données.
      // Le problème se trouve probablement dans la gestion de l'API sur votre serveur.
      
      Alert.alert('Succès', 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.');
      router.replace('/');
    } catch (error) {
      const err = error;
      console.error('Erreur d\'inscription:', err.response ? err.response.data : err.message);
      Alert.alert('Erreur', 'Impossible de créer le compte. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.card}>
        <Text style={styles.title}>Inscription</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          placeholderTextColor="#7a6c62" // Brun gris
          onChangeText={setNom}
          value={nom}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          placeholderTextColor="#7a6c62" // Brun gris
          onChangeText={setPrenom}
          value={prenom}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7a6c62" // Brun gris
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#7a6c62" // Brun gris
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/')}>
          <Text style={styles.loginLinkText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e6df', // Beige clair
  },
  card: {
    backgroundColor: '#edece5', // Ivoire
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#7a6c62', // Brun gris
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 25,
    color: '#5d1e1d', // Marron foncé
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#d5d8d6', // Gris clair
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#4a8e9e', // Bleu gris foncé
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#b13623', // Rouge brique
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: '#7a6c62', // Brun gris
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

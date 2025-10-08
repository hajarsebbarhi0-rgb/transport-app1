import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chauffeur');

  const handleLogin = async () => {
    try {
      // ⚠️ IMPORTANT : Mets l’adresse IPv4 locale de ton PC ici
      const response = await axios.post('http://192.168.200.1:8000/api/login', {
        email: email,
        password: password,
        role: role,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', user.role);

      if (user.role === 'chauffeur') {
        // Redirection vers le tableau de bord du chauffeur à l'intérieur des onglets
        router.replace('/(tabs)/chauffeur'); 
      } else if (user.role === 'eleve') {
        // Redirection vers le tableau de bord de l'élève à l'intérieur des onglets
        router.replace('/(tabs)/eleve');
      }
    } catch (error) {
      const err = error as any;
      console.error('Erreur de connexion:', err.response ? err.response.data : err.message);
      Alert.alert('Erreur', 'Identifiants ou rôle invalides.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.card}>
        <Text style={styles.title}>Connexion</Text>

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

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'chauffeur' && styles.selectedRole]}
            onPress={() => setRole('chauffeur')}
          >
            <Text style={styles.buttonText}>Chauffeur</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'eleve' && styles.selectedRole]}
            onPress={() => setRole('eleve')}
          >
            <Text style={styles.buttonText}>Élève</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('./register')} style={{ marginTop: 20 }}>
          <Text style={styles.registerLinkText}>Pas encore de compte ? S’inscrire</Text>
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
  roleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 30, 
    gap: 10 
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#c8d0d2', // Gris bleu clair
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedRole: { backgroundColor: '#c8d0d2' },
  loginButton: { 
    backgroundColor: '#b13623', // Rouge brique
    padding: 18, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  registerLinkText: {
    color: '#4a8e9e', // Bleu gris foncé
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

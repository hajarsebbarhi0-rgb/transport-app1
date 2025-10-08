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
      const response = await axios.post('http://192.168.103.1:8000/api/login', {
        email: email,
        password: password,
        role: role,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', user.role);

      if (user.role === 'chauffeur') {
        router.replace('/chauffeur'); // redirection chauffeur
      } else if (user.role === 'eleve') {
        router.replace('./eleve'); // redirection élève
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
          placeholderTextColor="#888"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#888"
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
          <Text style={{ color: '#3498db' }}>Pas encore de compte ? S’inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f7' },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 25, color: '#333' },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30, gap: 10 },
  roleButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedRole: { backgroundColor: '#3498db' },
  loginButton: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default LoginScreen;

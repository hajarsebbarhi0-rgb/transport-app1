import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chauffeur');
  
  const handleLogin = async () => {
    try {
      // REMPLACEZ 'VOTRE_IP_LOCALE' PAR L'ADRESSE IP DE VOTRE ORDINATEUR
      const response = await axios.post('http://VOTRE_IP_LOCALE:8000/api/login', {
        email: email,
        password: password,
        role: role,
      });

      const { token, user } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', user.role);
      
      if (user.role === 'chauffeur') {
        router.replace('/chauffeur');
      } else if (user.role === 'eleve') {
        router.replace('/eleve');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
      Alert.alert('Erreur', 'Identifiants ou rôle invalides.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, borderRadius: 5 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  roleButton: { padding: 10, borderWidth: 1, borderColor: '#3498db', borderRadius: 5 },
  selectedRole: { backgroundColor: '#3498db' },
  loginButton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default LoginScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'chauffeur' | 'eleve'>('chauffeur');
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.234.1:8000/api/login', {
        email,
        password,
        role,
      });

      const { token, user } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', user.role);
      
      if (user.role === 'chauffeur') {
        router.replace('/chauffeur/index'); // ✅ Correction ici
      } else if (user.role === 'eleve') {
        router.replace('/eleve/index'); // ✅ Idem pour élève
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
      Alert.alert('Erreur', 'Identifiants ou rôle invalides.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🚍 Transport Scolaire</Text>
        <Text style={styles.subtitle}>Connexion à votre compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#aaa"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'chauffeur' && styles.selectedRole]}
            onPress={() => setRole('chauffeur')}
          >
            <Text style={[styles.roleText, role === 'chauffeur' && styles.selectedRoleText]}>
              Chauffeur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'eleve' && styles.selectedRole]}
            onPress={() => setRole('eleve')}
          >
            <Text style={[styles.roleText, role === 'eleve' && styles.selectedRoleText]}>
              Élève
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Se connecter</Text>
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
    backgroundColor: '#f5f6fa' 
  },
  card: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5, 
    color: '#2c3e50' 
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#7f8c8d' 
  },
  input: { 
    width: '100%', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#dcdde1', 
    borderRadius: 10, 
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#2c3e50',
  },
  roleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  roleButton: { 
    flex: 1, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#3498db', 
    borderRadius: 10, 
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  roleText: { color: '#3498db', fontWeight: '600' },
  selectedRole: { backgroundColor: '#3498db' },
  selectedRoleText: { color: '#fff' },
  loginButton: { 
    backgroundColor: '#27ae60', 
    paddingVertical: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  loginText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default LoginScreen;

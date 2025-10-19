import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [role, setRole] = useState('eleve'); // Valeur par défaut
  const [codeTrajet, setCodeTrajet] = useState(''); // ✅ Nouveau champ
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!telephone || !role) {
      Alert.alert('Erreur', 'Veuillez renseigner votre téléphone et rôle.');
      return;
    }

    // Si c’est un élève, vérifier que le code trajet est saisi
    if (role === 'eleve' && !codeTrajet.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le code du trajet.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://192.168.2.13:8000/api/register', {
        email,
        password,
        nom,
        prenom,
        telephone,
        role,
        ...(role === 'eleve' && { code_trajet: codeTrajet }), // envoi seulement si élève
      });

      Alert.alert(
        'Succès',
        'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.'
      );
      router.replace('/');
    } catch (error) {
      console.error(
        'Erreur d\'inscription:',
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de créer le compte. Vérifiez vos informations.'
      );
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
          placeholderTextColor="#7a6c62"
          onChangeText={setNom}
          value={nom}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          placeholderTextColor="#7a6c62"
          onChangeText={setPrenom}
          value={prenom}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7a6c62"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          placeholderTextColor="#7a6c62"
          onChangeText={setTelephone}
          value={telephone}
          keyboardType="phone-pad"
        />

        {/* Sélecteur de rôle */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Élève" value="eleve" />
            <Picker.Item label="Chauffeur" value="chauffeur" />
          </Picker>
        </View>

        {/* Champ du code trajet (visible seulement si élève) */}
        {role === 'eleve' && (
          <TextInput
            style={styles.input}
            placeholder="Code du trajet (ex: AJ48RT29L)"
            placeholderTextColor="#7a6c62"
            onChangeText={setCodeTrajet}
            value={codeTrajet}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#7a6c62"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.loginLinkText}>
            Déjà un compte ? Se connecter
          </Text>
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
    backgroundColor: '#e8e6df',
  },
  card: {
    backgroundColor: '#edece5',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#7a6c62',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 25, color: '#5d1e1d' },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#d5d8d6',
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#4a8e9e',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d5d8d6',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: { height: 50, width: '100%' },
  registerButton: {
    backgroundColor: '#b13623',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loginLink: { marginTop: 20 },
  loginLinkText: { color: '#7a6c62', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;

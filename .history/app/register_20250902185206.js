import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Picker, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [role, setRole] = useState('eleve'); 
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [genre, setGenre] = useState('');
  const [ecole, setEcole] = useState('');
  const [niveau, setNiveau] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!telephone || !role) {
      Alert.alert('Erreur', 'Veuillez renseigner votre téléphone et rôle.');
      return;
    }

    // Vérifier les champs spécifiques pour les élèves
    if (role === 'eleve' && (!dateDeNaissance || !genre || !ecole || !niveau)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs pour le rôle élève.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.200.1:8000/api/register', {
        email,
        password,
        nom,
        prenom,
        telephone,
        role,
        date_de_naissance: dateDeNaissance,
        genre,
        ecole,
        niveau
      });

      Alert.alert('Succès', 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.');
      router.replace('/');
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error.response ? error.response.data : error.message);
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
          onChangeText={setNom}
          value={nom}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          onChangeText={setPrenom}
          value={prenom}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          onChangeText={setTelephone}
          value={telephone}
          keyboardType="phone-pad"
        />

        {/* Choix du rôle */}
        <Text style={styles.label}>Rôle :</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Élève" value="eleve" />
          <Picker.Item label="Chauffeur" value="chauffeur" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        {/* Champs spécifiques aux élèves */}
        {role === 'eleve' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Date de naissance (YYYY-MM-DD)"
              onChangeText={setDateDeNaissance}
              value={dateDeNaissance}
            />
            <TextInput
              style={styles.input}
              placeholder="Genre (Masculin/Féminin)"
              onChangeText={setGenre}
              value={genre}
            />
            <TextInput
              style={styles.input}
              placeholder="École"
              onChangeText={setEcole}
              value={ecole}
            />
            <TextInput
              style={styles.input}
              placeholder="Niveau"
              onChangeText={setNiveau}
              value={niveau}
            />
          </>
        )}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Inscription...' : 'S\'inscrire'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/')}>
          <Text style={styles.loginLinkText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8e6df' },
  card: { backgroundColor: '#edece5', borderRadius: 20, padding: 30, width: '90%', maxWidth: 400, shadowColor: '#7a6c62', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 25, color: '#5d1e1d' },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#d5d8d6', marginBottom: 15, borderRadius: 10, fontSize: 16, color: '#4a8e9e', backgroundColor: '#fff' },
  label: { fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 5 },
  picker: { width: '100%', backgroundColor: '#fff', marginBottom: 15 },
  registerButton: { backgroundColor: '#b13623', padding: 18, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loginLink: { marginTop: 20 },
  loginLinkText: { color: '#7a6c62', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;

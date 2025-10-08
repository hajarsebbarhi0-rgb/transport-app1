import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ElevesDashboard = () => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');

    // Redirige correctement vers index.tsx (page login)
    router.replace('/'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord de l'Élève</Text>
      <Text style={styles.message}>Bienvenue ! Vous êtes connecté en tant qu'Élève.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#34495e', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ecf0f1', marginBottom: 10 },
  message: { fontSize: 16, color: '#bdc3c7', marginBottom: 30 },
  logoutButton: { backgroundColor: '#c0392b', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default ElevesDashboard;

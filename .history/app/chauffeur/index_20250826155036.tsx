import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ChauffeurDashboard = () => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      router.replace('/'); // Retour à la page de login
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚍 Tableau de bord du Chauffeur</Text>
      <Text style={styles.message}>Bienvenue ! Vous êtes connecté en tant que Chauffeur.</Text>

      <ScrollView contentContainerStyle={styles.menu}>
        {/* Lancer le trajet */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/chauffeur/lancerTrajet')}
        >
          <Text style={styles.buttonText}>▶️ Lancer le trajet</Text>
        </TouchableOpacity>

        {/* Consulter la liste des élèves */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/chauffeur/listeEleves')}
        >
          <Text style={styles.buttonText}>👥 Consulter la liste des élèves</Text>
        </TouchableOpacity>

        {/* Valider la présence */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/chauffeur/validationPresence')}
        >
          <Text style={styles.buttonText}>✅ Valider la présence</Text>
        </TouchableOpacity>

        {/* Signaler un problème */}
        <TouchableOpacity 
          style={styles.problemButton} 
          onPress={() => router.push('/chauffeur/signalerProbleme')}
        >
          <Text style={styles.buttonText}>⚠️ Signaler un problème</Text>
        </TouchableOpacity>

        {/* Déconnexion */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>🚪 Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#2c3e50', 
    padding: 20 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#ecf0f1', 
    textAlign: 'center', 
    marginBottom: 5 
  },
  message: { 
    fontSize: 16, 
    color: '#bdc3c7', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  menu: { 
    alignItems: 'center', 
    paddingBottom: 40 
  },
  button: { 
    backgroundColor: '#3498db', 
    padding: 15, 
    borderRadius: 12, 
    width: '90%', 
    marginVertical: 10, 
    alignItems: 'center' 
  },
  problemButton: {
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 12,
    width: '90%',
    marginVertical: 10,
    alignItems: 'center'
  },
  logoutButton: { 
    backgroundColor: '#e74c3c', 
    padding: 15, 
    borderRadius: 12, 
    width: '90%', 
    marginVertical: 10, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});

export default ChauffeurDashboard;

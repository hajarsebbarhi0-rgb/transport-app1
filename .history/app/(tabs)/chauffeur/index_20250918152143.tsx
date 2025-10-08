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
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#e8e6df' // Beige clair
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#5d1e1d', // Marron foncé
    textAlign: 'center', 
    marginBottom: 5 
  },
  message: { 
    fontSize: 16, 
    color: '#7a6c62', // Brun gris
    textAlign: 'center', 
    marginBottom: 20 
  },
  menu: { 
    alignItems: 'center', 
    paddingBottom: 40 
  },
  button: { 
    backgroundColor: '#c8d0d2', // Gris bleu clair
    padding: 15, 
    borderRadius: 10, 
    width: '90%', 
    marginVertical: 10, 
    alignItems: 'center' 
  },
  problemButton: {
    backgroundColor: '#b13623', // Rouge brique
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
    alignItems: 'center'
  },
  logoutButton: { 
    backgroundColor: '#b13623', // Rouge brique
    padding: 15, 
    borderRadius: 10, 
    width: '90%', 
    marginVertical: 10, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#4a8e9e', // Bleu gris foncé
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});

export default ChauffeurDashboard;

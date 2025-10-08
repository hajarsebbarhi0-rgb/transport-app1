import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const StartScreen = () => {
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');

        if (storedToken && storedRole) {
          // L'utilisateur est connecté, on le redirige vers le bon tableau de bord
          if (storedRole === 'chauffeur') {
            router.replace('/(tabs)/chauffeur');
          } else {
            router.replace('/(tabs)/eleve');
          }
        } else {
          // Aucune session trouvée, on le redirige vers l'écran de connexion
          router.replace('./login');
        }
      } catch (error) {
        console.error("Erreur de vérification de session :", error);
        // En cas d'erreur, on le redirige quand même vers la connexion pour ne pas bloquer l'app
        router.replace('./login');
      }
    };
    
    checkUserSession();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4a8e9e" />
      <Text style={styles.text}>Chargement de la session...</Text>
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
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#5d1e1d',
  },
});

export default StartScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function StartScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');

        if (storedToken && storedRole) {
          if (storedRole === 'chauffeur') {
            router.replace('/(tabs)/chauffeur');
          } else if (storedRole === 'eleve') {
            router.replace('/(tabs)/eleve');
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error("Erreur de vérification de session :", error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a8e9e" />
        <Text style={styles.text}>Chargement de la session...</Text>
      </View>
    );
  }

  return null; // redirige automatiquement
}

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

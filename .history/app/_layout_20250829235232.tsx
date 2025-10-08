import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedRole === 'chauffeur') {
          router.replace('/chauffeur'); // vers /app/chauffeur/index.js
        } else if (storedRole === 'eleve') {
          router.replace('/eleve'); // vers /app/eleve/index.js
        }
      } catch (e) {
        console.error("Erreur de récupération de la session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Si pas de session → on laisse Expo Router gérer la route index automatiquement
  return null;
}

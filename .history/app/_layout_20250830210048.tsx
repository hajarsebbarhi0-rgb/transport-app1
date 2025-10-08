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
          router.replace('/(tabs)/chauffeur');
        } else if (storedRole === 'eleve') {
          router.replace('/(tabs)/eleve');
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

  // Si pas de session, Expo Router chargera automatiquement index.js
  return null;
}

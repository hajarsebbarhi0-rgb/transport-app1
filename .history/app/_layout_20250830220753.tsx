import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');

        // ⚠️ redirection uniquement si on est sur la page login
        if (token && role && router.pathname === '/') {
          if (role === 'chauffeur') router.replace('/chauffeur' as Href);
          else if (role === 'eleve') router.replace('/eleve' as Href);
        }
      } catch (e) {
        console.error('Erreur récupération session', e);
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

  // Stack vide : Expo Router trouve index.js et register.js
  return <Stack />;
}

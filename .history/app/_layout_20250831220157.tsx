import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, useSegments, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments(); // 👈 savoir où on est

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');

        // ⚠️ si on est déjà dans (tabs), pas besoin de rediriger
        if (segments[0] === '(tabs)') {
          setIsLoading(false);
          return;
        }

        if (token && role) {
          if (role === 'chauffeur') {
            router.replace('/(tabs)/chauffeur' as Href);
          } else if (role === 'eleve') {
            router.replace('/(tabs)/eleve' as Href);
          }
        }
      } catch (e) {
        console.error('Erreur récupération session', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [segments]); // 👈 important, on relance seulement si route change

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return <Stack />;
}

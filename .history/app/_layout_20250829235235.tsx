import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedRole === 'chauffeur') {
          router.replace('/chauffeur');
        } else if (storedRole === 'eleve') {
          router.replace('/eleve');
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

  // Si pas de session → reste sur login
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chauffeur" options={{ title: 'Tableau de bord du chauffeur' }} />
      <Stack.Screen name="eleve" options={{ title: "Tableau de bord de l'élève" }} />
    </Stack>
  );
}

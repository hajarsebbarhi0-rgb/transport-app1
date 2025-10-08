import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  // Ce useEffect gère la session de l'utilisateur.
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');

        // Si un token et un rôle sont trouvés, on redirige vers le tableau de bord
        // approprié au sein de la navigation par onglets.
        if (storedToken && storedRole) {
          if (storedRole === 'chauffeur') {
            router.replace("(tabs)/chauffeur" as Href); 
          } else if (storedRole === 'eleve') {
            router.replace('(tabs)/eleve' as Href);
          }
        }
      } catch (e) {
        console.error("Erreur récupération session", e);
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

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
    </Stack>
  );
}

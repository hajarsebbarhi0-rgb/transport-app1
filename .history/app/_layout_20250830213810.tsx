import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      console.log("=== Début checkUserStatus ===");
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');

        console.log("Token récupéré:", storedToken);
        console.log("Role récupéré:", storedRole);

        if (storedToken && storedRole) {
          if (storedRole === 'chauffeur') {
            console.log("Redirection vers chauffeur...");
            router.replace('/(tabs)/chauffeur');
          } else if (storedRole === 'eleve') {
            console.log("Redirection vers eleve...");
            router.replace('/(tabs)/eleve');
          } else {
            console.log("Role inconnu, on reste sur index");
          }
        } else {
          console.log("Pas de session trouvée, on reste sur index");
        }
      } catch (e) {
        console.error("Erreur de récupération de la session:", e);
      } finally {
        setIsLoading(false);
        console.log("Fin checkUserStatus, isLoading=false");
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    console.log("Affichage du loader...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  console.log("Affichage du Stack avec index et register");

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

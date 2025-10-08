import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Vérifie AsyncStorage pour savoir si l'utilisateur est connecté
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        console.log("=== Début checkUserStatus ===");
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');
        console.log("Token récupéré:", storedToken);
        console.log("Role récupéré:", storedRole);

        if (storedToken && storedRole) {
          if (storedRole === 'chauffeur') setInitialRoute('/(tabs)/chauffeur');
          else if (storedRole === 'eleve') setInitialRoute('/(tabs)/eleve');
        }
      } catch (e) {
        console.error("Erreur de récupération de la session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Redirige uniquement après que initialRoute soit défini
  useEffect(() => {
    if (initialRoute) {
      console.log("Redirection vers:", initialRoute);
      router.replace({ pathname: initialRoute }); // ✅ Utilisation safe pour TypeScript
    }
  }, [initialRoute]);

  // Affiche le loader pendant la vérification
  if (isLoading) {
    console.log("Affichage du loader...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  console.log("Affichage du Stack avec index et register");

  // Si pas de session, Stack normal avec index et register
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [initialRole, setInitialRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifie l'état de l'utilisateur au lancement de l'application
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        setInitialRole(storedRole);
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

  // Si un rôle est trouvé, redirige vers la bonne page
  if (initialRole === 'chauffeur') {
    return <Stack screenOptions={{ headerShown: false }} initialRouteName="chauffeur" />;
  } else if (initialRole === 'eleve') {
    return <Stack screenOptions={{ headerShown: false }} initialRouteName="eleve" />;
  }

  // Sinon, reste sur la page de connexion
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chauffeur" options={{ title: 'Tableau de bord du chauffeur' }} />
      <Stack.Screen name="eleve" options={{ title: "Tableau de bord de l'élève" }} />
    </Stack>
  );
}

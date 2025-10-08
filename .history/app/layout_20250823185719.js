import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Layout() {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un jeton existe au démarrage pour maintenir la session
    const checkUserStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedToken && storedRole) {
          setUserToken(storedToken);
          setUserRole(storedRole);
        }
      } catch (e) {
        console.error("Échec du chargement du jeton ou du rôle", e);
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
      <Stack.Screen
        name="index" // Route par défaut pour l'écran de connexion
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chauffeur" // Route pour le tableau de bord du chauffeur
        options={{ title: 'Tableau de bord du chauffeur' }}
      />
      <Stack.Screen
        name="eleve" // Route pour le tableau de bord de l'élève
        options={{ title: 'Tableau de bord de l\'élève' }}
      />
    </Stack>
  );
}

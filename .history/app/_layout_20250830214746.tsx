import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, type Href } from 'expo-router';
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
          if (storedRole === 'chauffeur') setInitialRoute('/(tabs)/chauffeur/index');
          else if (storedRole === 'eleve') setInitialRoute('/(tabs)/eleve/index');
        }
      } catch (e) {
        console.error("Erreur de récupération de la session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Redirection après que initialRoute soit défini
  useEffect(() => {
    if (initialRoute) {
      console.log("Redirection vers:", initialRoute);
      router.replace(initialRoute as Href); // TypeScript accepte le Href
    }
  }, [initialRoute]);

  if (isLoading) {
    console.log("Affichage du loader...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  console.log("Affichage du Stack vide (tabs gère les routes maintenant)");

  // Stack vide, les tabs gèrent les écrans index/register
  return <Stack />;
}

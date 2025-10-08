import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';


export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');

        if (storedToken && storedRole) {
          if (storedRole === 'chauffeur') {
            router.replace("(tabs)/chauffeur" as Href); 
          } else if (storedRole === 'eleve') {
            router.replace('(tabs)/eleve'  as Href);
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
      {/* On n'a plus besoin de ces lignes car les routes sont gérées par les onglets. */}
      {/* <Stack.Screen name="chauffeur" options={{ title: 'Tableau de bord du chauffeur' }} />
      <Stack.Screen name="eleve" options={{ title: "Tableau de bord de l'élève" }} /> */}
    </Stack>
  );
}

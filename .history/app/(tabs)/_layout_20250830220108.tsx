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
            router.replace("/chauffeur" as Href);
          } else if (storedRole === 'eleve') {
            router.replace("/eleve" as Href);
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

  return <Stack />; // Stack vide : les routes index/register sont trouvées automatiquement
}

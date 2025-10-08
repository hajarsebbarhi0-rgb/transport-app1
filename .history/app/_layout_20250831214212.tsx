import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  console.log("RootLayout exécuté"); // Vérifie que le fichier est chargé

  useEffect(() => {
    const checkUserStatus = async () => {
      console.log("=== Début checkUserStatus ===");
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');

        console.log("Token récupéré :", token);
        console.log("Role récupéré :", role);

        if (token && role) {
          if (role === 'chauffeur') {
            console.log("Redirection vers /(tabs)/chauffeur");
            router.replace('/(tabs)/chauffeur' as Href);
          } else if (role === 'eleve') {
            console.log("Redirection vers /(tabs)/eleve");
            router.replace('/(tabs)/eleve' as Href);
          } else {
            console.log("Role inconnu :", role);
          }
        } else {
          console.log("Pas de session trouvée, on reste sur index/register");
        }
      } catch (e) {
        console.error('Erreur récupération session', e);
      } finally {
        // ✅ Toujours enlever le loader
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

  console.log("Affichage du Stack (index/register)");

  // Expo Router détecte automatiquement index.tsx et register.tsx
  return <Stack />;
}

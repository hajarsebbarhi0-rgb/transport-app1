import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Page d’accueil</Text>
      <Button title="S’inscrire" onPress={() => router.push("/register")} />
    </View>
  );
}

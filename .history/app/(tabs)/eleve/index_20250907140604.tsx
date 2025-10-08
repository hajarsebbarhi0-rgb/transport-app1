import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EleveDashboard() {
  const handleLogout = async () => {
    try {
      // Supprime le token et le rôle de l'utilisateur
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userRole");

      // Redirige vers la page de connexion
      router.replace("/");
    } catch (e) {
      console.error("Erreur lors de la déconnexion:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🎓 Tableau de bord Élève</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/eleve/profile")}
      >
        <Text style={styles.text}>profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/eleve/suivreTransport")}
      >
        <Text style={styles.text}>🚌 Suivre le transport</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/eleve/signalerAbsence")}
      >
        <Text style={styles.text}>📌 Signaler une absence</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/eleve/notifications")}
      >
        <Text style={styles.text}>🔔 Voir les notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/eleve/contacterChauffeur")}
      >
        <Text style={styles.text}>☎️ Contacter le chauffeur</Text>
      </TouchableOpacity>
<TouchableOpacity
  style={styles.button}
  onPress={() => router.push("/eleve/choisirTrajet")}
>
  <Text style={styles.text}>🛣️ Choisir mon trajet</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.text}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#e8e6df" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 30, 
    color: "#5d1e1d" 
  },
  button: { 
    backgroundColor: "#c8d0d2", 
    padding: 15, 
    marginVertical: 10, 
    borderRadius: 10, 
    width: "90%", 
    alignItems: "center" 
  },
  text: { 
    color: "#4a8e9e", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  logoutButton: {
    backgroundColor: "#b13623", // Rouge brique pour la déconnexion
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 30, // Espace au-dessus du bouton
  },
});

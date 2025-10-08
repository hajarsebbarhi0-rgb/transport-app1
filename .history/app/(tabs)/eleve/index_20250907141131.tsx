import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EleveDashboard() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userRole");
      router.replace("/"); // Retour login
    } catch (e) {
      console.error("Erreur lors de la déconnexion:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🎓 Tableau de bord Élève</Text>
      <Text style={styles.message}>Bienvenue ! Vous êtes connecté en tant qu’élève.</Text>

      <ScrollView contentContainerStyle={styles.menu}>
        {/* Profil */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/eleve/profile")}
        >
          <Text style={styles.buttonText}>👤 Profil</Text>
        </TouchableOpacity>

        {/* Suivre transport */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/eleve/suivreTransport")}
        >
          <Text style={styles.buttonText}>🚌 Suivre le transport</Text>
        </TouchableOpacity>

        {/* Signaler absence */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/eleve/signalerAbsence")}
        >
          <Text style={styles.buttonText}>📌 Signaler une absence</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/eleve/notifications")}
        >
          <Text style={styles.buttonText}>🔔 Voir les notifications</Text>
        </TouchableOpacity>

        {/* Contacter chauffeur */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/eleve/contacterChauffeur")}
        >
          <Text style={styles.buttonText}>☎️ Contacter le chauffeur</Text>
        </TouchableOpacity>

        {/* Choisir trajet */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/eleve/choisirTrajet")}
        >
          <Text style={styles.buttonText}>🛣️ Choisir mon trajet</Text>
        </TouchableOpacity>

        {/* Déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>🚪 Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#5d1e1d", 
    textAlign: "center", 
    marginBottom: 5 
  },
  message: { 
    fontSize: 16, 
    color: "#7a6c62", 
    textAlign: "center", 
    marginBottom: 20 
  },
  menu: { 
    alignItems: "center", 
    paddingBottom: 40 
  },
  button: { 
    backgroundColor: "#c8d0d2", 
    padding: 15, 
    borderRadius: 10, 
    width: "90%", 
    marginVertical: 10, 
    alignItems: "center" 
  },
  logoutButton: { 
    backgroundColor: "#b13623", 
    padding: 15, 
    borderRadius: 10, 
    width: "90%", 
    marginVertical: 10, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#4a8e9e", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});

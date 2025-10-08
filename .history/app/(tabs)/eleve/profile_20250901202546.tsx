import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const [eleve, setEleve] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mets ton vrai backend ici
    fetch("http://10.0.2.2:8000/api/eleves/1/profile")
      .then((res) => res.json())
      .then((data) => {
        setEleve(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  if (!eleve) {
    return (
      <View style={styles.center}>
        <Text>Profil introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {eleve.photo && (
        <Image source={{ uri: `http://10.0.2.2:8000/${eleve.photo}` }} style={styles.image} />
      )}

      <Text style={styles.title}>
        {eleve.nom} {eleve.prenom}
      </Text>
      <Text>🎂 Date de naissance : {eleve.date_de_naissance}</Text>
      <Text>👩 Genre : {eleve.genre}</Text>
      <Text>🏫 École : {eleve.ecole}</Text>
      <Text>📘 Niveau : {eleve.niveau}</Text>

      {/* Infos du parent (relation User) */}
      {eleve.user && (
        <View style={styles.parentSection}>
          <Text style={styles.subtitle}>👨‍👩‍👧 Parent</Text>
          <Text>Nom : {eleve.user.nom} {eleve.user.prenom}</Text>
          <Text>Email : {eleve.user.email}</Text>
          <Text>Téléphone : {eleve.user.telephone}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  parentSection: { marginTop: 10, padding: 10, backgroundColor: "#f2f2f2", borderRadius: 8 },
});

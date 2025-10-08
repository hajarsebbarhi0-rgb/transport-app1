import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ChauffeursDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord Chauffeur</Text>

      {/* Bouton vers la liste des élèves */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ListeEleves')}
      >
        <Text style={styles.buttonText}>Liste des élèves</Text>
      </TouchableOpacity>

      {/* Bouton pour valider la présence */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Presence')}
      >
        <Text style={styles.buttonText}>Valider la présence</Text>
      </TouchableOpacity>

      {/* Bouton pour signaler un problème */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignalerProbleme')}
      >
        <Text style={styles.buttonText}>Signaler un problème</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChauffeursDashboard;

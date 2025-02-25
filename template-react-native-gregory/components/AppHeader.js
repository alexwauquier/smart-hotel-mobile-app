import React, { useState, useEffect } from 'react'; // Importation de useEffect
import { View, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font'; // Importation de expo-font pour charger les polices

const AppHeader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf')
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Ne rien afficher tant que la police n'est pas chargée
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo_app.png')} // Chemin vers l'image PNG
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Utiliser position absolute pour coller en haut
    top: 0, // Aligner au tout début de l'écran
    left: 0, // Alignement horizontal à gauche
    right: 0, // Aligner à droite
    paddingTop: 20, // Espace en haut (si tu veux un peu de marge)
    justifyContent: 'flex-start', // Pas de centrage vertical
    alignItems: 'center', // Garder l'image centrée horizontalement
    zIndex: 1,
    backgroundColor: 'white',
    width: '100%',
    height: 100,
  },
  image: {
    width: 100,  // Largeur de l'image
    height: 100, // Hauteur de l'image
  },
});

export default AppHeader;

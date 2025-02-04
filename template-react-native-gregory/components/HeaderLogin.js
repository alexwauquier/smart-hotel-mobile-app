import React, { useState, useEffect } from 'react'; // Importation de useEffect
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font'; // Importation de expo-font pour charger les polices

const HeaderLogin = () => {
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
      <Text style={styles.text}>Barcelo Hotel Group</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 159,
    flexDirection: 'row', // Aligne le logo et le texte sur la même ligne
    justifyContent: 'center', // Centre les éléments horizontalement
    alignItems: 'center', // Centre les éléments verticalement
    padding: 20,
  },
  image: {
    width: 50,  // Largeur de l'image
    height: 50, // Hauteur de l'image
    marginRight: 10, // Marge à droite de l'image pour l'espacement avec le texte
  },
  text: {
    fontSize: 32,
    color: 'black',
    fontFamily: 'Averia-Serif-Libre-Regular',
  },
});

export default HeaderLogin;

import React, { useState, useEffect } from 'react'; // Importation de useEffect
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font'; // Importation de expo-font pour charger les polices

const HomeHeader = () => {
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
      <Text style={styles.text_table}>Table n°XXX</Text>
      <TouchableOpacity style={styles.arrow}>
        <Image 
          source={require('../assets/arrow_table.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.scan}>
        <Image
          source={require('../assets/scan_icon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cart}>
        <Image
          source={require('../assets/cart_navbar.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Les éléments seront sur la même ligne
    alignItems: 'center', // Centrer verticalement les éléments
    width: '100%',
    height: 60, // Définir une hauteur pour le conteneur
    position: 'relative' // Positionner correctement les éléments absolus
  },
  text_table: {
    fontFamily: 'Roboto-Regular',
    fontSize: 21,
    marginLeft: 21,
  },
  arrow: {
    marginLeft: 5, // Colle l'icône de la flèche au texte
  },
  scan: {
    position: 'absolute',
    right: 74, // Positionner à 70px de la droite
  },
  cart: {
    position: 'absolute',
    right: 25, // Positionner à 25px de la droite
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default HomeHeader;

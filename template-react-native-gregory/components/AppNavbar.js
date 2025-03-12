import React, { useState, useEffect } from 'react'; // Importation de useEffect
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font'; // Importation de expo-font pour charger les polices
import { useNavigation } from '@react-navigation/native';

const AppNavbar = () => {
  const navigation = useNavigation();
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
      {/* Icône Cart - positionnée à 38px de la gauche */}
      <TouchableOpacity onPress={() => navigation.navigate('')}>
        <Image
          source={require('../assets/cart_navbar.png')} // Chemin vers l'image PNG
          style={[styles.image, styles.cartIcon]}
        />
      </TouchableOpacity>

      {/* Icône Home - 40x40px et centrée */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('../assets/home_icon.png')}
          style={[styles.image, styles.homeIcon]}
        />
      </TouchableOpacity>

      {/* Icône User - positionnée à 38px de la droite */}
      <TouchableOpacity onPress={() => navigation.navigate('UserView')}>
        <Image
          source={require('../assets/user_icon.png')}
          style={[styles.image, styles.userIcon]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Utiliser position absolute pour coller en haut
    bottom: 0, // Aligner à la fin de l'écran
    left: 0, // Alignement horizontal à gauche
    right: 0, // Aligner à droite
    paddingTop: 0, // Espace en haut (si tu veux un peu de marge)
    flexDirection: 'row', // Disposition horizontale
    justifyContent: 'space-between', // Équilibre entre les icônes
    alignItems: 'center', // Alignement vertical des éléments
    paddingHorizontal: 38, // Ajout d'un padding de 38px des bords
    backgroundColor: '#FFFFFF',
    height: 70,
  },
  image: {
    width: 26,  // Largeur par défaut de l'image
    height: 26, // Hauteur par défaut de l'image
  },
  cartIcon: {
    marginLeft: 0, // Icône Cart à 38px de la gauche
  },
  homeIcon: {
    width: 40,  // Largeur de l'icône Home
    height: 40, // Hauteur de l'icône Home
    paddingBottom: 15,
  },
  userIcon: {
    marginRight: 0, // Icône User à 38px de la droite
  },
});

export default AppNavbar;

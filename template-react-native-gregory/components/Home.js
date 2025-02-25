import React, { useState, useEffect } from 'react'; // Importation de useEffect
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Font from 'expo-font'; // Importation de expo-font pour charger les polices
import HomeHeader from './HomeHeader';
import Searchbar from './Searchbar';

const Home = () => {
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      {/* Le header est en haut */}
      <HomeHeader />
      {/* Le texte "Bonjour" est en dessous du header */}
      <Searchbar></Searchbar>
      <Text style={styles.text}>Bonjour</Text>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', // Prendre toute la largeur de l'écran
    backgroundColor: '#EFEFEF', // Fond pour la page home
    justifyContent: 'flex-start', // Aligner le contenu depuis le haut
    alignItems: 'center', // Centrer horizontalement
    paddingTop: 98,
  },
  text: {
    fontSize: 18,
    marginTop: 20, // Espacement entre le texte et le header
  },
});

export default Home;

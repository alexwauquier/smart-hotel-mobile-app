import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font'; 

const DrinkButtons = () => {
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
      {/* Section ALCOHOL */}
      <TouchableOpacity style={styles.buttonContainer} onPress={() => console.log('Alcohol clicked')}>
        <Image 
          source={require('../assets/alcohol_icon.png')} 
          style={styles.icon} 
        />
        <Text style={styles.text}>ALCOHOL</Text>
      </TouchableOpacity>

      {/* Section SOFT */}
      <TouchableOpacity style={styles.buttonContainer} onPress={() => console.log('Soft clicked')}>
        <Image 
          source={require('../assets/soft_icon.png')} 
          style={styles.icon} 
        />
        <Text style={styles.text}>SOFT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',  // Place ALCOHOL et SOFT sur la même ligne
    justifyContent: 'space-around', // Espacement équitable entre les éléments
    alignItems: 'center', 
    width: '100%',
    paddingVertical: 50,
  },
  buttonContainer: {
    flex: 1, // Permet de répartir l'espace équitablement
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 50,
    height: 50,
    position: 'absolute',  // Superpose l'icône sur le texte
    top: -15,  // Ajuste la position de l'icône
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 40,  // Ajoute un espace pour éviter que le texte ne touche l'icône
  }
});

export default DrinkButtons;

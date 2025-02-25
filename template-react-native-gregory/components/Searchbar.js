import React, { useState, useEffect } from 'react'; // Importation de useEffect
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font'; // Importation de expo-font pour charger les polices

const Searchbar = () => {
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
        <TouchableOpacity>
          <Image 
            source={require('../assets/searchicon.png')}
            style={styles.searchIcon} 
          />
        </TouchableOpacity>
        
        {/* Champ de saisie de texte */}
        <TextInput
          style={styles.input}
          placeholder="Search for a drink" // Placeholder qui est actuellement le texte statique
          placeholderTextColor="#929292" // Couleur du texte de placeholder
          editable={true} // Empêche l'édition, tu peux le rendre editable plus tard si tu veux
        />

        <TouchableOpacity>
          <Image
            source={require('../assets/filter.png')}
            style={styles.filterIcon} 
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E2E2E2',
    width: 340,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
  },

  searchIcon: {
    width: 25,
    height: 25,
    marginLeft: 16,
  },

  filterIcon: {
    width: 25,
    height: 25,
    marginRight: 16,
  },

  input: {
    flex: 1, // Permet au champ de prendre la place restante
    color: '#929292',
    fontFamily: 'Roboto-Regular',
    fontSize: 21,
    paddingLeft: 7,
    height: '100%', // S'assure que le champ de texte prend toute la hauteur disponible
  }
});

export default Searchbar;

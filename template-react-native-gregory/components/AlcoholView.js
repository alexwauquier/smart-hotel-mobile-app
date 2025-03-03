import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Text, Keyboard, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font'; 
import AppNavbar from './AppNavbar';
import AppHeader from './AppHeader';
import Alcohol from './Alcohol';

const AlcoholView = ({ navigation }) => {  // Ajout du prop 'navigation'
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf')
    }).then(() => setFontsLoaded(true));
  }, []);

  const handleSwitchToSofts = () => {
    navigation.navigate('SoftsView'); // Change 'SoftsView' par le nom de ton écran de softs
  };

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AppHeader />
        <Alcohol />
        
        {/* Bouton Switch To Softs */}
        <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToSofts}>
          <Text style={styles.switchText}>SWITCH TO SOFTS</Text>
          <Image source={require('../assets/arrow_right.png')} style={styles.arrowIcon} />
        </TouchableOpacity>

        <AppNavbar />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButton: {
    flexDirection: 'row', // Pour aligner le texte et l'image horizontalement
    alignItems: 'center', // Centrer l'image et le texte sur la même ligne
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  switchText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, // Espacement entre le texte et l'image
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
});

export default AlcoholView;

import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

  if (!fontsLoaded) {
    return null; 
  }


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AppHeader></AppHeader>
        <Alcohol></Alcohol>
        <AppNavbar></AppNavbar>
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
});

export default AlcoholView;

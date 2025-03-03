import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Font from 'expo-font'; 
import HomeHeader from './HomeHeader';
import Searchbar from './Searchbar';
import DrinkButtons from './DrinkButtons';

const Home = ({ navigation }) => {  // Ajout du prop navigation
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
        <HomeHeader />
        <Searchbar />
        {/* Passer navigation en prop à DrinkButtons */}
        <DrinkButtons navigation={navigation} />
        <Text style={styles.text}>Bonjour</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#EFEFEF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
  text: {
    fontSize: 18,
    marginTop: 20, 
  },
});

export default Home;

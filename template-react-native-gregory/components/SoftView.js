import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Text, Keyboard, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font'; 
import AppNavbar from './AppNavbar';
import AppHeader from './AppHeader';
import Soft from './Soft';
import { useNavigation } from '@react-navigation/native';

const SoftView = () => {  // Ajout du prop 'navigation'
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
    return null; 
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AppHeader />
        <Soft />
        <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Alcohol')}>
                    <Image source={require('../assets/arrow_left.png')} style={styles.arrowIcon} />
                    <Text style={styles.switchText}>SWITCH TO ALCOHOL</Text>
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
    backgroundColor: '#EFEFEF'
  },
  switchButton: {
    flexDirection: 'row', // Align text and image horizontally
    alignItems: 'center', // Center both elements
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 70,
  },
  switchText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 10, // Space between text and arrow
  },
  arrowIcon: {
    width: 30,
    height: 30,
    tintColor: 'black',
  },
});

export default SoftView;

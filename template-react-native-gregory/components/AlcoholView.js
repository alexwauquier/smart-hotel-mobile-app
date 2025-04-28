import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Text, Keyboard, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font'; 
import AppNavbar from './AppNavbar';
import AppHeader from './AppHeader';
import Alcohol from './Alcohol';
import { useNavigation } from '@react-navigation/native';
import './i18n';
import { useTranslation } from 'react-i18next'

const AlcoholView = () => {  // Ajout du prop 'navigation'
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

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
        <Alcohol />
        <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Soft')}>
                    <Text style={styles.switchText}>{t('switch_soft')}</Text>
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
    marginRight: 10, // Space between text and arrow
  },
  arrowIcon: {
    width: 30,
    height: 30,
    tintColor: 'black',
  },
});

export default AlcoholView;

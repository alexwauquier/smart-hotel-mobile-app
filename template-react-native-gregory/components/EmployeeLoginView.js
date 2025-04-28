import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import * as Font from 'expo-font'; 
import './i18n';
import { useTranslation } from 'react-i18next'
import HeaderLogin from './HeaderLogin';
import EmployeeLoginForm from './EmployeeLoginForm';



const EmployeeLoginView = ({ navigation }) => {  // Ajout du prop 'navigation'
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lastname, setLastname] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
    const { t, i18n } = useTranslation();

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
        <HeaderLogin></HeaderLogin>
        <Text style={styles.Staff}>{t('staff3')}</Text>
        <EmployeeLoginForm></EmployeeLoginForm>
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
  Staff: {
    fontFamily: 'Averia-Serif-Libre-Regular',
    fontSize: 26,
    textDecorationLine: 'underline'
  }
});

export default EmployeeLoginView;

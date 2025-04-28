import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from 'react-native';
import * as Font from 'expo-font'; 
import { useNavigation } from '@react-navigation/native';


const HomeEmployeeBody = () => {  // Ajout du prop 'navigation'
  const [fontsLoaded, setFontsLoaded] = useState(false);
    const navigation = useNavigation();

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
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ProcessOrder')}>
            <Text style={styles.buttonText}>Process a new order</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Button: {
    width: 200,
    height: 150,
    borderColor: '#9F9F9F',
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 150
  },
  buttonText: {
    fontFamily: 'Averia-Serif-Libre-Regular',
    fontSize: 36,
    textAlign: 'center',
  }
});

export default HomeEmployeeBody;

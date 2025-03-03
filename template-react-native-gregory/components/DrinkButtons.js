import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font'; 
import { useNavigation } from '@react-navigation/native';

const DrinkButtons = () => {  // Ajout de navigation en prop
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
    <View style={styles.container}>
      {/* Section ALCOHOL */}
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Alcohol')}>
        <Image 
          source={require('../assets/alcohol_icon.png')} 
          style={styles.icon} 
        />
        <Text style={styles.text}>ALCOHOL</Text>
      </TouchableOpacity>

      {/* Section SOFT */}
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Soft')}>
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
    flexDirection: 'row',  
    justifyContent: 'space-around', 
    alignItems: 'center', 
    width: '100%',
    paddingVertical: 50,
  },
  buttonContainer: {
    flex: 1, 
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 50,
    height: 50,
    position: 'absolute',  
    top: -15,  
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 40,  
  }
});

export default DrinkButtons;

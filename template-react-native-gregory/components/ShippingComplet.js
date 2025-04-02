import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AppHeader from "./AppHeader";
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';


const ShippingComplet = () => {
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
        return null; // Ne rien afficher tant que la police n'est pas chargée
      }

  return (
    <View style={styles.container}>
        <AppHeader />
        <Image source={require("../assets/mark_circle.png")} style={styles.mark} />
        <Text style={styles.success} >Order created successfully ! 
        The waiter will ask for your room number to ensure that you are the correct person to serve. Please make sure to provide it.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require("../assets/back_menu.png")} style={styles.menu} />
        </TouchableOpacity>

        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  mark: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 300,
  },
  success: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 24,
    paddingHorizontal: 17,
    marginTop: 20,
  },
  menu: {
    width: 206,
    height: 48,
    alignSelf: 'center',
    marginTop: 150,
  }
  
});

export default ShippingComplet;

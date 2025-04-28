import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AppHeader from "./AppHeader";
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import './i18n';
import { useTranslation } from 'react-i18next'


const ShippingAdvert = () => {
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
        return null; // Ne rien afficher tant que la police n'est pas chargée
      }

  return (
    <View style={styles.container}>
        <AppHeader />
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
            source={require('../assets/back_arrow.png')} // Chemin vers l'image PNG
            style={styles.image}
        />
        </TouchableOpacity>

        <View style={styles.advert}>
            <Text style={styles.text1}>
                {t('shipping1')}
            </Text>
            <Text style={styles.text2}>
                {t('shipping2')}
            </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CameraScreen')}>
            <Svg height="100%" width="100%" viewBox="0 0 200 100">
                <Defs>
                    <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#30A0BD" />
                        <Stop offset="100%" stopColor="#2F5B77" />
                    </LinearGradient>
                </Defs>
                <Rect
                      x="0"
                      y="0"
                      width="200"
                      height="100"
                      fill="url(#gradient1)"
                      rx="0"
                />
            </Svg>
            <Text style={styles.text}>{t('scan')}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    width: 50,
    height: 30,
    marginTop: 130,
    marginLeft: 20
  },
  advert: {
    backgroundColor: '#FFFFFF',
    borderRadius: 45,
    width: 260,
    height: 234,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50
  },
  text1: {
    width: 160,
    fontSize: 14,
    textAlign: 'center',
  },
  text2: {
    width: 160,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    width: 180,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 100,
    alignSelf: 'center',
  },
  text: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Averia-Serif-Libre-Regular',
    position: 'absolute'
  },
});

export default ShippingAdvert;

import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Font from 'expo-font'; 
import HomeHeader from './HomeHeader';
import DrinkButtons from './DrinkButtons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userId, setUserId] = useState(null);  // 🔹 Ajout d'un état pour stocker l'ID

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf')
    }).then(() => setFontsLoaded(true));

    // 🔹 Récupération de l'ID utilisateur depuis AsyncStorage
    const fetchUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem('userId');
        if (storedId) {
          setUserId(storedId);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
      }
    };

    fetchUserId();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <HomeHeader />
        <DrinkButtons navigation={navigation} />
        <Text style={styles.text}>{userId ? `ID: ${userId}` : 'Chargement...'}</Text> 
        {/* 🔹 Affichage de l'ID ou "Chargement..." si non disponible */}
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

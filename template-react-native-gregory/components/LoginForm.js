import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import * as Font from 'expo-font';  
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {  
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lastName, setLastName] = useState('');
  const [spaceId, setSpaceId] = useState('');

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

  const handleLogin = async () => {
    try {
      console.log('🔹 Valeurs saisies :', { lastName, spaceId });

      // Convertir spaceId en nombre
      const spaceIdInt = parseInt(spaceId, 10);
      if (isNaN(spaceIdInt)) {
        alert('Space ID doit être un nombre valide');
        return;
      }

      const userData = {
        last_name: lastName,  // Correction : Utilisation de lastName avec minuscule
        space_id: spaceIdInt,  // Assurez-vous que space_id est un entier
      };

      console.log('📤 Données envoyées :', userData);

      const response = await fetch(`${process.env.API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📥 Réponse brute :', response);

      const responseData = await response.json();
      console.log('✅ Données reçues :', responseData);

      if (response.ok && responseData.id) {  
        const userId = responseData.id.toString(); 

        await AsyncStorage.setItem('userId', userId);
        navigation.navigate('Home');  
      } else {
        alert(responseData.message || 'Error: Invalid username or password');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.title}>Room Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your room number"
          value={spaceId}
          onChangeText={setSpaceId}
          keyboardType="numeric"  // Permet de forcer l'affichage du clavier numérique
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
              rx="15"
            />
          </Svg>
          <Text style={styles.text}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
    fontFamily: 'Roboto-Condensed-SemiBold', 
    alignSelf: 'flex-start',
    color: '#4B4B4B',
  },
  input: {
    width: 300,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#2F5B77',
    marginBottom: 45,
    fontFamily: 'Roboto-Regular',
  },
  button: {
    width: 180,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 100,
  },
  text: {
    position: 'absolute',
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Averia-Serif-Libre-Regular',
  },
});

export default LoginForm;

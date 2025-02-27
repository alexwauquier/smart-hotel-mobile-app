import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import * as Font from 'expo-font'; 
import * as Crypto from 'expo-crypto';  // ✅ Importation de expo-crypto

const LoginForm = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lastname, setLastname] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

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
      // ✅ Hachage du mot de passe (roomNumber) AVANT envoi avec expo-crypto
      const hashedRoomNumber = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256, 
        roomNumber
      );

      const response = await fetch('http://172.20.10.2:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({
          lastname: lastname,
          roomNumber: hashedRoomNumber, // Envoi la version hachée
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Login successful');
      } else {
        alert(responseData.message || 'Error: Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Lastname</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your lastname"
          value={lastname}
          onChangeText={setLastname}
        />

        <Text style={styles.title}>Room number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your room number"
          secureTextEntry
          value={roomNumber}
          onChangeText={setRoomNumber}
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

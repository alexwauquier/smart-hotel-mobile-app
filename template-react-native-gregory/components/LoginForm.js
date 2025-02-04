import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import * as Font from 'expo-font'; 

const LoginForm = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.16:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Assurez-vous d'indiquer le type JSON ici
        },
        body: JSON.stringify({
          username: username,  // Les données de l'input pour le nom d'utilisateur
          password: password,  // Les données de l'input pour le mot de passe
        }),
      });

      const responseData = await response.json();  // Analyse la réponse en JSON

      if (response.ok) {  // Si la réponse est 200-299, succès
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
        <Text style={styles.title}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          
          <Text style={styles.text}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  title: {
    
  },
  input: {
    
  },
  button: {
    
  },
  text: {
    
  },
});

export default LoginForm;

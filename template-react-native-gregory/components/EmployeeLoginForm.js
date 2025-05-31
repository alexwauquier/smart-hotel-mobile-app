import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import * as Font from 'expo-font';  
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './i18n';
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker';

const EmployeeLoginForm = () => {  
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();
   const [language, setLanguage] = useState(i18n.language);
  
    const handleLanguageChange = (lang) => {
      i18n.changeLanguage(lang);
      setLanguage(lang);
    };
  

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
      console.log('🔹 Valeurs saisies :', { username, password });


      const userData = {
        password: password,
        username: username,
      };

      console.log('📤 Données envoyées :', userData);

      const response = await fetch(`${apiUrl}/api/auth/login/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📥 Réponse brute :', response);

      const responseData = await response.json();
      console.log('✅ Données reçues :', responseData);

      if (response.ok && responseData.data.employee) {
        const employeeId = responseData.data.employee.id.toString();
        const token = responseData.data.token.toString();
      const type_employee = responseData.data.employee.type_id

        await AsyncStorage.setItem('employeeId', employeeId);
        await AsyncStorage.setItem('employeeToken', token);  // Stocke le token
        if (responseData.data.employee.type.id == "SE") {
          navigation.navigate('HomeEmployeeView');
        } else {
          alert("erreur: mauvais type d'employee")
        }
      } else {
        alert(responseData.error || 'Error: Invalid username or password');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('username')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('username')}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.title}>{t('password')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
           
        />

        <Text style={styles.staff} onPress={() => navigation.navigate('LoginView')}>{t('staff2')}</Text>

        <Picker
          selectedValue={language}
          style={styles.picker}
          onValueChange={(itemValue) => handleLanguageChange(itemValue)}
        >
          <Picker.Item label="Français" value="fr" />
          <Picker.Item label="English" value="en" />
        </Picker>

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
          <Text style={styles.text}>{t('login')}</Text>
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
  staff: {
    textDecorationColor: 'black',
    textDecorationLine: "underline",
  },
  picker: {
    height: 40,
    width: 200,
    marginBottom: 50,
  },
});

export default EmployeeLoginForm;

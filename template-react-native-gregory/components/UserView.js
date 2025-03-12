import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment/moment';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import AppHeader from './AppHeader';
import AppNavbar from './AppNavbar';

const UserView = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Récupérer l'ID de l'utilisateur depuis AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        
        if (userId) {
          // Appel API pour récupérer les informations de l'utilisateur
          const response = await fetch(`${process.env.API_URL}/api/customers/${userId}`);
          const data = await response.json();
          console.log("Data received from API:", data); // Affiche la réponse de l'API

          if (response.ok) {
            setUser(data);
          } else {
            setError(data.error || 'Erreur lors de la récupération des données');
          }
        } else {
          setError('Aucun ID utilisateur trouvé');
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération des données');
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Supprimer toutes les données stockées
      navigation.navigate('LoginView'); // Rediriger vers la page de connexion
    } catch (err) {
      console.error('Erreur lors de la déconnexion :', err);
    }
  };

  // Si l'utilisateur est en train de se charger, afficher un indicateur de chargement
  if (!user && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si une erreur s'est produite, afficher un message d'erreur
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Affichage de la date avec moment.js
  const arrivalDate = moment(user.arrivalDate).format('DD-MM-YYYY HH:mm');
  const departureDate = moment(user.departureDate).format('DD-MM-YYYY HH:mm');

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.card}>
        <Text style={styles.title}>User Informations</Text>
        <Text style={styles.text}><Text style={styles.label}>Name :</Text> {user.lastName} {user.firstName}</Text>
        <Text style={styles.text}><Text style={styles.label}>Arrival Date :</Text> {arrivalDate}</Text>
        <Text style={styles.text}><Text style={styles.label}>Departure Date :</Text> {departureDate}</Text>

        {/* Bouton Logout avec dégradé */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Svg height="50" width="200" viewBox="0 0 200 50">
            <Defs>
              <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#30A0BD" />
                <Stop offset="100%" stopColor="#2F5B77" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="200" height="50" fill="url(#gradient1)" rx="10" />
          </Svg>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <AppNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Fond clair pour un rendu élégant
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'AveriaSerifLibre-Bold',
    marginBottom: 15,
    color: '#333',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    fontFamily: 'Roboto_Condensed-SemiBold',
    color: '#222',
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserView;

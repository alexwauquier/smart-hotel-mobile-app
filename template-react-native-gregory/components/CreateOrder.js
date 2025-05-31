import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CreateOrder = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeout;

    const createOrder = async () => {
      console.log('Création de la commande...');
      try {
        const userId = await AsyncStorage.getItem('userId');
        const spaceId = await AsyncStorage.getItem('space_id');
        const cart = await AsyncStorage.getItem('cart');
        const userToken = await AsyncStorage.getItem('userToken');

        console.log('userId:', userId);
        console.log('spaceId:', spaceId);
        console.log('cart:', cart);
        console.log('userToken:', userToken);

        if (!userId || !spaceId || !cart || !userToken) {
          setError('Données manquantes pour créer la commande');
          return;
        }

        const parsedCart = JSON.parse(cart);
        const formattedItems = parsedCart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        }));

        const orderData = {
          customer_id: parseInt(userId, 10),
          space_id: parseInt(spaceId, 10),
          items: formattedItems,
        };

        console.log('Données envoyées à l’API:', orderData);

        const response = await fetch(`${apiUrl}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify(orderData),
        });

        console.log('Response:', response);

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Erreur API:', errorData);
          setError(`Erreur lors de la commande : ${errorData.message || 'Erreur inconnue'}`);
          return;
        }

        const responseData = await response.json();
        console.log('Réponse API:', responseData);

        console.log('Commande envoyée avec succès');
        await AsyncStorage.removeItem('cart');
      } catch (err) {
        console.log('Erreur catch :', err);
        setError(`Erreur inattendue : ${err.message}`);
      } finally {
        timeout = setTimeout(() => {
          setLoading(false);
          if (error) {
            Alert.alert("Erreur", error);
          }
          navigation.navigate('ShippingComplet');
        }, 4000);
      }
    };

    createOrder();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.loadingContainer}>
      {loading && <ActivityIndicator size="large" color="#000" />}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateOrder;
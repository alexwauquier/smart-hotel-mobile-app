import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from './AppHeader';
import AppNavbar from './AppNavbar';
import { useNavigation } from '@react-navigation/native';

const fetchDrinkById = async (id) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await fetch(`https://smart-hotel-api.onrender.com/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson :", error);
    return null;
  }
};

const ShippingResume = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState('');

  const loadCart = async () => {
    const storedCart = await AsyncStorage.getItem('cart');
    if (storedCart) {
      const cartData = JSON.parse(storedCart);
      const drinks = await Promise.all(
        cartData.map(async (item) => {
          const drink = await fetchDrinkById(item.id);
          return drink ? { ...drink, quantity: item.quantity } : null;
        })
      );
      setCartItems(drinks.filter(item => item !== null));
    } else {
      setCartItems([]);
    }
  };

  const fetchUserName = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`https://smart-hotel-api.onrender.com/api/customers/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          });
          console.log(response)
          console.log(userToken)
          const data = await response.json();
          console.log(data)
        if (response.ok) {
          setUserName(data.last_name); // adapte si c’est 'name' ou autre
        } else {
          console.error('Erreur lors de la récupération du nom utilisateur');
        }
      }
    } catch (error) {
      console.error("Erreur lors de la requête de l'utilisateur :", error);
    }
  };

  useEffect(() => {
    loadCart();
    fetchUserName();
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <AppHeader />
      <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
        <Image
          source={require('../assets/back_arrow.png')}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.ViewTitle}>RESUME</Text>

      <FlatList
        style={styles.FlatListCart}
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.drinkContainer}>
            <View style={styles.drinkLineBox}>
              <Text style={styles.drinkTitle}>{item.name}</Text>
              <Text style={styles.textQuantity}>x{item.quantity}</Text>
              <Text style={styles.drinkPrice}>{item.unit_price * item.quantity}€</Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.TotalText}>TOTAL : {total.toFixed(2)}€</Text>
      <Text style={styles.NameText}>Name : {userName} </Text>

      <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
        <Image
          source={require('../assets/validate_order.png')}
          style={styles.button}
        />
      </TouchableOpacity>
      <Text style={styles.charges}>The amount to be paid will be added to your room charges to be settled upon check-out.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  ViewTitle: {
    fontSize: 24,
    fontFamily: 'Averia-Serif-Libre-Regular',
    position: 'absolute',
    alignSelf: 'center',
    top: 135,
  },
  image: {
    width: 50,
    height: 30,
    marginTop: 130,
    marginLeft: 20
  },
  drinkContainer: {
    width: 350,
    height: 50,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  drinkLineBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  drinkTitle: {
    fontSize: 24,
    fontFamily: 'Averia-Serif-Libre-Regular',
    marginRight: 5,
    width: 150,
  },
  drinkPrice: {
    fontSize: 24,
    fontFamily: 'Averia-Serif-Libre-Regular',
    color: '#676767'
  },
  textQuantity: {
    fontFamily: 'Averia-Serif-Libre-Regular',
    fontSize: 16,
    color: '#676767',
  },
  FlatListCart: {
    marginTop: 20,
    marginBottom: 20
  },
  TotalText: {
    marginBottom: 10,
    fontFamily: 'Averia-Serif-Libre-Regular',
    fontSize: 24,
    textAlign: 'center'
  },
  NameText: {
    fontFamily: 'Averia-Serif-Libre-Regular',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40
  },
  button: {
    width: 206,
    height: 48,
    alignSelf: 'center',
    marginBottom: 48
  },
  charges: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: '#676767',
    textAlign: 'center',
    marginBottom: 40,
    marginHorizontal: 20
  }
});

export default ShippingResume;

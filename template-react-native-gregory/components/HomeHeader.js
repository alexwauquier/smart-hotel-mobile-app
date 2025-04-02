import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Searchbar from './Searchbar';

const fetchDrinkById = async (id) => {
  const userToken = await AsyncStorage.getItem('userToken');

  if (!userToken) {
    return null;
  }

  try {
    const response = await fetch(`https://smart-hotel-api.onrender.com/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`, // Correction ici
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API:", errorText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson :", error);
    return null;
  }
};

const HomeHeader = () => {
  const [cart, setCart] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkTokenAndFetchCart = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setTokenLoaded(true);
        fetchCartDetails();
      }
    };

    checkTokenAndFetchCart();
  }, []);

  const fetchCartDetails = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (!cartData) return;

      const cartArray = JSON.parse(cartData);
      setCart(cartArray);

      const drinks = await Promise.all(
        cartArray.map(async (item) => {
          const drink = await fetchDrinkById(item.id);
          return drink ? { ...drink, quantity: item.quantity, totalPrice: drink.unit_price * item.quantity } : null;
        })
      );

      const validDrinks = drinks.filter(Boolean);
      setCartDetails(validDrinks);
      setTotalPrice(validDrinks.reduce((sum, item) => sum + item.totalPrice, 0));
    } catch (error) {
      console.error("Erreur lors de la récupération du panier :", error);
    }
  };

  const openCartModal = async () => {
    if (tokenLoaded) {
      await fetchCartDetails();
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      
      <Searchbar style={styles.searchbar} />

      <TouchableOpacity style={styles.cart} onPress={openCartModal}>
        <Image source={require('../assets/cart_navbar.png')} style={styles.icon} />
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Cart</Text>

            <FlatList
              data={cartDetails}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemDetails}>
                    {item.quantity} x {item.unit_price}$ = {item.totalPrice.toFixed(2)}$
                  </Text>
                </View>
              )}
            />

            <Text style={styles.totalPrice}>Total: {totalPrice.toFixed(2)}$</Text>

            <TouchableOpacity onPress={() => {setModalVisible(false); navigation.navigate('ShippingAdvert') }} style={styles.ValidateButton}>
              <Text style={styles.buttonText}>Validate Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    position: 'relative',
  },
  cart: {
    position: 'absolute',
    right: 25,
    top: 30,
  },
  icon: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cartItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemDetails: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#E2E2E2',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  ValidateButton: {
    backgroundColor: '#4FCC30',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  searchbar: {
    marginLeft: 27,
  },
});

export default HomeHeader;

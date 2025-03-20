import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from './AppHeader';
import AppNavbar from './AppNavbar';

const fetchDrinkById = async (id) => {
  try {
    const response = await fetch(`https://smart-hotel-api.onrender.com/api/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson :", error);
    return null;
  }
};

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (id, operation) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = operation === 'increase' ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity >= 1) {
          item.quantity = newQuantity;
        }
      }
      return item;
    });

    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart.map(({ id, quantity }) => ({ id, quantity }))));
  };

  const removeFromCart = async (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart.map(({ id, quantity }) => ({ id, quantity }))));
  };

  const handleDeleteCart = () => {
    setModalVisible(true); // Afficher la modal de confirmation
  };

  const confirmDeleteCart = async () => {
    setCartItems([]); // Vider le panier
    await AsyncStorage.removeItem('cart'); // Supprimer le panier d'AsyncStorage
    setModalVisible(false); // Fermer la modal
  };

  const cancelDeleteCart = () => {
    setModalVisible(false); // Fermer la modal sans rien faire
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <Text style={styles.ViewTitle}>YOUR CART</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartMessage}>Your cart is empty ! 😔</Text>
      ) : (
        <FlatList
          style={styles.FlatListCart}
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.drinkContainer}>
              <View style={styles.drinkLineBox}>
                <Text style={styles.drinkTitle}>{item.name}</Text>
                <Text style={styles.drinkPrice}>{item.unit_price}€</Text>
                <View style={styles.quantityLine}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
                    <Image source={require('../assets/minus_icon.png')} style={styles.minusIcon} />
                  </TouchableOpacity>
                  <Text style={styles.textQuantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
                    <Image source={require('../assets/plus_icon.png')} style={styles.plusIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.drinkIngredients}>{item.ingredients}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.ButtonLine}>
        <TouchableOpacity>
          <Image source={require('../assets/validate.png')} style={styles.buttonValidate} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteCart}>
          <Image source={require('../assets/trash.png')} style={styles.trashIcon} />
        </TouchableOpacity>
      </View>

      {/* Modal de confirmation */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={cancelDeleteCart}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete your cart?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteCart}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelDeleteCart}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AppNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  ViewTitle: { 
    fontSize: 24, 
    fontFamily: 'Averia-Serif-Libre-Regular', 
    position: 'absolute', 
    top: 140 
  },
  drinkTitle: { 
    fontSize: 18, 
    fontFamily: 'Averia-Serif-Libre-Regular' 
  },
  drinkPrice: { 
    fontSize: 14, 
    fontFamily: 'Averia-Serif-Libre-Regular', 
    color: '#676767' 
  },
  drinkIngredients: { 
    fontSize: 14, 
    fontFamily: 'Roboto-Regular', 
    color: '#676767',
    marginTop: 10,
    marginBottom: 10,
  },
  drinkLineBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  drinkContainer: { 
    width: 300,
    height: 100,
    padding: 10, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 8, 
    marginTop: 20,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  buttonValidate: { 
    width: 206, 
    height: 48, 
    justifyContent: 'center', 
    position: 'relative' 
  },
  trashIcon: { 
    width: 48, 
    height: 48, 
    marginLeft: 38 
  },
  ButtonLine: { 
    flexDirection: 'row', 
    position: 'absolute', 
    bottom: 100 
  },
  minusIcon: { 
    width: 30, 
    height: 30, 
    marginRight: 10, 
    marginLeft: 50 
  },
  plusIcon: { 
    width: 30, 
    height: 30, 
    marginLeft: 10 
  },
  quantityLine: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  textQuantity: { 
    fontFamily: 'Averia-Serif-Libre-Regular', 
    fontSize: 13 
  },
  FlatListCart: {
    marginTop: 200,
  },
  emptyCartMessage: { 
    fontSize: 18, 
    fontFamily: 'Averia-Serif-Libre-Regular', 
    textAlign: 'center', 
    marginTop: 200, 
    color: '#676767' 
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Averia-Serif-Libre-Regular',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Averia-Serif-Libre-Regular',
  },
});

export default CartView;

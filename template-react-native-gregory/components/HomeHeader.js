import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour récupérer les détails d'une boisson via son ID
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

const HomeHeader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState("XXX");
  const [cart, setCart] = useState([]);  
  const [modalVisible, setModalVisible] = useState(false);
  const [cartDetails, setCartDetails] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0); 

  const tableNumbers = ["101", "102", "103", "104", "105"];

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf')
    }).then(() => setFontsLoaded(true));
  }, []);

  // Fonction pour récupérer les données du panier et actualiser l'état
  const fetchCartDetails = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        const cartArray = JSON.parse(cartData);
        setCart(cartArray);  // Met à jour le panier
        const drinkDetails = [];
        let total = 0;

        // Récupérer les détails pour chaque boisson
        for (const item of cartArray) {
          const drinkData = await fetchDrinkById(item.id);
          if (drinkData) {
            const drinkTotal = drinkData.unit_price * item.quantity;
            drinkDetails.push({
              ...drinkData,
              quantity: item.quantity,
              totalPrice: drinkTotal,
            });
            total += drinkTotal;
          }
        }

        setCartDetails(drinkDetails);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du panier :", error);
    }
  };

  const openCartModal = async () => {
    await fetchCartDetails();  // Met à jour le panier chaque fois qu'on ouvre la modal
    setModalVisible(true);  // Ouvre la modal
  };

  const validateCart = () => {
    console.log("Panier validé :", cartDetails);
    setModalVisible(false);
  };

  const emptyCart = async () => {
    await AsyncStorage.removeItem('cart');
    setCart([]);  // Met à jour l'état du panier dans l'interface
    setCartDetails([]);  // Vide également les détails du panier
    setTotalPrice(0);  // Réinitialise le prix total
    console.log("Panier vidé !");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text_table}>Table n°{selectedTable}</Text>

      <TouchableOpacity style={styles.arrow} onPress={() => setIsMenuOpen(!isMenuOpen)}>
        <Image
          source={require('../assets/arrow_table.png')}
          style={[styles.icon, isMenuOpen && styles.iconRotated]}
        />
      </TouchableOpacity>

      {isMenuOpen && (
        <View style={styles.menu}>
          <FlatList
            data={tableNumbers}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSelectedTable(item);
                  setIsMenuOpen(false);
                }}
              >
                <Text style={styles.menuText}>Table n°{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.scan}>
        <Image
          source={require('../assets/scan_icon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.cart} onPress={openCartModal}>
        <Image
          source={require('../assets/cart_navbar.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
                    {item.quantity} x {item.unit_price}$ = {(item.quantity * item.unit_price).toFixed(2)}$
                  </Text>
                </View>
              )}
            />

            <Text style={styles.totalPrice}>Total: {totalPrice.toFixed(2)}$</Text>

            <TouchableOpacity onPress={validateCart} style={styles.validateButton}>
              <Text style={styles.buttonText}>Validate Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={emptyCart} style={styles.emptyButton}>
              <Text style={styles.buttonText}>Empty Cart</Text>
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
    position: 'relative'
  },
  text_table: {
    fontFamily: 'Roboto-Regular',
    fontSize: 21,
    marginLeft: 21,
  },
  arrow: {
    marginLeft: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  scan: {
    position: 'absolute',
    right: 74,
  },
  cart: {
    position: 'absolute',
    right: 25,
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
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
  validateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#E2E2E2',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  emptyButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeHeader;

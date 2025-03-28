import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const fetchDrinkById = async (id) => {
  try {
    const response = await fetch(`https://smart-hotel-api.onrender.com/api/products/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson :", error);
    return null;
  }
};

const HomeHeader = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTable, setScannedTable] = useState("XXX");
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartDetails, setCartDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation();

  // Demander les permissions à la caméra
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    if (cameraPermission?.status !== 'granted') {
      requestCameraPermission();
    } else {
      setHasPermission(true);
    }
  }, [cameraPermission]);

  const handleScanQRCode = () => setIsScanning(true);

  const handleBarCodeScanned = ({ data }) => {
    setScannedTable(data);
    setIsScanning(false);
    alert(`Table scannée : ${data}`);
  };

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

  const removeFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    fetchCartDetails();
  };

  const openCartModal = async () => {
    await fetchCartDetails();
    setModalVisible(true);
  };

  if (hasPermission === null) return <Text>Demande de permission...</Text>;
  if (hasPermission === false) return <Text>Permission caméra refusée</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.text_table}>Table n°{scannedTable}</Text>

      <TouchableOpacity style={styles.scan} onPress={() => navigation.navigate('CameraScreen')}>
        <Image source={require('../assets/scan_icon.png')} style={styles.icon} />
      </TouchableOpacity>

      {isScanning && cameraPermission?.status === 'granted' && (
        <CameraView
          style={styles.camera}
          onBarCodeScanned={handleBarCodeScanned}
        />
      )}

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
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.removeText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <Text style={styles.totalPrice}>Total: {totalPrice.toFixed(2)}$</Text>

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
  text_table: {
    fontSize: 21,
    marginLeft: 21,
  },
  scan: {
    position: 'absolute',
    right: 74,
  },
  cart: {
    position: 'absolute',
    right: 25,
  },
  icon: {
    width: 24,
    height: 24,
  },
  camera: {
    position: 'absolute',  // Assurez-vous que la caméra soit bien en position absolue
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,  // Prendre tout l'espace disponible
    zIndex: 9999,  // Forcer la caméra à être au premier plan
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
  removeText: {
    color: 'red',
    fontSize: 16,
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
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default HomeHeader;

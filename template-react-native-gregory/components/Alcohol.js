import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity, Modal, Animated } from 'react-native';
import * as Font from 'expo-font';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Assure-toi d'importer AsyncStorage

const AlcoholDrinks = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [alcoholDrinks, setAlcoholDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const modalFadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf'),
    }).then(() => setFontsLoaded(true));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Appel API pour récupérer les produits
    const fetchDrinks = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
    
      fetch(`https://smart-hotel-api.onrender.com/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          const drinks = data || [];
          const alcoholic = drinks.filter(drink => drink.contains_alcohol === true);
          setAlcoholDrinks(alcoholic);
        })
        .catch(error => console.error('Erreur lors du fetch des boissons :', error));
    };
  fetchDrinks();    
  }, []);

  const openModal = (drink) => {
    setSelectedDrink(drink);
    setModalVisible(true);
    Animated.timing(modalFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const closeModal = () => {
    Animated.timing(modalFadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setModalVisible(false);
      setSelectedDrink(null);
    });
  };

  const addToCart = async (drinkId) => {
    try {
      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];

      const existingItemIndex = cart.findIndex(item => item.id === drinkId);

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ id: drinkId, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));

      console.log(`✅ Boisson ajoutée au panier : ID ${drinkId}`);
      console.log("🛒 État du panier :", cart);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={[styles.fullScreen, { opacity: fadeAnim }]}>
        <View style={styles.container}>
          <View style={styles.listContainer}>
            <FlatList
              data={alcoholDrinks}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openModal(item)} style={styles.drinkItem}>
                  <Text style={styles.drinkName}>{item.name}</Text>
                  <Text style={styles.drinkIngredients}>Ingrédients : {item.ingredients}</Text>
                  <Text style={styles.drinkPrice}>Prix : {item.unit_price}€</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <Animated.View style={[styles.modalContainer, { opacity: modalFadeAnim }]}>
              <View style={styles.modalContent}>
                {selectedDrink && (
                  <>
                    <Text style={styles.modalTitle}>{selectedDrink.name}</Text>
                    <Text style={styles.modalText}>Ingrédients : {selectedDrink.ingredients}</Text>
                    <Text style={styles.modalText}>Prix : {selectedDrink.unit_price}€</Text>

                    <TouchableOpacity style={styles.button} onPress={() => addToCart(selectedDrink.id)}>
                      <Svg height="50" width="200" viewBox="0 0 200 50">
                        <Defs>
                          <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#30A0BD" />
                            <Stop offset="100%" stopColor="#2F5B77" />
                          </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="200" height="50" fill="url(#gradient1)" rx="10" />
                      </Svg>
                      <Text style={styles.buttonText}>ADD TO CART</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeButtonText}>CLOSE</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Animated.View>
          </Modal>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 80,
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  drinkItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drinkName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drinkIngredients: {
    fontSize: 14,
    color: '#555',
  },
  drinkPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 200,
    height: 50,
    position: 'relative',
  },
  buttonText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Averia-Serif-Libre-Regular',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#d9534f',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Averia-Serif-Libre-Regular',
  },
});

export default AlcoholDrinks;

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, FlatList, Text, Modal, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Searchbar = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drinks, setDrinks] = useState([]); 
  const [filteredDrinks, setFilteredDrinks] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [drinkDetailModalVisible, setDrinkDetailModalVisible] = useState(false); 
  const [addToCartModalVisible, setAddToCartModalVisible] = useState(false); // Nouvelle modale
  const [selectedDrink, setSelectedDrink] = useState(null); 
  const [loading, setLoading] = useState(true); // État pour gérer l'animation de chargement

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  // Fonction pour récupérer les boissons depuis l'API
  const fetchDrinks = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
  
      const response = await fetch(`https://smart-hotel-api.onrender.com/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });
  
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        console.error("Erreur : la réponse de l'API n'est pas un tableau.", data);
        return;
      }
  
      const drinksList = data.map(drink => ({
        ...drink,
        nameUpper: drink.name.toUpperCase(),
        ingredientsUpper: drink.ingredients.toUpperCase(),
      }));
  
      setDrinks(drinksList);
      setFilteredDrinks(drinksList);
    } catch (error) {
      console.error("Erreur lors du fetch des boissons :", error);
    }
  };
  

  // Rechercher les boissons en fonction de la query
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredDrinks(drinks);
      return;
    }

    const results = drinks.filter(drink =>
      drink.nameUpper.includes(searchQuery.toUpperCase()) || 
      drink.ingredientsUpper.includes(searchQuery.toUpperCase())
    );

    setFilteredDrinks(results);
    setModalVisible(true);
  };

  // Fonction pour ouvrir la seconde modale avec les détails de la boisson
  const openDrinkDetails = (drink) => {
    setSelectedDrink(drink);
    setModalVisible(false);
    setDrinkDetailModalVisible(true);
  };

  // Fonction pour ajouter une boisson au panier dans AsyncStorage
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

      // Fermer la modale de détails et ouvrir la modale de confirmation
      setDrinkDetailModalVisible(false);
      setAddToCartModalVisible(true); // Ouvrir la modale de confirmation
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  // Gérer l'animation de chargement avant d'afficher le texte
  useEffect(() => {
    if (addToCartModalVisible) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false); // Afficher le texte après l'animation
      }, 2000); // Durée de l'animation (2 secondes)
    }
  }, [addToCartModalVisible]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSearch}>
          <Image source={require('../assets/searchicon.png')} style={styles.searchIcon} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search for a drink"
          placeholderTextColor="#929292"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity onPress={handleSearch}>
          <Image source={require('../assets/filter.png')} style={styles.filterIcon} />
        </TouchableOpacity>

        {/* Modal pour afficher les boissons filtrées */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={filteredDrinks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => openDrinkDetails(item)}>
                    <View style={styles.drinkItem}>
                      <Text style={styles.drinkName}>{item.name}</Text>
                      <Text style={styles.drinkIngredients}>Ingredients : {item.ingredients}</Text>
                      <Text style={styles.drinkPrice}>Price : {item.unit_price}$</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Seconde modale pour afficher les détails de la boisson sélectionnée */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={drinkDetailModalVisible}
          onRequestClose={() => setDrinkDetailModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalDetailContent}>
              {selectedDrink && (
                <>
                  <Text style={styles.modalTitle}>{selectedDrink.name}</Text>
                  <Text style={styles.modalText}>Ingredients : {selectedDrink.ingredients}</Text>
                  <Text style={styles.modalText}>Price : {selectedDrink.unit_price}$</Text>

                  <TouchableOpacity onPress={() => addToCart(selectedDrink.id)} style={styles.button}>
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

                  <TouchableOpacity onPress={() => setDrinkDetailModalVisible(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Modal pour afficher que la boisson a bien été ajoutée au panier */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={addToCartModalVisible}
          onRequestClose={() => setAddToCartModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#30A0BD" />  // Afficher une animation de chargement
              ) : (
                <Text style={styles.modalTitle}>Drink added successfully!</Text> // Afficher le texte après l'animation
              )}
              <TouchableOpacity onPress={() => setAddToCartModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E2E2E2',
    width: 287,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 27,
    marginTop: 20
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  filterIcon: {
    width: 25,
    height: 25,
  },
  input: {
    flex: 1,
    color: '#929292',
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    paddingLeft: 7,
    height: '100%',
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
  modalDetailContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  drinkItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drinkName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drinkIngredients: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  drinkPrice: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
  },
  closeButton: {
    backgroundColor: '#E2E2E2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
});

export default Searchbar;

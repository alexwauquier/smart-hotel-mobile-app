import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, Image, TouchableOpacity, Modal, Animated } from 'react-native';
import * as Font from 'expo-font';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const Alcohol = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [alcoholicDrinks, setAlcoholicDrinks] = useState([]);
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

    fetch(`${process.env.API_URL}/api/drinks`)
      .then(response => response.json())
      .then(data => setAlcoholicDrinks(data['hydra:member']?.filter(drink => drink.alcoholic === false) || []))
      .catch(error => console.error('Erreur lors du fetch des boissons :', error));
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

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={[styles.fullScreen, { opacity: fadeAnim }]}>
        <View style={styles.container}>
          {/* FlatList with a max height */}
          <View style={styles.listContainer}>
            <FlatList
              data={alcoholicDrinks}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openModal(item)} style={styles.drinkItem}>
                  <Text style={styles.drinkName}>{item.name}</Text>
                  <Text style={styles.drinkIngredients}>Ingrédients : {item.ingredients}</Text>
                  <Text style={styles.drinkPrice}>Prix : {item.price}€</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Modal code */}
          <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <Animated.View style={[styles.modalContainer, { opacity: modalFadeAnim }]}>
              <View style={styles.modalContent}>
                {selectedDrink && (
                  <>
                    <Text style={styles.modalTitle}>{selectedDrink.name}</Text>
                    <Text style={styles.modalText}>Ingrédients : {selectedDrink.ingredients}</Text>
                    <Text style={styles.modalText}>Prix : {selectedDrink.price}€</Text>

                    <TouchableOpacity style={styles.button} onPress={() => console.log('Ajout au panier')}>
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

          {/* Switch Button below the list */}
          <TouchableOpacity style={styles.switchButton} onPress={() => console.log('Switch to Softs')}>
            <Text style={styles.switchText}>SWITCH TO SOFTS</Text>
            <Image source={require('../assets/arrow_right.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
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
    justifyContent: 'space-between', // Ensures button is at the bottom
  },
  listContainer: {
    flex: 1, // This allows the FlatList to take available space
    marginBottom: 20, // Ensures space between list and button
  },
  drinkItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' 
  },
  drinkName: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  drinkIngredients: { 
    fontSize: 14, 
    color: '#555' 
  },
  drinkPrice: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#000' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    width: 300, 
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10
  },
  modalText: { 
    fontSize: 16, 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  button: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
    width: 200, 
    height: 50, 
    position: 'relative' 
  },
  buttonText: { 
    position: 'absolute', 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    fontFamily: 'Averia-Serif-Libre-Regular' 
  },
  closeButton: { 
    marginTop: 15, 
    padding: 10, 
    backgroundColor: '#d9534f', 
    borderRadius: 5 
  },
  closeButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    fontFamily: 'Averia-Serif-Libre-Regular' 
  },
  switchButton: {
    flexDirection: 'row', // Align text and image horizontally
    alignItems: 'center', // Center both elements
    padding: 10,
    backgroundColor: '#30A0BD',
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  switchText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, // Space between text and arrow
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default Alcohol;

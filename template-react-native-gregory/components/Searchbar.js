import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  FlatList,
  Text,
  Modal,
  ActivityIndicator
} from 'react-native';
import * as Font from 'expo-font';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import './i18n';
import { useTranslation } from 'react-i18next'

const Searchbar = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const [filterAlcohol, setFilterAlcohol] = useState(null); // null = tous, true = alcool, false = sans alcool

  const [drinkDetailModalVisible, setDrinkDetailModalVisible] = useState(false);
  const [addToCartModalVisible, setAddToCartModalVisible] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

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

  useEffect(() => {
    fetchDrinks();
  }, []);

  const handleSearch = () => {
    let results = drinks.filter(drink =>
      drink.nameUpper.includes(searchQuery.toUpperCase()) ||
      drink.ingredientsUpper.includes(searchQuery.toUpperCase())
    );
    if (filterAlcohol === true)      results = results.filter(d => d.contains_alcohol);
    else if (filterAlcohol === false) results = results.filter(d => !d.contains_alcohol);
    if (searchQuery.trim() === '' && filterAlcohol === null) results = drinks;
    setFilteredDrinks(results);
    setModalVisible(true);
  };

  const openDrinkDetails = (drink) => {
    setSelectedDrink(drink);
    setModalVisible(false);
    setDrinkDetailModalVisible(true);
  };

  const addToCart = async (drinkId) => {
    try {
      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];
      const idx = cart.findIndex(i => i.id === drinkId);
      if (idx !== -1) cart[idx].quantity += 1;
      else cart.push({ id: drinkId, quantity: 1 });
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      setDrinkDetailModalVisible(false);
      setAddToCartModalVisible(true);
    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout au panier:', err);
    }
  };

  useEffect(() => {
    if (addToCartModalVisible) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    }
  }, [addToCartModalVisible]);

  if (!fontsLoaded) return null;

  const renderRadioOption = (label, value) => (
    <TouchableOpacity
      style={styles.filterOption}
      onPress={() => {
        setFilterAlcohol(value);
        setFilterModalVisible(false);
      }}
    >
      <View style={styles.radioRow}>
        <View style={styles.radioOuter}>
          {filterAlcohol === value && <View style={styles.radioInner} />}
        </View>
        <Text style={[
          styles.filterOptionText,
          filterAlcohol === value && styles.filterOptionTextSelected
        ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSearch}>
          <Image source={require('../assets/searchicon.png')} style={styles.searchIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={t('search_drink')}
          placeholderTextColor="#929292"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Image source={require('../assets/filter.png')} style={styles.filterIcon} />
        </TouchableOpacity>

        {/* Résultats */}
        <Modal animationType="fade" transparent visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={filteredDrinks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => openDrinkDetails(item)}>
                    <View style={styles.drinkItem}>
                      <Text style={styles.drinkName}>{item.name}</Text>
                      <Text style={styles.drinkIngredients}>Ingredients: {item.ingredients}</Text>
                      <Text style={styles.drinkPrice}>{t('price')}: {item.unit_price}€</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Filtre */}
        <Modal animationType="fade" transparent visible={filterModalVisible}>
          <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.filterContent}>
                  <Text style={styles.filterTitle}>{t('filter')}</Text>
                  {renderRadioOption(t('with_alcohol'), true)}
                  {renderRadioOption(t('without_alcohol'), false)}
                  {renderRadioOption(t('doesnt_matter'), null)}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Détail boisson */}
        <Modal animationType="fade" transparent visible={drinkDetailModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalDetailContent}>
              {selectedDrink && (
                <>
                  <Text style={styles.modalTitle}>{selectedDrink.name}</Text>
                  <Text style={styles.modalText}>Ingredients: {selectedDrink.ingredients}</Text>
                  <Text style={styles.modalText}>{t('price')}: {selectedDrink.unit_price}€</Text>
                  <TouchableOpacity onPress={() => addToCart(selectedDrink.id)} style={styles.button}>
                    <Svg height="50" width="240" viewBox="0 0 200 50">
                      <Defs>
                        <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <Stop offset="0%" stopColor="#30A0BD" />
                          <Stop offset="100%" stopColor="#2F5B77" />
                        </LinearGradient>
                      </Defs>
                      <Rect x="0" y="0" width="220" height="50" fill="url(#gradient1)" rx="10" />
                    </Svg>
                    <Text style={styles.buttonText}>{t('add_cart')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDrinkDetailModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Confirmation ajout */}
        <Modal animationType="fade" transparent visible={addToCartModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {loading
                ? <ActivityIndicator size="large" color="#30A0BD" />
                : <Text style={styles.modalTitle}>{t('add_success')}</Text>
              }
              <TouchableOpacity onPress={() => setAddToCartModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
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
    width: 320,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginLeft: 27,
    marginTop: 20
  },
  searchIcon: { width: 24, height: 24 },
  filterIcon: { width: 24, height: 24, marginLeft: 8 },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    elevation: 8,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#DDD',
    paddingVertical: 8,
    borderRadius: 6,
    width: '100%'
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
  },
  filterContent: {
    width: 260,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'stretch',
    elevation: 10,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  filterOption: {
    marginVertical: 6,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#30A0BD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#30A0BD',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  filterOptionTextSelected: {
    fontWeight: 'bold',
    color: '#30A0BD',
  },
  drinkItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  drinkName: { fontSize: 16, fontWeight: '600' },
  drinkIngredients: { fontSize: 14, color: '#666', marginTop: 4 },
  drinkPrice: { fontSize: 14, color: '#666', marginTop: 4 },
  modalDetailContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  modalText: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
  button: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    fontWeight: '600',
    color: '#FFF',
    left: 40,
    top: 13,
    textAlign: 'center',
  },
});

export default Searchbar;

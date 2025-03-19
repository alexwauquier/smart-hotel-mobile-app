import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from './AppHeader';
import AppNavbar from './AppNavbar';

const fetchDrinkById = async (id) => {
  try {
    const response = await fetch(`http://192.168.112.35:3000/api/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson :", error);
    return null;
  }
};

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
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
      }
    };

    loadCart();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader />
      <Text style={styles.ViewTitle}>YOUR CART</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.drinkContainer}>
            <View style={styles.drinkLineBox}>
              <Text style={styles.drinkTitle}>{item.name}</Text>
              <Text style={styles.drinkPrice}>{item.unit_price}€</Text>
              <View style={styles.quantityLine}>
                <TouchableOpacity>
                  <Image source={require('../assets/minus_icon.png')} style={styles.minusIcon} />
                </TouchableOpacity>
                <Text style={styles.textQuantity}>{item.quantity}</Text>
                <TouchableOpacity>
                  <Image source={require('../assets/plus_icon.png')} style={styles.plusIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.drinkIngredients}>{item.ingredients}</Text>
          </View>
        )}
      />

      <View style={styles.ButtonLine}>
        <TouchableOpacity>
          <Image source={require('../assets/validate.png')} style={styles.buttonValidate} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/trash.png')} style={styles.trashIcon} />
        </TouchableOpacity>
      </View>

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
    color: '#676767' 
  },
  drinkLineBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  drinkContainer: { 
    width: '90%', 
    padding: 10, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 8, 
    marginTop: 20 
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
  }
});

export default CartView;

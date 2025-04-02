import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "./AppHeader";
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const fetchDrinkById = async (id) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");

    const response = await fetch(`https://smart-hotel-api.onrender.com/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération de la boisson");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson :", error);
    return null;
  }
};

const fetchUserName = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return null;

    const userToken = await AsyncStorage.getItem("userToken");

    const response = await fetch(`https://smart-hotel-api.onrender.com/api/customers/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
    const userData = await response.json();
    return userData.last_name;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

const ShippingResume = () => {
  const navigation = useNavigation();
  const [drinks, setDrinks] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const name = await fetchUserName();
        if (name) setUserName(name);

        const cartData = await AsyncStorage.getItem("cart");
        if (!cartData) return;

        const cart = JSON.parse(cartData);
        
        const drinkDetails = await Promise.all(
          cart.map(async (item) => {
            const drink = await fetchDrinkById(item.id);
            return drink ? { ...drink, quantity: item.quantity, totalPrice: item.quantity * drink.unit_price } : null;
          })
        );

        const filteredDrinks = drinkDetails.filter(Boolean);
        setDrinks(filteredDrinks);

        // Calcul du prix total à payer
        const total = filteredDrinks.reduce((sum, drink) => sum + drink.totalPrice, 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.headerContainer}>
        <Text style={styles.resume}>RESUME</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ShippingAdvert")}>
          <Image source={require("../assets/back_arrow.png")} style={styles.image} />
        </TouchableOpacity>
      </View>


      <FlatList
      style={styles.flatlist}
      data={drinks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
          <View style={styles.drinkRow}>
            <Text style={styles.drinkText}>{item.name}</Text>
            <Text style={styles.drinkText}>x{item.quantity}</Text>
            <Text style={styles.drinkText}>{item.totalPrice.toFixed(2)}€</Text>
          </View>
        )}
        />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>TOTAL : {totalPrice.toFixed(2)}€</Text>
        {userName ? <Text style={styles.userName}>Name : {userName}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('ShippingComplet')}>
            <Image source={require("../assets/validate_order_button.png")} style={styles.button}/>
        </TouchableOpacity>
        <Text style={styles.charges}>The amout to be paid will be added to your room charges to be settled upon check-out.</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    flexDirection: 'column',
  },
  image: {
    width: 50,
    height: 30,
    marginLeft: 20,
    zIndex: 1000,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 130,
    zIndex: 1

  },
  resume: {
    fontFamily: "Averia-Serif-Libre-Regular",
    fontSize: 24,
    textAlign: "center",
    position: "absolute",
    width: "100%",
  },
  userName: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
    fontFamily: 'Averia-Serif-Libre-Regular',
    marginBottom: 40
  },
  drinkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drinkText: {
    fontSize: 18,
    fontFamily: "Averia-Serif-Libre-Regular",
  },
  totalContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
    borderTopColor: '#000',
    borderTopWidth: 2,
  },
  totalText: {
    fontSize: 24,
    fontFamily: "Averia-Serif-Libre-Regular",
  },
  flatlist: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  button: {
    width: 206,
    height: 48,
    marginBottom: 50,
  },
  charges: {
    textAlign: 'center',
    paddingHorizontal: 21,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: "#676767"
  }
});

export default ShippingResume;

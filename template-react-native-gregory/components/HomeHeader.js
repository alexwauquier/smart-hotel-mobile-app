import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import * as Font from 'expo-font'; 

const HomeHeader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour afficher/masquer le menu
  const [selectedTable, setSelectedTable] = useState("XXX"); // Numéro de table sélectionné

  // Liste fictive des numéros de table
  const tableNumbers = ["101", "102", "103", "104", "105"];

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf')
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Ne rien afficher tant que la police n'est pas chargée
  }

  return (
    <View style={styles.container}>
      {/* Texte affichant la table sélectionnée */}
      <Text style={styles.text_table}>Table n°{selectedTable}</Text>
      
      {/* Flèche cliquable pour ouvrir/fermer le menu */}
      <TouchableOpacity style={styles.arrow} onPress={() => setIsMenuOpen(!isMenuOpen)}>
        <Image 
          source={require('../assets/arrow_table.png')} 
          style={[styles.icon, isMenuOpen && styles.iconRotated]} // Rotation si ouvert
        />
      </TouchableOpacity>

      {/* Menu déroulant affiché conditionnellement */}
      {isMenuOpen && (
        <View style={styles.menu}>
          <FlatList
            data={tableNumbers}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setSelectedTable(item); // Mettre à jour la table sélectionnée
                  setIsMenuOpen(false);  // Fermer le menu
                }}
              >
                <Text style={styles.menuText}>Table n°{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Icône scan */}
      <TouchableOpacity style={styles.scan}>
        <Image
          source={require('../assets/scan_icon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Icône panier */}
      <TouchableOpacity style={styles.cart}>
        <Image
          source={require('../assets/cart_navbar.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
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
    transform: [{ rotate: '180deg' }], // Rotation quand le menu est ouvert
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
});

export default HomeHeader;

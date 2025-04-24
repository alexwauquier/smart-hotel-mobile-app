import React, {} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AppHeader from './AppHeader';
import { useNavigation } from '@react-navigation/native';


const ShippingComplet = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppHeader />


      <Image
                source={require('../assets/mark_circle.png')}
                style={styles.Image}
      />


      <Text style={styles.Text}>
        Order created successfully ! 
      </Text>
      <Text style={styles.Text2}>
        The waiter will ask for your room number to ensure that you are the correct person to serve. Please make sure to provide it.
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
                source={require('../assets/back_menu.png')}
                style={styles.button}
        />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  Text: {
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    width: 360,
    alignSelf: 'center',
  },
  Text2: {
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    width: 360,
    alignSelf: 'center',
  },
  Image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 200
  },
  button: {
    width: 206,
    height: 48,
    alignSelf: 'center',
    marginTop: 150
  }
});

export default ShippingComplet;

import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AppHeader from './AppHeader';
import { useNavigation } from '@react-navigation/native';
import './i18n';
import { useTranslation } from 'react-i18next'


const ShippingComplet = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);


  const imageSource = language == 'fr' ? require('../assets/back_menu_fr.png') : require('../assets/back_menu.png');
  return (
    <View style={styles.container}>
      <AppHeader />


      <Image
                source={require('../assets/mark_circle.png')}
                style={styles.Image}
      />


      <Text style={styles.Text}>
        {t('order_success1')} 
      </Text>
      <Text style={styles.Text2}>
        {t('order_success2')}
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
                source={imageSource}
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

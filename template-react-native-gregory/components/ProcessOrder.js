import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from './AppHeader';

const ProcessOrder = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [customerRoomNumber, setCustomerRoomNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  const fetchOrder = async () => {
    try {
      const employeeToken = await AsyncStorage.getItem('employeeToken');
      const response = await fetch('https://smart-hotel-api.onrender.com/api/orders?limit=1&status_id=RE', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${employeeToken}`,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        const firstOrder = data[0];
        setOrder(firstOrder);
        fetchCustomerName(firstOrder.customer_id, employeeToken);
        fetchSpaceName(firstOrder.space_id, employeeToken);
      } else {
        setOrder(null);
        setCustomerName('');
        setSpaceName('');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      Alert.alert('Erreur lors de la récupération de la commande');
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchCustomerName = async (customerId, token) => {
    try {
      const response = await fetch(`https://smart-hotel-api.onrender.com/api/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data && data.last_name) {
        setCustomerName(data.last_name);
        setCustomerRoomNumber(data.space_id?.toString() || '');
        console.log(customerRoomNumber);
      } else {
        setCustomerName('Nom inconnu');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      setCustomerName('Erreur');
    }
  };

  const fetchSpaceName = async (spaceId, token) => {
    try {
      const response = await fetch(`https://smart-hotel-api.onrender.com/api/spaces/${spaceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data && data.name) {
        setSpaceName(data.name);
      } else {
        setSpaceName('Nom inconnu');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'espace:', error);
      setSpaceName('Erreur');
    }
  };

  const handleOrderCompletion = async () => {
    if (roomNumber.trim() === customerRoomNumber.trim()) {
      try {
        const employeeToken = await AsyncStorage.getItem('employeeToken');
        await fetch(`https://smart-hotel-api.onrender.com/api/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${employeeToken}`,
          },
          body: JSON.stringify({ status: 'SE' }),
        });

        Alert.alert('Commande livrée');
        setModalVisible(false);
        fetchOrder();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        Alert.alert("Échec de la mise à jour de la commande");
      }
    } else {
      Alert.alert('Mauvaise personne');
      setModalVisible(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.content}>
          {order ? (
            <View style={styles.orderSummary}>
              <Text style={styles.orderTitle}>Résumé de la commande</Text>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Client :</Text>
                <Text style={styles.value}>{customerName}</Text>
              </View>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Lieu :</Text>
                <Text style={styles.value}>{spaceName}, table n°{order.space_id}</Text>
              </View>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Date :</Text>
                <Text style={styles.value}>{new Date(order.date).toLocaleString()}</Text>
              </View>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Commande n° :</Text>
                <Text style={styles.value}>{order.id}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noOrderText}>Aucune commande prête</Text>
          )}

          <TouchableOpacity style={styles.Button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>COMPLET ORDER</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Room Number</Text>
              <TextInput
                style={styles.roomInput}
                placeholder="Room Number"
                value={roomNumber}
                onChangeText={setRoomNumber}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleOrderCompletion}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  Button: {
    marginTop: 30,
    backgroundColor: '#30A0BD',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Averia-Serif-Libre-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontFamily: 'Averia-Serif-Libre-Bold',
    fontSize: 22,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  orderDetail: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    width: 120,
  },
  value: {
    flex: 1,
    color: '#333',
  },
  noOrderText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 320,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  roomInput: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#30A0BD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProcessOrder;

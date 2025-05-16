import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';

import AppHeader from './AppHeader';

const ProcessOrder = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [customerRoomNumber, setCustomerRoomNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const intervalRef = useRef(null);
  const navigation = useNavigation();

  const playNotificationSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/notification.mp3')
    );
    await sound.playAsync();
  };

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  const updateEmployee = async (orderId) => {
    try {
      const employeeToken = await AsyncStorage.getItem('employeeToken');
      const employeeId    = await AsyncStorage.getItem('employeeId');

      const res = await fetch(
        `https://smart-hotel-api.onrender.com/api/orders/${orderId}/employee`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${employeeToken}`,
          },
          body: JSON.stringify({ employee_id: employeeId }),
        }
      );
      const data2 = await res.json();
    } catch (error) {
      console.error('Erreur lors de la maj de l\'employee de commande', error);
    }
  };

  const fetchOrder = async () => {
    try {
      const employeeToken = await AsyncStorage.getItem('employeeToken');
      const res = await fetch(
        `https://smart-hotel-api.onrender.com/api/orders?limit=1&status_id=RE&employee_id=null`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${employeeToken}`,
          },
        }
      );
      const data = await res.json();

      if (data.success === false) {
        setIsWaiting(true);
        startPolling();
      } else if (Array.isArray(data.data.orders) && data.data.orders.length > 0) {
        const firstOrder = data.data.orders[0];

        setOrder(firstOrder);
        // tout de suite après, on patch l'employee
        updateEmployee(firstOrder.id);

        setCustomerName(firstOrder.customer.first_name);
        setSpaceName(firstOrder.space.name);
        setCustomerRoomNumber(firstOrder.customer.space_id);
        setIsWaiting(false);
      } else {
        setIsWaiting(true);
        startPolling();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      Alert.alert('Erreur de connexion');
    }
  };

  const startPolling = () => {
    intervalRef.current = setInterval(async () => {
      try {
        const employeeToken = await AsyncStorage.getItem('employeeToken');
        const res = await fetch(
          `https://smart-hotel-api.onrender.com/api/orders?limit=1&status_id=RE&employee_id=null`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${employeeToken}`,
            },
          }
        );
        const data = await res.json();

        if (data.success === false) {
          setIsWaiting(true);
          return;
        }

        if (Array.isArray(data.data.orders) && data.data.orders.length > 0) {
          clearInterval(intervalRef.current);
          setIsWaiting(false);
          const firstOrder = data.data.orders[0];

          setOrder(firstOrder);
          // patch après setOrder
          updateEmployee(firstOrder.id);

          Vibration.vibrate(500);
          playNotificationSound();
          setCustomerName(firstOrder.customer.first_name);
          setSpaceName(firstOrder.space.name);
          setCustomerRoomNumber(firstOrder.customer.space_id);
        }
      } catch (error) {
        console.error('Erreur de polling:', error);
      }
    }, 10000);
  };

  const cancelPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsWaiting(false);
    navigation.navigate('HomeEmployeeView');
  };

  useEffect(() => {
    fetchOrder();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleOrderCompletion = async () => {
    if (roomNumber == customerRoomNumber) {
      try {
        const employeeToken = await AsyncStorage.getItem('employeeToken');
        const response = await fetch(
          `https://smart-hotel-api.onrender.com/api/orders/${order.id}/status`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${employeeToken}`,
            },
            body: JSON.stringify({ status_id: 'SE' }),
          }
        );


        if (!response.ok) {
          Alert.alert('Échec de la mise à jour de la commande');
          return;
        }

        Alert.alert('Commande livrée');
        setModalVisible(false);
        navigation.navigate('AfterProcessView');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        Alert.alert('Échec de la mise à jour de la commande');
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
          {isWaiting ? (
            <>
              <ActivityIndicator size="large" color="#30A0BD" />
              <Text style={styles.noOrderText}>
                En attente d'une commande prête...
              </Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelPolling}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </>
          ) : order ? (
            <View style={styles.orderSummary}>
              <Text style={styles.orderTitle}>Résumé de la commande</Text>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Client :</Text>
                <Text style={styles.value}>{customerName}</Text>
              </View>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Lieu :</Text>
                <Text style={styles.value}>
                  {spaceName}, table n°{order.space.id}
                </Text>
              </View>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Date :</Text>
                <Text style={styles.value}>
                  {new Date(order.date).toLocaleString()}
                </Text>
              </View>
              <View style={styles.orderDetail}>
                <Text style={styles.label}>Commande n° :</Text>
                <Text style={styles.value}>{order.id}</Text>
              </View>
              <TouchableOpacity
                style={styles.Button}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>COMPLET ORDER</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noOrderText}>Chargement...</Text>
          )}
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
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleOrderCompletion}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
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
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Averia-Serif-Libre-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  orderSummary: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
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
    marginTop: 30,
    fontSize: 18,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 14,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  roomInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#30A0BD',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#30A0BD',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProcessOrder;

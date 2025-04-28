import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import * as Font from 'expo-font'; 
import { useNavigation } from '@react-navigation/native';
import AppHeader from './AppHeader';

const ProcessOrder = () => {  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    Font.loadAsync({
      'Averia-Serif-Libre-Regular': require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
      'Averia-Serif-Libre-Bold': require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Condensed-SemiBold': require('../assets/fonts/Roboto_Condensed-SemiBold.ttf')
    }).then(() => setFontsLoaded(true));
  }, []);

  const handleOrderCompletion = () => {
    console.log('Room number:', roomNumber); // Traitement du room number
    setModalVisible(false); // Ferme la modal après soumission
  };

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AppHeader />
        
        <TouchableOpacity style={styles.Button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>COMPLET ORDER</Text>
        </TouchableOpacity>

        {/* Modal pour saisir le room number */}
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
    justifyContent: 'center',
  },
  Button: {
    width: 400,
    height: 120,
    borderColor: '#9F9F9F',
    borderWidth: 2,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Averia-Serif-Libre-Regular',
    fontSize: 36,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  roomInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#30A0BD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#E2E2E2',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
});

export default ProcessOrder;

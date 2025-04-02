import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Test = ({ navigation }) => {  // Ajout du prop 'navigation'
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzQzNTc3NjIxLCJleHAiOjE3NDM1ODQ4MjF9.7nDWMSmmE6ubk8NC-Mu_vLClbpubtOkJZisVK9-PLPs");

const graphql = JSON.stringify({
  query: "",
  variables: {}
})
const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: graphql,
  redirect: "follow"
};

fetch("https://smart-hotel-api.onrender.com/api/products", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>

        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Test;

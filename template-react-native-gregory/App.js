import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginView from './components/LoginView';
import HomeView from './components/HomeView';
import AlcoholView from './components/AlcoholView';
import SoftView from './components/SoftView';



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="LoginView" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="LoginView" component={LoginView} />
        <Stack.Screen name ="Home" component={HomeView} />
        <Stack.Screen name="Alcohol" component={AlcoholView} />
        <Stack.Screen name="Soft" component={SoftView} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});


export default App;
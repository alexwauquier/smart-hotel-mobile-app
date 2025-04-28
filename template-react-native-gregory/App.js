import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginView from './components/LoginView';
import HomeView from './components/HomeView';
import AlcoholView from './components/AlcoholView';
import SoftView from './components/SoftView';
import CartView from './components/CartView';
import UserView from './components/UserView';
import TableQRCode from './components/QrCodeGenerator';
import CameraScreen from './components/CameraScreen';
import ShippingAdvert from './components/ShippingAdvert';
import ShippingResume from './components/ShippingResume';
import ShippingComplet from './components/ShippingComplet';
import CreateOrder from './components/CreateOrder';

import HomeEmployeeView from './components/HomeEmployeeView';
import EmployeeLoginView from './components/EmployeeLoginView';
import ProcessOrder from './components/ProcessOrder';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="LoginView" screenOptions={{ headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="LoginView" component={LoginView} />
        <Stack.Screen name ="Home" component={HomeView} />
        <Stack.Screen name="Alcohol" component={AlcoholView} />
        <Stack.Screen name="Soft" component={SoftView} />
        <Stack.Screen name="UserView" component={UserView} />
        <Stack.Screen name="CartView" component={CartView} />
        <Stack.Screen name="TableQRCode" component={TableQRCode} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ShippingAdvert" component={ShippingAdvert} />
        <Stack.Screen name="ShippingResume" component={ShippingResume} />
        <Stack.Screen name="ShippingComplet" component={ShippingComplet} />
        <Stack.Screen name="CreateOrder" component={CreateOrder} />

        <Stack.Screen name="EmployeeLoginView" component={EmployeeLoginView} />
        <Stack.Screen name="HomeEmployeeView" component={HomeEmployeeView} />
        <Stack.Screen name="ProcessOrder" component={ProcessOrder} />


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
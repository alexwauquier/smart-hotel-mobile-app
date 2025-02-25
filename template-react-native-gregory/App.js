import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm';
import HeaderLogin from './components/HeaderLogin';
import AppHeader from './components/AppHeader';
import Home from './components/Home';
import AppNavbar from './components/AppNavbar';

export default function App() {
  return (
    <View style={styles.container}>
      <AppHeader></AppHeader>
      <Home></Home>
      <AppNavbar></AppNavbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

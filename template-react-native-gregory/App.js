import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm';
import HeaderLogin from './components/HeaderLogin';

export default function App() {
  return (
    <View style={styles.container}>
      <HeaderLogin></HeaderLogin>
      <LoginForm></LoginForm>
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

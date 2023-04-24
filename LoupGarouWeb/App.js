import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LockScreen from './components/LockScreen.js';

export default function App() {
  return (
    <View style={styles.container}>
      <LockScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#371b58',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

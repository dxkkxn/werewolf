import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LockScreen from './components/LockScreen.js';
import {AvailableGame} from './components/AvailableGame.js'

export default function App() {
  const params = {
    nbWolves: '3',
    nbPlayersMin: '9',
    probaC: '0.3',
    probaI: '0.2',
    probaV: '0',
    probaS: '.7',
    dayStart: '8',
    dayEnd: '22'
  };
  return (
    <View style={styles.container}>
      <AvailableGame avatarId='1' gameParams={params} creatorPseudo="notawolf"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#371b58',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { MainNavigator } from './components/MainNavigator';
import LockScreen from './components/LockScreen.js';
import {useEffect} from 'react';
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#371b58',
  },
};

export default function App() {
  // useEffect(() => {
  //   document.body.style.display='display-flex';
  // });
  // const gameProps = {
  //   hoursToStart: '5',
  //   nbWolves: '3',
  //   nbPlayersMin: '9',
  //   probaC: '0.3',
  //   probaI: '0.2',
  //   probaV: '0',
  //   probaS: '.7',
  //   dayStart: '8',
  //   dayEnd: '22',
  //   avatarId:'4',
  //   creatorPseudo:"notawolf",
  // };
  return (
    // <View style={styles.container}>
    //   <LockScreen />
    // </View>
    <View style={styles.container}>
      <NavigationContainer style={styles.navContainer} theme={MyTheme} >
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#371b58',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  navContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



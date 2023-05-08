import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import {AvailableGame} from './AvailableGame.js'

const availableGames = (propsArray) => {
  return(
    propsArray.map((game, index) => {
      return (<AvailableGame key={index} gameProps={game} />);
  }));
};
export default function Join(){
  //expects an array of props to pass to AvailableGame
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
  <View style={styles.container}>
    <Text style={styles.title}> Rejoindre une partie </Text>
    <View style={styles.container}>
      {availableGames(propsArray)}
    </View>
  </View>
  );
};


const styles = StyleSheet.create({
  title: {
    margin: 18,
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Poppins'
  },
  container: {
    display: 'flex',
    width: '100%',
    flex:1,
    height: '90%',
    backgroundColor: '#371b58',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

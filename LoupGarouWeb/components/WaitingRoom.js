import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useState} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
const url = `http://${window.location.hostname}:3000`;


export default function WaitingRoom({ route }) {
  const navigation = useNavigation();
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  const username = route.params.username;
  const idGame = route.params.idGame;
  const token = route.params.token;


  const testStarted = async (interval) => {
    try{
      const data = await fetch(`${url}/game/${idGame}` ,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
      });
      if(!data.ok) {
        console.log('failed when fetching state of game');
      }
      else {
        const response = await data.json();
          if(JSON.parse(response.data).started) {
            navigation.navigate('Partie', {idGame, username, token});
            clearInterval(interval);
          }
      }
    } catch(error) {
      console.log(error);
    }
  };

  const interval = setInterval(()=>{testStarted(interval);}, 1000);
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Waiting for game {idGame} to start...</Text>
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
    top: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Poppins'
  },
})

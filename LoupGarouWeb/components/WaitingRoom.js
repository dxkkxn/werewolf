import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useState} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import ClickableImage from './ClickableImage';
const leftArrow = require("../assets/images/leftArrow.png");

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
      <View style={styles.header}>
        <ClickableImage
          source={leftArrow}
          onPress={() => navigation.navigate('Join', {username: username, token : token})}
          symbol={"leftArrow"}
        />
      </View>
      <View style={styles.textContainer}>
			  <Text style={styles.title}>Salle d'attente de la partie {idGame}</Text>
      </View>
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  textContainer: {
    height: "90%",
    alignItems: 'center',
    justifyContent: "center",
    textAlign: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Poppins'
  },
  header: {
    height: "10%",
    justifyContent: 'center',
    marginLeft: 20,
  }
})

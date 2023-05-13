import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useEffect, useState} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import Card from './Card.js';
const url = `http://${window.location.hostname}:3000`

const ruler = require("../assets/ruler&pen.svg");
const add = require("../assets/add-circle.svg");

export default function Welcome({ route }) {
  const navigation = useNavigation();
  const username = route.params.username;
  const token = route.params.token;
  
  // if user is waiting for a game to start, redirect him to waiting room
  useEffect( () => {
    async function fetchGames() {
      try{
        const data = await fetch(`${url}/game` ,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });
        if (!data.ok) {
          // something went wrong => disconnect user
          navigation.navigate('LockScreen');
        }
        else {
          const response = await data.json();
          for (const game of JSON.parse(response.data)){
            if(game.players.includes(username)){
              navigation.navigate('WaitingRoom', {idGame: game.idGame, username, token});
            }
          }
        }
      } catch(error) {
        console.log(error);
      }
    };
    fetchGames();
  }, [] );

  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bonjour {username}</Text>
      <Card icon={ruler} text="Créer une partie" onPress={()=>navigation.navigate('Form', {username : username, token: token})}/>
      <Card icon={add} text="Consulter les parties" onPress={()=>navigation.navigate('Join', {username: username, token : token})} />
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

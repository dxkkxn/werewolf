import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useState,useEffect} from 'react';
import { MyButton } from "./MyButton.js";
import {AvailableGame} from './AvailableGame.js'
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
const url = `http://${window.location.hostname}:3000`;


export default function WaitingRoom({ route }) {
  const [Creator, setCreator] = useState(null);
  const [gameData, setgameData] = useState(null);
  const [currentPlayers, setcurrentPlayers] = useState(0);
  const navigation = useNavigation();
  const username = route.params.username;
  const idGame = route.params.idGame;
  const token = route.params.token;


  const fetchGame = async (idGame) => {
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
        return null;
      }
      else {
        const response = await data.json();
        setCreator(JSON.parse(response.data).creatorUsername);
        const gameData = JSON.parse(response.data);
        setgameData(gameData)
        // setInterval(() => testStarted(gameData), 1000); 
        return gameData;
      }
    } catch(error) {
      console.log(error);
      return null;
    }
  };
  useEffect(() => {
    fetchGame(idGame);
  }, []);



  
  useEffect(() => {
    const interval = setInterval(() => testStarted(interval), 1000);
    testStarted(interval);
  }, []);
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
        return null;
      }
      else {
        const response = await data.json();
        setCreator(JSON.parse(response.data).creatorUsername);
        const gameData = JSON.parse(response.data);
        setgameData(gameData)
        setcurrentPlayers(gameData.players.length)
        if(gameData.started) {
          navigation.navigate('Partie', {idGame, username, token});
          clearInterval(interval);
        }
      }
    } catch(error) {
      console.log(error);
      return null;
    }
    
    
  };
  const onPress = ()=>{startGame(idGame, username)};
  
  
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  
 

  const startGame = (idGame, username) => {
    fetch(`${url}/game/${idGame}/play` ,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then(data => {
      if(data.ok){
        console.log(JSON.parse(response.data).creatorUsername)
      }
      else if(data.status == 403){
        alert('cette partie a déjà commencé !');
      }
      else {
        alert('erreur interne');
      }
    })
    .catch(error => console.error(error));

    navigation.navigate('Partie', {idGame, username, token}); 
  };
  
  
  
	return (
		<View style={styles.container}>
      {Creator==username ? (
        <View style={styles.innerContainer}>
        <AvailableGame username={username} token={token} gameProps={gameData} />
        <Text style={styles.title}>Joueurs actuels : {currentPlayers} </Text>
        {currentPlayers < gameData.minPlayers ? (
        <MyButton  label="Attente de joueurs .." primary={"createButton"}/>
          ) : currentPlayers < gameData.maxPlayers ? (
        <MyButton  label="Commencer" primary={"startButton"} onPress={onPress} />
          ) : (
        <MyButton  label="Commencer" primary={"startButton"} onPress={() => onPress()} />
        )}

        </View>
      ) : (
      <View>
        <View style={styles.innerContainer}>
        <Text style={styles.title}>Waiting for game {idGame} to start...</Text>
        </View>
      </View>
        )}
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
    top: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Poppins'
  },
  
})

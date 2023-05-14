import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useState,useEffect} from 'react';
import { MyButton } from "./MyButton.js";
import {AvailableGame} from './AvailableGame.js'
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import ClickableImage from './ClickableImage';
const leftArrow = require("../assets/images/leftArrow.png");

const url = `http://${window.location.hostname}:3000`;


export default function WaitingRoom({ route }) {
  const [Creator, setCreator] = useState(null);
  const [gameData, setgameData] = useState(null);
  const [currentPlayers, setcurrentPlayers] = useState(0);
  const navigation = useNavigation();
  const username = route.params.username;
  const idGame = route.params.idGame;
  const token = route.params.token;
  const [timeDebut, setTimeDebut] = useState(10);
  const [countDown, setCountDown] = useState(false);
  const moment = require('moment');
  const currentDate = moment();
  const [remainingTime, setRemainingTime] = useState(moment.duration(moment(currentDate).diff(moment(currentDate))));

  


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


  useEffect(() => {
    if(countDown){
      let count = 10;
      const interval = setInterval(() => {
      count--;
      setTimeDebut(count);
      if (count === 0) {
        clearInterval(interval);
      }
    }, 1000);
  
    return () => clearInterval(interval);
    }
  }, [countDown]);
  


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
        const remaining = moment.duration(moment(gameData.startingDate).diff(moment(moment())))
        setRemainingTime(remaining)
        if(gameData.started) {
          navigation.navigate('Partie', {idGame, username, token});
          clearInterval(interval);
        }    
        else if (gameData.players.length === gameData.maxPlayers || remaining.asSeconds()<0) {
          setCountDown(true);
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
        navigation.navigate('Partie', {idGame, username, token});
      }
      else if(data.status == 403){
        alert('cette partie a déjà commencé !');
      }
      else {
        alert('erreur interne');
      }
    })
    .catch(error => console.error(error)); 
  };
  
  
	return (
    
		<View >
      {Creator==username ? (
        <View >
          <View style={styles.headerContainer}>
            <View style={styles.header}>
            <ClickableImage
            source={leftArrow}
            onPress={() => navigation.navigate('Join', {username: username, token : token})}
            symbol={"leftArrow"}
            />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Partie {idGame} </Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <AvailableGame username={username} token={token} gameProps={gameData} />
            <Text style={styles.title}>Joueurs actuels : {currentPlayers} </Text>
            {currentPlayers < gameData.minPlayers && remainingTime.asSeconds()>=0 ? (
            <MyButton  label="Attente de joueurs .." primary={"createButton"}/>  
            ) : currentPlayers < gameData.maxPlayers && remainingTime.asSeconds()>=0? (
            <MyButton  label="Commencer" primary={"startButton"} onPress={onPress} />
            ) : gameData.started === false ?(
            <View>
              <Text style={styles.title}>La partie commence dans : {timeDebut} </Text>
              {timeDebut == 0 ? (
              <View>
                {onPress()}
              </View>
              )
              : null}
            </View>
            ):null }
          </View>
        </View>
      ) : (
        <View style={styles.textContainer}>
        <Text style={styles.title}>Salle d'attente de la partie {idGame}</Text>
        <Text style={styles.title}>Joueurs actuels : {currentPlayers} </Text>
        </View>
        )}
		</View>
	);
}
const styles = StyleSheet.create({


  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    position: 'absolute',
    left: '40%',
    zIndex: 1,
  },
  titleContainer: {
    textAlign:'center',
  },
  innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 130,
  },
  textContainer: {
    height: "90%",
    alignItems: 'center',
    justifyContent: "center",
    textAlign: 'center',
    paddingTop: 300,
  },

  title: {
          color: '#ffffff',
          fontSize: 28,
          fontFamily: 'Poppins',
          paddingLeft: 50,
  }
});
// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     width: '100%',
//     flex:1,
//     height: '90%',
//     backgroundColor: '#371b58',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },

//   innerContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 130,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 10,
//     paddingBottom: 10,
//     paddingLeft: 50,
//   },

//   titleContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//       color: '#ffffff',
//       fontSize: 28,
//       fontFamily: 'Poppins',
//       paddingLeft: 50,
//   }
// })
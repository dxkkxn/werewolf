import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {useState, useEffect} from 'react';
import { StyleSheet, Text, View ,ScrollView} from 'react-native';
import {AvailableGame} from './AvailableGame.js'
import { useNavigation } from '@react-navigation/native';
import ClickableImage from './ClickableImage.js';
const url = `http://${window.location.hostname}:3000`
const leftArrow = require("../assets/images/leftArrow.png");


export default function Join({ route }){
  const [gameData, setGameData] = useState(null);
  const [games, setGames] = useState(null);
  const navigation = useNavigation();
  const username = route.params.username;
  const token = route.params.token;
  const availableGames = (propsArray) => {
    propsArray = JSON.parse(propsArray);
    return(
      propsArray.map((game, index) => {
        if(!game.started){
          return (<AvailableGame key={index} username={username} token={token} gameProps={game} />); 
          // non, la key n'est pas utile, mais sans on a un warning dans la console
        }
      }
    ));
  };

  useEffect(() => {
    if(gameData != null){
      setGames(availableGames(gameData));
    }
  }, [gameData]);

  //getting games from db
  const fetchGames = async () => {
    try{
      const response = await fetch(`${url}/game` ,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
      });
      if (!response.ok) {
        alert('fetch games failed');
        throw new Error('failed to fetch games.');
      }
      const data = await response.json();
      setGameData(data.data);
    } catch(error){ console.error(error)};
  };
  useEffect(() => {
    fetchGames();
  }, []);

  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });
  if (!loaded) {
    // return null;
  }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ClickableImage
          source={leftArrow}
          onPress={() => navigation.navigate('Welcome', {username: username, token: token})}
          symbol={"leftArrow"}
          />
          <Text style={styles.title}> Rejoindre une partie </Text>
        </View>
        <ScrollView>
          <View style={styles.container}>
          {games}
          </View>
        </ScrollView>
      </View>
    );

};


const styles = StyleSheet.create({
  title: {
    margin: 18,
    color: '#ffffff',
    fontSize: 26,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  }
});

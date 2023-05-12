import { StyleSheet, Text, View } from "react-native-web";
import NavBarPartie from "./NavBarPartie";
import BodyPartie from "./BodyPartie";
import { useEffect, useState } from 'react';
import FooterPartie from "./FooterPartie";
import { useNavigation } from '@react-navigation/native';
const url = `http://${window.location.hostname}:3000`;

export default function Partie({ time, route }) {
  const navigation = useNavigation();
  const username = route.params.username;
  const idGame = route.params.idGame;
  const token = route.params.token;
  const [stateOfGame, setStateOfGame] = useState(); 
  // fetch state of game
  const fetchState = () => {
    fetch(`${url}/game/${idGame}/play` ,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then(data => {
      if(!data.ok){
        alert('could not fetch game info');
        navigation.navigate('Welcome', {username : username, token: token});
      }
      else{
        console.log('game fetched :', data);
        setStateOfGame();
      }
    })
    .catch(error => console.error(error)); 
  };

  useEffect(() => {
    //maj graphique
    }, [stateOfGame]);
  setInterval(fetchState,1000);
  return (
    <View style={styles.container}>
      <NavBarPartie time={time} />
      <BodyPartie time={time} />
      <FooterPartie time={time} username={username} idGame={idGame} token={token} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    // backgroundColor: "yellow",
    justifyContent: "space-around",
  },
});

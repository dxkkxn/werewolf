import { StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


 
export function AvailableGame ({gameProps, username, token}) {
  const url = `http://${window.location.hostname}:3000`
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  const avatarId = gameProps.avatarId;
  const icon = require(`../assets/images/avatar${avatarId}.png`);
  const arrow = require('../assets/images/rightArrow.png');
  const joinGame = (idGame, username, token) => {
    fetch(`${url}/game/${idGame}` ,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then(data => {
      if(data.ok){
        alert('partie intégrée avec succès !');
      }
      else if(data.status == 403){
        alert('vous ne pouvez pas rejoindre plusieurs parties simultanément');
      }
      else if(data.status == 401) alert ("failure");
    })
    .catch(error => console.error(error));
  };
  return(
    <View style={styles.rectangle}>
      <View style={styles.leftPart}>
        <Image source={icon} style={styles.image}/>
        <Text style={styles.text}> {gameProps.username} </Text>
      </View>
      <View style={styles.rightPart}>
        <ul style={styles.paramList}>
          <li> Créée par {gameProps.creatorUsername} </li>
          <li> Debut a {gameProps.startHour}h dans {gameProps.startDay} jours</li>
          <li> De {gameProps.minPlayers} à {gameProps.maxPlayers} joueurs</li>
          <li> Jour: {gameProps.dayDuration} min, Nuit: {gameProps.nightDuration} min </li>
          <li> C: {gameProps.infectionProbability}, I:{gameProps.insomniaProbability}, V:{gameProps.seerProbability}, S:{gameProps.spiritismProbability} </li>
          <li> Proportion de loups : {gameProps.werewolfProbability} </li>
        </ul>
        <TouchableOpacity style={styles.arrowBox} onPress = {()=>{joinGame(gameProps.idGame, username, token)}}>
          <Image style={styles.arrowStyle} source={arrow}/>
        </TouchableOpacity>
      </View>
    </View>
  ); 
};


const styles = StyleSheet.create({
  arrowBox: {
    height: '40px',
    width: '50px',
    backgroundColor: '#7858a6',
    borderTopLeftRadius: 10, 
    borderBottomLeftRadius: 0, 
    borderTopRightRadius: 0, 
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  arrowStyle: {
    width:'28px', 
    height:'20px',
    alignSelf: 'center',
  },
  rectangle: {
    flexDirection:'row',
    height: '190px',
    marginBottom: 15,
    width: '350px',
    backgroundColor: 'rgba(120, 88, 166, 0.3)',
    borderRadius: 10,
  },
  rightPart:{
    display: 'flex',
    flex:3,
    backgrounfColor: 'white',
    alignItems: 'left',
  },
  leftPart:{
    flex:2,
    backgrounfColor: 'white',
    alignItems: 'center',
  },
  image: {
    width: '100px',
    height: '100px',
    alignSelf: 'center',
    top:9,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins',
    marginTop: 13,
    fontWeight: 800,
  },
  paramList: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    paddingLeft:20,
  },
});


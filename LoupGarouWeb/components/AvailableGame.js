import { StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native';
import { useFonts } from 'expo-font';
import {useState} from 'react';

const url = `http://${window.location.hostname}:3000`
const arrow = require('../assets/images/rightArrow.png');

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

async function fetchAvatarId(username) {
  try {
    const response = await fetch(`${url}/users/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Response was not ok');
    }
    const data = await response.json();
    const avatarId = data.data.avatarId;
    const icon = require(`../assets/images/avatar${avatarId}.png`);
    return icon;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
 
export function AvailableGame ({gameProps}) {
  const [icon, setIcon] = useState(null);
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  fetchAvatarId(gameProps.creatorUsername)
  .then(icon => {
    setIcon(icon)
  });
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
        <TouchableOpacity style={styles.arrowBox}>
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


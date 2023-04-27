import { StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native';
import { useFonts } from 'expo-font';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


 
export function AvailableGame ({gameProps}) {
  //  avatarId is a number corresonding to an image
  //  nbPlayersMin
  //  nbPlayersMax(facultatif: si null, pas de fourchette)
  //  dayStart : heure de début du jour
  //  dayEnd
  //  startDate
  //  startHour
  //  probaC
  //  probaI
  //  probaV
  //  probaS
  //  nbWolves
  //  hoursToStart : nb of hours before start of game
  //pseudo is a string
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  const icon = require(`../assets/images/avatar${gameProps.avatarId}.png`);
  const arrow = require('../assets/images/rightArrow.png');
  return(
    <View style={styles.rectangle}>
      <View style={styles.leftPart}>
        <Image source={icon} style={styles.image}/>
        <Text style={styles.text}> {gameProps.creatorPseudo} </Text>
      </View>
      <View style={styles.rightPart}>
        <ul style={styles.paramList}>
          <li> Debut dans {gameProps.hoursToStart}h </li>
          <li> {gameProps.nbPlayersMin} joueurs </li>
          <li> Jour de {gameProps.dayStart}h à {gameProps.dayEnd}h </li>
          <li> C: {gameProps.probaC}, I:{gameProps.probaI}, V:{gameProps.probaV}, S:{gameProps.probaS} </li>
          <li> {gameProps.nbWolves} loups </li>
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
    height: '150px',
    marginBottom: 15,
    width: '320px',
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


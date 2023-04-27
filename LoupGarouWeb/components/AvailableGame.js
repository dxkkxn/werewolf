import { StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native';
import { useFonts } from 'expo-font';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


 
export function AvailableGame ({avatarId, gameParams, creatorPseudo}) {
  //avatarId is a number corresonding to an image
  //gameParams conatains the different params : 
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
  //pseudo is a string
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  const icon = require('../assets/images/avatar1.png');
  const arrow = require('../assets/images/rightArrow.png');
  return(
    <View style={styles.rectangle}>
      <View style={styles.leftPart}>
        <Image source={icon} style={styles.image}/>
        <Text style={styles.text}> {creatorPseudo} </Text>
      </View>
      <View style={styles.rightPart}>
        <ul style={styles.paramList}>
          <li> {gameParams.nbPlayersMin} joueurs </li>
          <li> Jour de {gameParams.dayStart}h à {gameParams.dayEnd}h </li>
          <li> C: {gameParams.probasC}, I:{gameParams.probaI}, V:{gameParams.probaV}, S:{gameParams.probaS} </li>
          <li> {gameParams.nbWolves} loups </li>
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
    height: '60px',
    width: '60px',
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
    height: '30%',
    width: '30%',
    top: 64,
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
    width: '130px',
    height: '130px',
    alignSelf: 'center',
    top:9,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins',
    marginTop: 9,
    fontWeight: 800,
  },
  paramList: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
  },
});


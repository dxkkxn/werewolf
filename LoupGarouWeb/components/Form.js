import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import InputField from './InputField';
import { MyButton } from './MyButton';
import { useNavigation } from '@react-navigation/native';

export default function Form({route}) {
  const [nbPlayers, setNbPlayers] = useState([5, 20]);
  const [dureeJour, setDureeJour] = useState(3);
  const [dureeNuit, setDureeNuit] = useState(2)
  const [jourDebut, setJourDebut] = useState(1);
  const [heureDebut, setHeureDebut] = useState(8);
  const [probasPouvoirs, setProbasPouvoirs] = useState(Array(4).fill(0.0)); // the order is C, I, V, S
  const [portionLoups, setPortionLoups] = useState(0.3);
  const navigation = useNavigation()
  const username = route.params.username;
  const token = route.params.token;

  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  const url = `http://${window.location.hostname}:3000`

  const createGame = () => {
    //verifications
    if(typeof(nbPlayers[0]) === 'undefined' || nbPlayers[0] == null || isNaN(+nbPlayers[0]) || nbPlayers[0] < 5) {
      alert("nombre minimal de joueurs invalide");
      return -1;
    }
    if( typeof(nbPlayers[1]) === 'undefined' || nbPlayers[1] == null || isNaN(+nbPlayers[1]) || nbPlayers[1] > 20) {
      alert("nombre maximal de joueurs invalide");
      return -1;
    }
    if(typeof(dureeJour) === 'undefined' || dureeJour == null || isNaN(dureeJour) || dureeJour <= 0){
      alert("durée du jour invalide");
      return -1;
    }
    if(typeof(dureeNuit) === 'undefined' || dureeNuit == null || isNaN(dureeNuit) || dureeNuit <= 0){
      alert("durée de la nuit invalide");
      return -1;
    } 
    if(typeof(probasPouvoirs[0]) === 'undefined' || probasPouvoirs[0] == null || isNaN(probasPouvoirs[0]) || probasPouvoirs[0] < 0 || probasPouvoirs[0] > 1){
      alert("proba de contamination invalide");
      return -1;
    } 
    if(typeof(probasPouvoirs[1]) === 'undefined' || probasPouvoirs[1] == null || isNaN(probasPouvoirs[1]) || probasPouvoirs[1] < 0 || probasPouvoirs[1] > 1){
      alert("proba d'insomnie invalide");
      return -1;
    } 
    if(typeof(probasPouvoirs[2]) === 'undefined' || probasPouvoirs[2] == null || isNaN(probasPouvoirs[2]) || probasPouvoirs[2] < 0 || probasPouvoirs[2] > 1){
      alert("proba de voyance invalide");
      return -1;
    } 
    if(typeof(probasPouvoirs[3]) === 'undefined' || probasPouvoirs[3] == null || isNaN(probasPouvoirs[3]) || probasPouvoirs[3] < 0 || probasPouvoirs[3] > 1){
      alert("proba de spiritisme invalide");
      return -1;
    }
    if(typeof(jourDebut) === 'undefined' || jourDebut == null || isNaN(jourDebut) || jourDebut < 0){
      alert("jour de début invalide");
      return -1;
    }
    if(typeof(heureDebut) === 'undefined' || heureDebut == null || isNaN(heureDebut) || heureDebut < 0){
      alert("heure de début invalide");
      return -1;
    }
    if(typeof(portionLoups) === 'undefined' || portionLoups == null || isNaN(portionLoups) || portionLoups < 0 || portionLoups > 1){
      alert("portion de loups invalide");
      return -1;
    }
    fetch(`${url}/game` ,{
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
      },
      body: JSON.stringify({
        data : JSON.stringify({
          startDay: jourDebut,
          startHour: heureDebut,
          minPlayers: nbPlayers[0],
          maxPlayers: nbPlayers[1],
          dayDuration: dureeJour,
          nightDuration: dureeNuit,
          werewolfProbability: portionLoups,
          seerProbability: probasPouvoirs[2],
          infectionProbability: probasPouvoirs[0],
          spiritismProbability: probasPouvoirs[3],
          insomniaProbability: probasPouvoirs[1]
        })
      })
    })
    .then(data => {
      // Do something with the data
      if(data.ok){
        alert('partie créée avec succès !');
      }
      else if(data.status == 403){
        alert('vous ne pouvez pas rejoindre plusieurs parties simultanément');
      }
      else if(data.status == 401) alert ("failure");
      return 0;
    })
    .catch(error => console.error(error)); 
  }

  const handleNbPlayers = (nbPlayersInput) => {
    const limits = nbPlayersInput.split("-");
    if (limits.length == 1) {
      setNbPlayers([parseInt(limits[0].trim()), parseInt(limits[0].trim())]);
    } else {
      setNbPlayers([parseInt(limits[0].trim()), parseInt(limits[1].trim())])
    }
  }
  const handleDureeJour = (dureeJourInput) => {
    setDureeJour(parseInt(dureeJourInput));
  }
  const handleDureeNuit = (dureeNuitInput) => {
    setDureeNuit(parseInt(dureeNuitInput));
  }
  const handleJourDebut = (jourDebutInput) => {
    setJourDebut(parseInt(jourDebutInput));
  }
  const handleHeureDebut = (heureDebutInput) => {
    setHeureDebut(parseInt(heureDebutInput));
  }
  const handleProbasPouvoirs = (probasPouvoirsInput, index) => {
    const pouvoirs = [...probasPouvoirs];
    pouvoirs[index] = parseFloat(probasPouvoirsInput);
    setProbasPouvoirs(pouvoirs);
  }
  const handlePortionLoups = (portionLoupsInput) => {
    setPortionLoups(parseFloat(portionLoupsInput));
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurer la partie</Text>
      <View style={styles.formContainer}>
        <Text style={styles.question}>Nombre ou fourchette de joueurs :</Text>
        <InputField placeholder="Ex : 5 (nombre fixe), 5-10 (fourchette)" secureTextEntry={false} onChangeText={handleNbPlayers} />
        <Text style={styles.question}>Durée du jour et de la nuit (minutes) :</Text>
        <View style={styles.inlineFields}>
          <InputField placeholder="Durée jour" secureTextEntry={false} onChangeText={handleDureeJour} width={140} />
          <InputField placeholder="Durée nuit" secureTextEntry={false} onChangeText={handleDureeNuit} width={140} />
        </View>
        <Text style={styles.question}>Horaire de début :</Text>
        <View style={styles.inlineFields}>
          <InputField placeholder="Nombre de jours" secureTextEntry={false} onChangeText={handleJourDebut} width={155} />
          <InputField placeholder="Heure début" secureTextEntry={false} onChangeText={handleHeureDebut} width={125} />
        </View>
        <Text style={styles.question}>Probabiltés des pouvoirs :</Text>
        <View style={styles.inlineFields}>
          <InputField placeholder="Contamination" secureTextEntry={false} onChangeText={(event) => handleProbasPouvoirs(event, 0)} width={140} />
          <InputField placeholder="Insomnie" secureTextEntry={false} onChangeText={(event) => handleProbasPouvoirs(event, 1)} width={140} />
        </View>
        <View style={styles.inlineFields}>
          <InputField placeholder="Voyance" secureTextEntry={false} onChangeText={(event) => handleProbasPouvoirs(event, 2)} width={140} />
          <InputField placeholder="Spiritisme" secureTextEntry={false} onChangeText={(event) => handleProbasPouvoirs(event, 3)} width={140} />
        </View>
        <Text style={styles.question}>Proportion Initiale des loups-garous :</Text>
        <InputField placeholder="Ex : 0.3" secureTextEntry={false} onChangeText={handlePortionLoups} />
      </View>
      <MyButton label="Créer la partie" primary={true} onPress={createGame}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: "93%",
    top: "3%",
  },
  question: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: "1vh",
    fontFamily: 'Poppins',
  },
  inlineFields: {
    flexDirection: 'row',
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: 'Poppins',
  },
  formContainer: {
    width: 300,
    // height: 550,
  }
})

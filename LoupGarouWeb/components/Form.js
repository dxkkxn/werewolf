import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import InputField from './InputField';
import { MyButton } from './MyButton';

export default function Form() {
  const [nbPlayers, setNbPlayers] = useState([5, 20]);
  const [dureeJour, setDureeJour] = useState(3);
  const [dureeNuit, setDureeNuit] = useState(2)
  const [jourDebut, setJourDebut] = useState(1);
  const [heureDebut, setHeureDebut] = useState('8h');
  const [probasPouvoirs, setProbasPouvoirs] = useState(Array(4).fill(0.0)); // the order is C, I, V, S
  const [portionLoups, setPortionLoups] = useState(0.3);

  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
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
    setHeureDebut(heureDebutInput);
  }
  const handleProbasPouvoirs = (probasPouvoirsInput, index) => {
    console.log(probasPouvoirsInput)
    const pouvoirs = [...probasPouvoirs];
    pouvoirs[index] = parseFloat(probasPouvoirsInput);
    console.log(pouvoirs);
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
      <MyButton label="Créer la partie" primary={true} />
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
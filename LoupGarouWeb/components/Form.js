import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import InputField from './InputField';
import { MyButton } from './MyButton';

export default function Form() {
  const [nbPlayers, setNbPlayers] = useState([5, 20]);
  const [dureeJour, setDureeJour] = useState(['8h', '22h']);
  const [jourDebut, setJourDebut] = useState(1);
  const [heureDebut, setHeureDebut] = useState('8h');
  const [probasPouvoirs, setProbasPouvoirs] = useState(Array(4).fill(0.0)); // the order is C, I, V, S
  const [portionLoups, setPortionLoups] = useState(0.3);

  useEffect(() => {
    console.log(nbPlayers);
    console.log(dureeJour);
    console.log(probasPouvoirs);
  }, [nbPlayers, dureeJour, probasPouvoirs]);
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleNbPlayers = (nbPlayersInput) => {
    const textValue = nbPlayersInput.nativeEvent.text;
    const limits = textValue.split("-");
    if (limits.length == 1) {
      setNbPlayers([parseInt(limits[0].trim()), parseInt(limits[0].trim())]);
    } else {
      setNbPlayers([parseInt(limits[0].trim()), parseInt(limits[1].trim())])
    }
  }
  const handleDureeJour = (dureeJourInput) => {
    const textValue = dureeJourInput.nativeEvent.text;
    const limits = textValue.split("-");
    setDureeJour([limits[0].trim(), limits[1].trim()]);
  }
  const handleJourDebut = (jourDebutInput) => {
    setJourDebut(parseInt(jourDebutInput.nativeEvent.text));
  }
  const handleHeureDebut = (heureDebutInput) => {
    setHeureDebut(heureDebutInput.nativeEvent.text);
  }
  const handleProbasPouvoirs = (probasPouvoirsInput, index) => {
    const textValue = probasPouvoirsInput.nativeEvent.text;
    console.log(textValue)
    const pouvoirs = [...probasPouvoirs];
    pouvoirs[index] = parseFloat(textValue);
    console.log(pouvoirs);
    setProbasPouvoirs(pouvoirs);
  }
  const handlePortionLoups = (portionLoupsInput) => {
    const textValue = portionLoupsInput.nativeEvent.text;
    setPortionLoups(parseInt(textValue));
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurer la partie</Text>
      <View style={styles.formContainer}>
        <Text style={styles.question}>Nombre ou fourchette de joueurs :</Text>
        <InputField placeholder="Ex : 5 (nombre fixe), 5-10 (fourchette)" secureTextEntry={false} onSubmitEditing={handleNbPlayers} />
        <Text style={styles.question}>Durée du jour :</Text>
        <InputField placeholder="Ex : 8h - 22h" secureTextEntry={false} onSubmitEditing={handleDureeJour} />
        <Text style={styles.question}>Horaire de début :</Text>
        <View style={styles.inlineFields}>
          <InputField placeholder="Nombre de jours" secureTextEntry={false} onSubmitEditing={handleJourDebut} width={155} />
          <InputField placeholder="Heure début" secureTextEntry={false} onSubmitEditing={handleHeureDebut} width={125} />
        </View>
        <Text style={styles.question}>Probabiltés des pouvoirs :</Text>
        <View style={styles.inlineFields}>
          <InputField placeholder="Contamination" secureTextEntry={false} onSubmitEditing={(event) => handleProbasPouvoirs(event, 0)} width={140} />
          <InputField placeholder="Insomnie" secureTextEntry={false} onSubmitEditing={(event) => handleProbasPouvoirs(event, 1)} width={140} />
        </View>
        <View style={styles.inlineFields}>
          <InputField placeholder="Voyance" secureTextEntry={false} onSubmitEditing={(event) => handleProbasPouvoirs(event, 2)} width={140} />
          <InputField placeholder="Spiritisme" secureTextEntry={false} onSubmitEditing={(event) => handleProbasPouvoirs(event, 3)} width={140} />
        </View>
        <Text style={styles.question}>Proportion Initiale des loups-garous :</Text>
        <InputField placeholder="Ex : 0.3" secureTextEntry={false} onSubmitEditing={handlePortionLoups} />
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
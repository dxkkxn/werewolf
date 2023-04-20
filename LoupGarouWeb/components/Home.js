import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {useState} from 'react';
import { BigButton } from './BigButton.js';
import {InscriptionForm} from './InscriptionForm.js';
import {ConnectionForm} from './ConnectionForm.js';


function Home(){
  const [showCoForm, setShowCoForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const retour=()=>{
    setShowCoForm(false);
    setShowSignUpForm(false);
    setShowButtons(true);
  }
  const onPressSU=()=>{
    setShowCoForm(false);
    setShowSignUpForm(true);
    setShowButtons(false);
  }
  const onPressCo=()=>{
    setShowCoForm(true);
    setShowSignUpForm(false);
    setShowButtons(false);
  }
  if(showButtons){
    return (
      <View style={styles.container}>
        <BigButton label='Connexion' onPress={onPressCo}/>
        <BigButton label='Inscription' onPress={onPressSU}/>
      </View>
    );
  }
  else if(showCoForm){
    return(
      <View style={styles.container}>
        <ConnectionForm/>
        <Button title='retour' onPress={retour} />
      </View>
    );
  }
  else if(showSignUpForm){
    return(
      <View style={styles.container}>
        <InscriptionForm/>
        <Button title='retour' onPress={retour} />
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

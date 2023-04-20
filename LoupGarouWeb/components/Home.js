import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useState} from 'react';
import { Button } from './Button.js';
import {InscriptionForm} from './InscriptionForm.js';


export function Home(){
  const [showCoForm, setShowCoForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
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
        <Button label='Connexion' onPress={onPressCo}/>
        <Button label='Inscription' onPress={onPressSU}/>
      </View>
    );
  }
  else if(showCoForm){}
  else if(showSignUpForm){
    return(
      <View style={styles.container}>
        <InscriptionForm/>
      </View>
    );
  }
}


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

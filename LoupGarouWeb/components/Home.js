import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {useState} from 'react';
import { MyButton } from './MyButton.js';
import {InscriptionForm} from './InscriptionForm.js';
import {ConnectionForm} from './ConnectionForm.js';
import {InputField} from './InputField.js';

function Home(){
  const [connect, setConnect] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const onPressDejainscrit=()=>{
    setConnect(true);
  }
  const onPressCo=()=>{
  }
  const onPressCreerCompte=()=>{}
  
  const handlePassword = (passwordInput) => {
    setUsername(passwordInput);
    console.log(password);
  }
  const handleUsername = (usernameInput) => {
    setUsername(usernameInput);
    console.log(username);
  }

  return(
    <View style={styles.container}>
      <InputField 
        placeholder="Identifiant"
        secureTextEntry={false}
        onChangeText={handleUsername}
        />
      <InputField 
        placeholder="Mot De Passe"
        secureTextEntry={true}
        onChangeText={handlePassword}
        />
    </View>
    );

  if(Connect){
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

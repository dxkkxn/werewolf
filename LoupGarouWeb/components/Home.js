import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import {Banner} from './Banner.js';
import {useState} from 'react';
import { MyButton } from './MyButton.js';
import {InputField} from './InputField.js';

function Home(){
  const [connect, setConnect] = useState(false);
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


  //variables pour l'affichage conditionnel de certains InputField et Pressables
  let pwdOublie, pwdConfirm, ConnexionButton, dejaInscrit, onPressCreate = null;

  if(!connect){
    onPressCreate =()=>{}//actual account creation process
    pwdConfirm = <InputField
    placeholder="Confirmer le mot de passe"
    secureTextEntry={true}
    onChangeText={handlePassword}
    />;
    dejaInscrit = <Pressable onPress={()=>setConnect(true)} >
      <Text style={styles.textPressable}>Déjà inscrit ? Se connecter</Text>
    </Pressable>;
  }
  else{
    onPressCreate = ()=>{setConnect(false)}
    pwdOublie=<Pressable >
      <Text style={styles.textPressable}>Mot de passe oublié ?</Text>
    </Pressable>;
    ConnexionButton=<MyButton label = "Connexion" bg='#371b58'/>
  }

  return(
    <View style={styles.container}>
      <Banner />
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
      {pwdConfirm}
      {ConnexionButton}
      <MyButton label = "Creer un compte" bg='#7858a6' onPress={onPressCreate}/>
      {dejaInscrit}
      {pwdOublie}
    </View>
    );

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
  textPressable: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    textDecorationLine: 'underline',

    color: '#7858a6',
  },
});

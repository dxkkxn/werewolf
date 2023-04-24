import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import {Banner} from './Banner.js';
import {useState} from 'react';
import { MyButton } from './MyButton.js';
import {InputField} from './InputField.js';
import { useFonts } from 'expo-font';

function LockScreen(){
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

  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if(!connect){
    onPressCreate =()=>{}//actual account creation process
    pwdConfirm = <InputField
    placeholder="Confirmer mot de passe"
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
    <View>
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
    </View>
      {ConnexionButton}
      <MyButton label = "Créer un compte" bg='#7858a6' onPress={onPressCreate}/>
      {dejaInscrit}
      {pwdOublie}
    </View>
    );

}

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'space-around',
    top: 64,
  },
  textPressable: {
    fontSize: 18,
    textDecorationLine: 'underline',
    color: '#7858a6',
    fontFamily: 'Poppins',
  },
});

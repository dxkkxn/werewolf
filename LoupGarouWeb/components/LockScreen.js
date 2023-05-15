import { StatusBar } from "expo-status-bar";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Banner } from "./Banner.js";
import { useState } from "react";
import { MyButton } from "./MyButton.js";
import { InputField } from "./InputField.js";
import { useFonts } from "expo-font";
import { useNavigation } from '@react-navigation/native';
import Partie from "../components/Partie.js";

// require('mandatoryenv').load(['URL'])
// const { URL } = process.env.REACT_APP_API_URL;
// console.log(URL);
console.log(process.env.REACT_APP_API_URL);
console.log(process.env);


function LoginReq(username, password, navigation){
  if(password === '' || username === ''){
    alert("renseignez tous les champs");
    return -1;
  }
  fetch(`${URL}/login` ,{
    method: 'POST',
    headers: {
          'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: JSON.stringify({
        username: username,
        password: password
      })
    })
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      alert('login failed');
      throw new Error('login failed.');
    }
  })
  .then(data => {
    navigation.navigate('Welcome', {username: username, token: data.token});
  })
  .catch(error => console.error(error)); 
};


function SignInReq(username, password, passwordConf, navigation){
  if(password === '' || username === '' || passwordConf === ''){
    alert("renseignez tous les champs");
    return -1;
  }
  if(password !== passwordConf){
    alert("mots de passe différents")
  return -1;
  }
  if(password.length < 8){
    console.log(URL)
    alert("mot de passe trop court");
    return -1;
  }
  navigation.navigate('Avatars', {username: username, password: password});
}

function LockScreen() {
  const [connect, setConnect] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const navigation = useNavigation();
  const onPressDejainscrit = () => {
    setConnect(true);
  };
  let onPressCo = () => {};
  const onPressCreerCompte = () => {};

  const handlePasswordConfirm = (passwordInput) => {
    setPasswordConf(passwordInput);
  };
  const handlePassword = (passwordInput) => {
    setPassword(passwordInput);
  };
  const handleUsername = (usernameInput) => {
    setUsername(usernameInput);
  };

  //variables pour l'affichage conditionnel de certains InputField et Pressables
  let pwdOublie,
    pwdConfirm,
    ConnexionButton,
    dejaInscrit,
    onPressCreate = null;

  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  if (!connect) {
    onPressCreate = () => {
      SignInReq(username, password, passwordConf, navigation);
    }; //actual account creation process
    pwdConfirm = (
      <InputField
        placeholder="Confirmer mot de passe"
        secureTextEntry={true}
        onChangeText={handlePasswordConfirm}
        login={true}
      />
    );
    dejaInscrit =  (
      <Pressable onPress={() => setConnect(true)}>
        <Text style={styles.textPressable}>Déjà inscrit ? Se connecter</Text>
      </Pressable>
    );
  } else {
    onPressCreate = () => {
      setConnect(false);
    };
    onPressCo = LoginReq;
    pwdOublie = (
      <Pressable>
        <Text style={styles.textPressable}>Mot de passe oublié ?</Text>
      </Pressable>
    );
    ConnexionButton = <MyButton onPress={()=>onPressCo(username, password, navigation)} label="Connexion" primary={false} />;
  }
  // if (true) {
  //   return <Partie time={"day"} />;
  // }

  return (
    <View style={styles.container}>
      <Banner />
      <View>
        <InputField
          placeholder="Identifiant"
          secureTextEntry={false}
          onChangeText={handleUsername}
          login={true}
        />
        <InputField
          placeholder= "Mot De Passe"
          secureTextEntry={true}
          onChangeText={handlePassword}
          login={true}
        />
        {pwdConfirm}
      </View>
      <View style={styles.buttonsContainer}>
        {ConnexionButton}
        <MyButton label="Créer un compte" primary={true} onPress={onPressCreate} />
      </View>
      {dejaInscrit}
      {pwdOublie}
    </View>
  );
}

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    height: "70%",
    alignItems: "center",
    justifyContent: "space-around",
    top: 64,
  },
  textPressable: {
    fontSize: 18,
    textDecorationLine: "underline",
    color: "#7858a6",
    fontFamily: "Poppins",
  },
});

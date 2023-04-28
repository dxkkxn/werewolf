import { StatusBar } from "expo-status-bar";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Banner } from "./Banner.js";
import { useState } from "react";
import { MyButton } from "./MyButton.js";
import { InputField } from "./InputField.js";
import { useFonts } from "expo-font";
import Partie from "../components/Partie.js";

const url = 'localhost:3000';

function LoginReq(username, password){
  console.log(`${url}/login?username=${username}&password=${password}`);
  if(password === '' || username === ''){
    alert("renseignez tous les champs");
    return -1;
  }
  fetch(`${url}/login?username=${username}&password=${password}`)
  .then(data => {
     // Do something with the data
     console.log(data);
     return 0;
    })
    .catch(error => console.error(error)); 
}


function SignInReq(username, password, passwordConf){
  if(password === '' || username === '' || passwordConf === ''){
    alert("renseignez tous les champs");
    return -1;
  }
  if(password !== passwordConf){
    alert("mots de passe différents")
  return -1;
  }
  if(password.length < 8){
    alert("mot de passe trop court");
    return -1;
  }
   fetch(`${url}/signin?username=${username}&password=${password}`)
  .then(response => response.json())
  .then(data => {
    // Do something with the data
    console.log(data);
    return 0;
  })
  .catch(error => console.error(error));
}

function LockScreen() {
  const [connect, setConnect] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
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
      SignInReq(username, password, passwordConf);
    }; //actual account creation process
    pwdConfirm = (
      <InputField
        placeholder="Confirmer mot de passe"
        secureTextEntry={true}
        onChangeText={handlePasswordConfirm}
      />
    );
    dejaInscrit = (
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
    ConnexionButton = <MyButton onPress={()=>onPressCo(username, password)} label="Connexion" bg="#371b58" />;
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
        />
        <InputField
          placeholder= "Mot De Passe"
          secureTextEntry={true}
          onChangeText={handlePassword}
        />
        {pwdConfirm}
      </View>
      {ConnexionButton}
      <MyButton label="Créer un compte" bg="#7858a6" onPress={onPressCreate} />
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

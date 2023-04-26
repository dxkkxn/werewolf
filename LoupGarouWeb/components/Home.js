import React from 'react';
import { useFonts } from 'expo-font';
import { View, StyleSheet, Text } from 'react-native';
import SquareButton from './SquareButton.js';
import CreerPartie from '../assets/CreerPartie.png'
import RejoindrePartie from '../assets/RejoindrePartie.png'

export const Home = ({pseudo}) => {
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (

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
    ConnexionButton=<MyButton label = "Connexion" primary={false}/>
  }

};
=======
    <View>
      {ConnexionButton}
      <MyButton label = "Créer un compte" primary={true} onPress={onPressCreate}/>
    </View>
      {dejaInscrit}
      {pwdOublie} 
    </View>
    );

}

export default Home;
>>>>>>> 1c56cb5649af1c6983be36f120730e29942b48d0

const styles = StyleSheet.create({
  container: {
    height: '70%',
    top: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text:{
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 42,
    color: 'white',
  },
});


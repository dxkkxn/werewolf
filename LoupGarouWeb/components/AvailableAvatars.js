import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable , TouchableOpacity , ScrollView} from 'react-native';
import {useState} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import Card from './Card.js';
import Avatar from './Avatar.js'
import { MyButton } from "./MyButton.js";

const url = `http://${window.location.hostname}:3000`

const avatar1 = require("../assets/images/avatar1.png"); 
const avatar2 = require("../assets/images/avatar2.png");
const avatar3 = require("../assets/images/avatar3.png"); 
const avatar4 = require("../assets/images/avatar4.png");
const avatar5 = require("../assets/images/avatar5.png"); 
const avatar6 = require("../assets/images/avatar6.png");
const avatar7 = require("../assets/images/avatar7.png"); 
const avatar8 = require("../assets/images/avatar8.png");
const avatar9 = require("../assets/images/avatar9.png"); 
const avatar10 = require("../assets/images/avatar10.png");
const avatar11 = require("../assets/images/avatar11.png"); 
const avatar12 = require("../assets/images/avatar12.png");


export default function Avatars({ route }) {
  const navigation = useNavigation();
  const username = route.params.username;
  const password = route.params.password;
  const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    avatar10,
    avatar11,
    avatar12,
  ];

  const [avatarId, setAvatarId] = useState(0);
  const [Clicked, setClicked] = useState(avatars.map(() => false));
  
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });
  if (!loaded) {
    return null;
  }
  const handleClick = (id) => {
    setAvatarId(id+1)
    const newClicked = avatars.map(() => false);
    newClicked[id] = true;
    setClicked(newClicked)
  };
  const handleContinue = (avatarId) => {
    fetch(`${url}/signin` ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({
              username: username,
              password: password,
              avatarId: avatarId
          })
        })
      })
      .then((response) => {
        if (response.ok) {
            return response.json();
          } else {
            navigation.navigate('LockScreen');
          }
        })
        .then(data => {
          navigation.navigate('Welcome', {username, token: data.token});
        })
        .catch(error => console.error(error)); 
    };
    return ( 
            <View style={styles.container}>
          <Text style={styles.title}>Choisissez un Avatar</Text>
                <ScrollView>
                    <View style={styles.containerAvatar}>
                    
                    {avatars.map((avatar,index) => (
                        <Avatar source={avatar} onPress={() => handleClick(index)} key={index} clicked ={Clicked[index]}/>
                    ))}
                    </View>
                </ScrollView>
                <MyButton label="Continuer" primary={true} onPress={() => handleContinue(avatarId)} />   
            </View>
    );
}
const styles = StyleSheet.create({
  container: {
    height: "80%",
    top: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    },
  containerAvatar: {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    // gridTemplateRows: "2fr",
    padding: "15px",
    gap: "15px",
    // marginBottom: "-10px",
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Poppins'
  },
})

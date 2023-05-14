import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native-web";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text } from 'react-native';
import { useFonts } from "expo-font";
// const LinearGradient = require("react-native-linear-gradient");
// <Text style={styles.textBoxImage}>{username}</Text>
// const image1 = require("../assets/images/avatar1.png");
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
const url = `http://${window.location.hostname}:3000`;
const ClickableImage = ({ source, onPress, text, currentPlayer, isDead }) => {
  const borderWidth = currentPlayer || isDead ? 3 : 0;
  const borderColor = isDead ? 'red' : "#7858A6";
  return (
    <TouchableOpacity onPress={onPress} style={{borderWidth: borderWidth, borderColor: borderColor, borderRadius: 25, padding: 2}}>
      <ImageBackground
        source={source}
        style={styles.middleBoxItem}
      >
        <LinearGradient colors={['transparent', "#000000"]} locations={[0.5, 1]} style={styles.linearGradient}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default function BodyPartie({ idGame, myRole, myIdPlayer, username, time, token, votes, isDead, playersList, usersList, avatarIdList }) {
  const [fetchedData, setFetchedData] = useState(null);

  const [votedFor, setVotedFor] = useState(); // on ne revote pas pour la meme personne

  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const avatars = [
    [avatar1, 1],
    [avatar2, 2],
    [avatar3, 3],
    [avatar4, 4],
    [avatar5, 5],
    [avatar6, 6],
    [avatar7, 7],
    [avatar8, 8],
    [avatar9, 9],
    [avatar10, 10],
    [avatar11, 11],
    [avatar12, 12],
  ];
  const handleImage = (idPlayer) => {
      // annule vote => to do ??
      // if isAlive(idPlayer, myIdPlayer) and (day || ww) => to be implemented
    if (votedFor !== idPlayer && (time === 'day' || myRole === 'werewolf') && !isDead.includes(myIdPlayer) && !isDead.includes(idPlayer)){
      fetch(`${url}/game/${idGame}/vote`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          data : JSON.stringify({
            accusedId: idPlayer
          })
        })
      })
      .then(data => {
        if(data.ok){
          setVotedFor(idPlayer);
        }
        else{
          console.log('une erreur est survenue');
        }
      })
      .catch(error => console.error(error))
    }
  };

  return (
    <ScrollView style={ time== "day" ? {backgroundColor: "#DAC9F2"} : { backgroundColor: "#371B58" }}>
      <View
        style={styles.middleBox}
      >
        {playersList.map((idPlayer, index) => (
          <View key={index} style={styles.container}>
          <ClickableImage
            source={avatars[avatarIdList[idPlayer]-1][0]}
            onPress={() => handleImage(idPlayer)}
            text={usersList[idPlayer]}
            currentPlayer={usersList[idPlayer] == username}
            isDead={isDead.includes(idPlayer)}
          />
          { usersList[idPlayer] in votes ?  <Text>{votes[usersList[idPlayer]]} votes</Text> : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  middleBox: {
    width: "100%",
    height: "100%",
    // backgroundColor: "#DAC9F2",
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    // gridTemplateRows: "2fr",
    padding: "15px",
    gap: "15px",
    // marginBottom: "-10px",
  },
  middleBoxItem: {
    // backgroundColor: "red",
    width: "100px",
    height: "100px",
    borderRadius: "20px",
    // display: "block",
    // padding: "15px",
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxImage: {
    width: "20px",
    height: "20px",
    color: "white",
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: "20px",
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  textContainer: {
    textAlign: 'center',
    marginBottom: 5,
  }
});

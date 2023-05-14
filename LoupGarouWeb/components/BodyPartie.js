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
const ClickableImage = ({ source, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={styles.middleBoxItem}
        colors={["purple", "#000000"]}
        locations={[0, 1]}
      >
        <ImageBackground
          source={source}
          style={styles.middleBoxItem}
        ></ImageBackground>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function BodyPartie({ idGame, myRole, myIdPlayer, username, time, token, votes, isDead, playersList, usersList, avatarIdList }) {
  const [fetchedData, setFetchedData] = useState(null);

  const [votedFor, setVotedFor] = useState(); // on ne revote pas pour la meme personne

  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
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
          alert('une erreur est survenue');
        }
      })
      .catch(error => console.error(error))
    }
  };

  const getAvatar = (user) => {
    let index = users.find((element) => element[1] == user.avatarId);
    console.log("heeeeeeeee0200202020020202020");
    console.log(index);
    console.log(user.idPlayer);
    console.log("heeeeeeeee0200202020020202020");
    return users[index][0];
  };
  // console.log(avatar1);
  return (
    <ScrollView>
      <View
        style={
          time == "day"
            ? styles.middleBox
            : [styles.middleBox, { backgroundColor: "#371B58" }]
        }
      >
        {playersList.map((idPlayer, index) => (
          <View key={index} style={styles.container}>
          <ClickableImage
            source={avatars[avatarIdList[idPlayer]-1][0]}
            onPress={() => handleImage(idPlayer)}
          />
          <Text style={[styles.textUser, usersList[idPlayer]==username ? styles.greenText : null]}>
          {usersList[idPlayer]}
          </Text>
          { usersList[idPlayer] in votes ?  <Text style={styles.vote} >{votes[usersList[idPlayer]]} votes</Text> : null}
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
    backgroundColor: "#371B58",
    display: "grid",
    gridTemplateColumns: "repeat(7,1fr)",
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
    linearGradient: "rgba(0,0,0,0)",
    // display: "block",
    // padding: "15px",
  },
  boxImageContainer: {
    width: "120px",
    height: "120px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    linearGradient: "rgba(0,0,0,0)",
  },
  textBoxImage: {
    width: "20px",
    height: "20px",
    color: "white",
  },
  textUser: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 10,
    paddingLeft: 20,
    color: "white",
    position: "absolute",
    bottom: 0,
  },
  vote: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 10,
    paddingLeft: 20,
    color: "white",
    position: "absolute",
    top: 0,
  },
  greenText: {
    color: 'green',
  },
});

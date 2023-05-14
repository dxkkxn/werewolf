import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const url = `http://${window.location.hostname}:3000`;
const arrow = require("../assets/images/rightArrow.png");

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

async function fetchAvatarId(username) {
  try {
    const response = await fetch(`${url}/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Response was not ok");
    }
    const data = await response.json();
    const avatarId = data.data.avatarId;
    const icon = require(`../assets/images/avatar${avatarId}.png`);
    return icon;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

export function AvailableGame({ gameProps, username, token }) {
  const navigation = useNavigation();
  const [icon, setIcon] = useState(null);
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const moment = require("moment");
  const currentDate = moment();
  const remainingTime = moment.duration(
    moment(gameProps.startingDate).diff(moment(currentDate))
  );
  const hours = Math.floor(remainingTime.asHours());
  const minutes = Math.floor(remainingTime.asMinutes() % 60);

  fetchAvatarId(gameProps.creatorUsername).then((icon) => {
    setIcon(icon);
  });
  const startGame = (idGame, username) => {
    fetch(`${url}/game/${idGame}/play`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((data) => {
        if (data.ok) {
          alert("partie démarrée avec succès !");
          navigation.navigate("Partie", { idGame, username, token });
        } else if (data.status == 403) {
          alert("cette partie a déjà commencé !");
        } else {
          alert("erreur interne");
        }
      })
      .catch((error) => console.error(error));
  };
  const joinGame = (idGame, username, token) => {
    fetch(`${url}/game/${idGame}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((data) => {
        if (data.ok) {
          // for now, after joining, user is locked in a waiting room until the game starts
          navigation.navigate("WaitingRoom", { idGame, username, token });
        } else if (data.status == 403) {
          if (data.message === "maximum number of players reached") {
            alert("Cette partie est complète !");
          } else {
            alert(
              "Vous ne pouvez pas rejoindre plusieurs parties simultanément"
            );
          }
        } else if (data.status == 401) alert("failure");
      })
      .catch((error) => console.error(error));
  };
  let onPress;
  let styleArrowBox;
  if (username == gameProps.creatorUsername) {
    styleArrowBox = styles.arrowBoxStart;
    onPress = () => {
      startGame(gameProps.idGame, username, token);
    };
  } else {
    styleArrowBox = styles.arrowBox;
    onPress = () => {
      joinGame(gameProps.idGame, username, token);
    };
  }
  return (
    <View style={styles.rectangle}>
      <View style={styles.leftPart}>
        <Image source={icon} style={styles.image} />
        <Text style={styles.text}>{gameProps.username}</Text>
      </View>
      <View style={styles.rightPart}>
        <ul style={styles.paramList}>
          <li>Créée par {gameProps.creatorUsername}</li>
          <li>
            Debut dans {hours}h {minutes}m
          </li>
          <li>
            De {gameProps.minPlayers} à {gameProps.maxPlayers} joueurs
          </li>
          <li>
            Jour: {gameProps.dayDuration} min, Nuit: {gameProps.nightDuration}{" "}
            min
          </li>
          <li>
            C: {gameProps.infectionProbability}, I: {gameProps.insomniaProbability}, V: {gameProps.seerProbability}, S: {gameProps.spiritismProbability}
          </li>
          <li>Proportion de loups : {gameProps.werewolfProbability}</li>
          <li>Joueurs actuels : {gameProps.currentPlayers}</li>
        </ul>
        {gameProps.currentPlayers == gameProps.maxPlayers ? (
          <Text style={styles.textPartieComplete}>Partie complète !</Text>
        ) : (
          <TouchableOpacity style={styleArrowBox} onPress={onPress}>
            <Image style={styles.arrowStyle} source={arrow} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowBox: {
    height: "40px",
    width: "50px",
    backgroundColor: "#7858a6",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  arrowBoxStart: {
    height: "40px",
    width: "50px",
    backgroundColor: "#58a678",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  arrowStyle: {
    width: "28px",
    height: "20px",
    alignSelf: "center",
  },
  rectangle: {
    flexDirection: "row",
    height: "190px",
    marginBottom: 15,
    width: "350px",
    backgroundColor: "rgba(120, 88, 166, 0.3)",
    borderRadius: 10,
  },
  rightPart: {
    display: "flex",
    flex: 3,
    backgrounfColor: "white",
    alignItems: "left",
  },
  leftPart: {
    flex: 2,
    backgrounfColor: "white",
    alignItems: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    alignSelf: "center",
    top: 9,
  },
  text: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Poppins",
    marginTop: 13,
    fontWeight: 800,
  },
  paramList: {
    color: "#ffffff",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 14,
    paddingLeft: 20,
  },
  textPartieComplete: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 20,
    paddingLeft: 20,
    color: "green",
    position: "absolute",
    bottom: 0,
  },
});

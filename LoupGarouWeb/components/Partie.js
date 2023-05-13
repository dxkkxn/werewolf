import { StyleSheet, Text, View } from "react-native-web";
import NavBarPartie from "./NavBarPartie";
import BodyPartie from "./BodyPartie";
import { useEffect, useState } from "react";
import FooterPartie from "./FooterPartie";
import { useNavigation } from "@react-navigation/native";
const url = `http://${window.location.hostname}:3000`;

export default function Partie({ time, route, onDataUpdate }) {
  const navigation = useNavigation();
  const username = route.params.username;
  const idGame = route.params.idGame;
  const token = route.params.token;
  // const gameData = route.params.jsonData;
  const [stateOfGame, setStateOfGame] = useState(null);
  const [playersList, setPlayersList] = useState([]);
  useEffect(() => {
    fetch(`${url}/game/${idGame}/play`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const players = JSON.parse(data.data).players;
        setPlayersList(players);
      });
    fetch(`${url}/game/${idGame}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const players = JSON.parse(data.data).players;
        setPlayersList([...players]);
      });
  }, []);
  return (
    <View style={styles.container}>
      <NavBarPartie time={time} />
      <BodyPartie time={time} players={playersList} />
      <FooterPartie
        time={time}
        username={username}
        idGame={idGame}
        token={token}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    // backgroundColor: "yellow",
    justifyContent: "space-around",
  },
});

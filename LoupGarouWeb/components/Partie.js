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
  const [messages, setMessages] = useState([]);
  const [playersList, setPlayersList] = useState([]); // contains idPlayers
  const [avatarIdList, setAvatarIdList] = useState(null); // a ne changer qu'une fois : avatarIdList[id] = avatarId
  const [usersList, setUsersList]= useState(null); //idem  : usersList[idPlayer] = username

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
      return avatarId;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function fetchAvatarIds(players) {
    const avatarPromises = players.reduce((acc, player) => {
      acc[player.idPlayer] = fetchAvatarId(player.username);
      return acc;
    }, {});

    const avatarIds = {};
    await Promise.all(Object.entries(avatarPromises).map(async ([idPlayer, promise]) => {
      avatarIds[idPlayer] = await promise;
    }));

  return avatarIds;
  }

  const fetchInitial = () => {
    // fetch the usernames and avatar ids once and for all, these wont have to be changed again
    let players = {};
    fetch(`${url}/game/${idGame}/play`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      }
    })
    .then((response) => {
      response.json()
      .then((data) => {
        players = JSON.parse(data.data).players; //ok
        setPlayersList(players.map(player => player.idPlayer));
        (async () => {
          try {
            const avIdList = await fetchAvatarIds(players);
            setUsersList(players.reduce((acc, player) => {
              acc[player.idPlayer] = player.username;
              return acc;
            }, {})); // now we can use usersList[id] to get username
            setAvatarIdList(avIdList);
          } catch (error) {
            console.error(error);
          }
        })()
      })
    })
  };
  useEffect(() => {
    fetchInitial();
  }, []);
  const fetchGameState = async (interval) => {
    try {
      const data = await fetch(`${url}/game/${idGame}/play`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      const response = await data.json();
      const gameState = JSON.parse(response.data);
      setPlayersList(gameState.players);
      const gameMessages = gameState.messages;
      if (JSON.stringify(gameMessages) !== JSON.stringify(messages)) {
        setMessages(gameMessages);
      }
    } catch(error) {
      console.log(error);
    }
  }; 
  // const interval = setInterval(()=>{fetchGameState(interval);}, 5000);
  // to be done in BodyPartie and FooterPartie
  if(usersList != null && avatarIdList != null) {
    return (
      <View style={styles.container}>
        <NavBarPartie time={time} />
        <BodyPartie 
          idGame={idGame}
          username={username}
          time={time} 
          playersList={playersList}
          usersList={usersList}
          token={token}
          avatarIdList={avatarIdList} />
        <FooterPartie
          time={time}
          username={username}
          idGame={idGame}
          token={token}
          messages={messages}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    // backgroundColor: "yellow",
    justifyContent: "space-around",
  },
});

import { StyleSheet, Text, View } from "react-native-web";
import NavBarPartie from "./NavBarPartie";
import BodyPartie from "./BodyPartie";
import { useEffect, useState } from "react";
import FooterPartie from "./FooterPartie";
import { useNavigation } from "@react-navigation/native";
const url = `http://${window.location.hostname}:3000`;

export default function Partie({ route, onDataUpdate }) {
  const navigation = useNavigation();
  const username = route.params.username;
  const idGame = route.params.idGame;
  const token = route.params.token;
  // const gameData = route.params.jsonData;
  const [messages, setMessages] = useState([]);
  const [votes, setVotes] = useState({});
  const [isDead, setIsDead] = useState([]); // array contenant les joueurs morts
  const [playersList, setPlayersList] = useState([]); // contains idPlayers
  const [avatarIdList, setAvatarIdList] = useState(null); // a ne changer qu'une fois : avatarIdList[id] = avatarId
  const [usersList, setUsersList]= useState(null); //idem  : usersList[idPlayer] = username
  const [time, setTime] = useState('day');
  const [myRole, setMyRole] = useState();
  const [myIdPlayer, setMyIdPlayer] = useState();
  const [log, setLog] = useState(['Bon jeu !']); // pour les messages d'information
  const [gameOver, setGameOver] = useState(false);

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
        players = JSON.parse(data.data).players;
        setPlayersList(players.map(player => player.idPlayer));
        (async () => {
          try {
            const avIdList = await fetchAvatarIds(players);
            //get my id
            for(const player of players) {
              if (player.username === username){
                setMyIdPlayer(player.idPlayer);
                setMyRole(player.role);
                break;
              }
            }
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
  const fetchGameState = async () => {
    try {
      const data = await fetch(`${url}/game/${idGame}/play`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
      const response = await data.json()
      .then((response) => {
        const gameState = JSON.parse(response.data);
        if(gameState.gameEnded){
          setGameOver(true);
          log.push('Game Over !');
        }
        else {
          const votes = gameState.votes;
          setVotes(votes);
          const hours = parseInt(gameState.gameHour.split(":")[0], 10);
          if(hours < 8 || hours > 21 ) setTime('night');
          else setTime('day');
        }
        const gameMessages = gameState.messages;
        for (const player of gameState.players) {
          if(player.state === 'dead') {
            isDead.push(player.idPlayer);
          }
        }
        if (JSON.stringify(gameMessages) !== JSON.stringify(messages)) {
          setMessages(gameMessages);
        }
      })
    } catch(error) {
      console.log(error);
    }
  }; 
  setTimeout(()=>{fetchGameState();}, 1000);
  // to be done in BodyPartie and FooterPartie
  if(usersList != null && avatarIdList != null) {
    return (
      <View style={styles.container}>
        <NavBarPartie time={time} myRole={myRole}/>
        <BodyPartie 
          idGame={idGame}
          username={username}
          isDead={isDead}
          time={time} 
          playersList={playersList}
          usersList={usersList}
          myIdPlayer={myIdPlayer}
          myRole={myRole}
          token={token}
          votes={votes}
          avatarIdList={avatarIdList} />
        <FooterPartie
          time={time}
          username={username}
          idGame={idGame}
          myRole={myRole}
          myIdPlayer={myIdPlayer}
          isDead={isDead}
          token={token}
          messages={messages}
          log={log}
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

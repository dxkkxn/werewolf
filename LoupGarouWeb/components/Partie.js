import { StyleSheet, Text, View } from "react-native-web";
import NavBarPartie from "./NavBarPartie";
import BodyPartie from "./BodyPartie";
import { useEffect, useState } from "react";
import FooterPartie from "./FooterPartie";
import { useNavigation } from "@react-navigation/native";
const URL = "https://ensi-werewolf.osc-fr1.scalingo.io";

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
  const [log, setLog] = useState(['Bon jeu !', "Pour voter la mort d'un joueur, \ncliquez sur son avatar"]); // pour les messages d'information
  const [gameOver, setGameOver] = useState(false);
  const [myPower, setMyPower] = useState(false);

  const addLog = (msg) => {
    log.push(msg);
  };

  async function fetchAvatarId(username) {
    try {
      const response = await fetch(`${URL}/users/${username}`, {
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


  useEffect(() => {
    if(myPower) {
      if(myPower !== 'none') addLog(`Votre pouvoir : ${myPower}`);
    }
  }, [myPower]);

  const fetchInitial = () => {
    // fetch the usernames and avatar ids once and for all, these wont have to be changed again
    let players = {};
    fetch(`${URL}/game/${idGame}/play`, {
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

    // get my power
    fetch(`${URL}/game/${idGame}/power`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      }
    })
    .then((response) => {
      response.json()
      .then((data) => {
        setMyPower(data.data);
      })
    })
  };
  useEffect(() => {
    if(myRole){
      addLog(myRole === 'werewolf' ? 'Vous etes Loup-Garou' : 'Vous etes Humain');
    }
  }, [myRole]);
  useEffect(() => {
    fetchInitial();
  }, []);
  const fetchGameState = async (interval) => {
    try {
      const data = await fetch(`${URL}/game/${idGame}/play`, {
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
          addLog('Game Over !');
          // who won ?
          let winner = null;
          for (const player of gameState.players) {
            if(player.state == 'alive'){
              winner = player.role;
              break;
            }
          }
          addLog(`les ${winner === 'werewolf' ? 'Loups-Garous' : 'Humains'} ont gagné !`);
          clearInterval(interval);
        }
        else {
          const votes = gameState.votes;
          setVotes(votes);
          for (const player of gameState.players) {
            if(player.state === 'dead') {
              if(!isDead.includes(player.idPlayer)) {
                // find username
                isDead.push(player.idPlayer);
                addLog(`${usersList[player.idPlayer]} a été tué`);
                addLog(`Il était ${gameState.players[player.idPlayer].role === 'werewolf' ? 'Loup-Garou' : 'Humain'} !`);
              }
            }
          }
          const hours = parseInt(gameState.gameHour.split(":")[0], 10);
          if(hours < 8 || hours > 21 ) setTime('night');
          else setTime('day');
        }
        const gameMessages = gameState.messages;
        if (JSON.stringify(gameMessages) !== JSON.stringify(messages)) {
          setMessages(gameMessages);
        }
      })
    } catch(error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if(usersList){
      const interval = setInterval(()=>{fetchGameState(interval);}, 1000);
    }
  }, [usersList]); // ne pas faire les fetch périodiques avant que le fetch initial soit ok
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
          addLog={addLog}
          addLog={addLog}
          avatarIdList={avatarIdList} />
        <FooterPartie
          addLog={addLog}
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

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LockScreen from './components/LockScreen.js';
import {useState, useEffect} from 'react';
import Join from './components/Join.js';
import Welcome from './components/Welcome.js';

export default function App() {
  const [view, setView] = useState("login");
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    document.body.style.display='display-flex';
  });
  const gameProps = {
    hoursToStart: '5',
    nbWolves: '3',
    nbPlayersMin: '9',
    probaC: '0.3',
    probaI: '0.2',
    probaV: '0',
    probaS: '.7',
    dayStart: '8',
    dayEnd: '22',
    avatarId:'4',
    creatorPseudo:"notawolf",
  };
  if(view == "login"){
    return (
      <View style={styles.container}>
        <LockScreen setView={setView} setUser={setUsername}/>
      </View>
    );
  }
  else if (view == "welcome"){
    return(
      <View style={styles.container}>
        <Welcome setView = {setView} username={username}/>
      </View>
    );
  }
  else if (view == "join"){
    return(
      <View style={styles.container}>
        <Join setView = {setView}/>
      </View>
    );
  }
  else if (view == "create"){
    return(
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#371b58',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

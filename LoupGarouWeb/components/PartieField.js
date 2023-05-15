import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { View } from "react-native-web";
const rightArrow = require("../assets/images/bigRightArrow.png");
const ClickableImage = ({ source, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={source} style={styles.rightArrow} />
    </TouchableOpacity>
  );
};
export const PartieField = ({ isDead, text, time, type, username, myIdPlayer, addLog, idGame, token, myRole }) => {
  const [message, setMessage] = useState(null);
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const url = `http://${window.location.hostname}:3000`;
  const handleSubmit = () => {
    if (time === 'night' && myRole === 'human'){
      addLog('Vous ne pouvez pas discuter pendant la nuit');
      return -1;
    }
    if(isDead.includes(myIdPlayer)) {
      addLog('Vous ne pouvez pas envoyer de message en étant mort');
      return -1;
    }
    const messageInput = message;
    //post message
    fetch(`${url}/game/${idGame}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        data: JSON.stringify({
          message: messageInput,
        }),
      }),
    })
    .then((data) => {
      if (!data.ok) { 
        console.log("something went wrong");
      }
      setMessage("");
    })
    .catch((error) => console.error(error));
  };
  if (type == "title") {
    return (
      <View style={styles.box}>
        <Text style={[styles.boxText, {textAlign: 'center', width: "90%x"}]}>
          {text}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.boxSend}>
        <TextInput
          placeholder="Entrez votre message"
          onChangeText={(input) => setMessage(input)}
          value={message}
          style={[
            styles.boxText,
            {
              paddingLeft: 20,
              placeholderTextColor: "#000",
              width: "90%",
            },
          ]}
        >
        </TextInput>
        <View style={styles.boxSendItem}>
          <ClickableImage source={rightArrow} onPress={handleSubmit} />
        </View>
      </View>
    );
  }
  // </View>
};

export default PartieField;

const styles = StyleSheet.create({
  box: {
    boxSizing: "border-box",
    height: "70px",
    width: "201px",
    // margin: 5,
    backgroundColor: "#FFF",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  boxSend: {
    boxSizing: "border-box",
    width: "83%",
    height: "40px",
    backgroundColor: "#FFF",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "20px",
  },
  boxSendItem: {
    width: "23px",
    height: "23px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: "20px",
    marginRight: "10px",
  },
  boxText: {
    // height: "21px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#371B58",
  },
  rightArrow: { width: "17.9px", height: "18px" },
});

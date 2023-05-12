import React from "react";
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
export const PartieField = ({ text, time, type, username, idGame, token }) => {
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const url = `http://${window.location.hostname}:3000`;
  const handleSubmit = (messageInput) => {
    //post message
    fetch(`${url}/${username}/${idGame}` ,{
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
      },
      body: JSON.stringify({
        data : JSON.stringify({
          message: messageInput
        })
      })
    })
    .then(data => {
      if(data.status.created) console.log('message posted');
      else console.log('something went wrong');
    })
    .catch(error => console.error(error)); 
  };
  if (type == "title") {
    return (
      <View style={styles.box}>
        <Text
          style={
            time == "day"
              ? styles.boxText
              : [styles.boxText, { color: "#371B58" }]
          }
        >
          {text}
        </Text>
      </View>
    );
  } else {
    console.log("hi");
    return (
      <View style={styles.boxSend}>
        <TextInput
          placeholder="      Entrez votre message"
          style={[
            styles.boxText,
            {
              width: "300px",
              height: "40px",
              justifyContent: "flex-start",
              // placeholder: "Entrez votre message",
              placeholderTextColor: "#000",
              paddingLeft: "20px",
            },
          ]}
        ></TextInput>
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
    height: "37px",
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
    width: "169px",
    height: "21px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400px",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#371B58",
  },
  rightArrow: { width: "17.9px", height: "18px" },
});

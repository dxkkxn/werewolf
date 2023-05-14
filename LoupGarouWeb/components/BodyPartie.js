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

export default function BodyPartie({ time, usernameList, players, avatarIdList }) {
  console.log("players : ", usernameList);
  const [fetchedData, setFetchedData] = useState(null);
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
  const handleImage = () => {
    console.log("handle image");
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
        {usernameList.map((user, index) => (
          <View key={index} style={styles.container}>
          <ClickableImage
            source={avatars[avatarIdList[index]][0]}
            onPress={handleImage}
          />
          <Text> {user} </Text>
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
    backgroundColor: "#DAC9F2",
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
});

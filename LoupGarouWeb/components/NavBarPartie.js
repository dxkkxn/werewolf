import { Image, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-web";
import PartieField from "./PartieField";
import ClickableImage from "./ClickableImage";
const leftArrow = require("../assets/images/leftArrow.png");
const burguerMenu = require("../assets/images/burguerMenu.png");

export default function NavBarPartie({ time, myRole }) {
  const handleLeftArrow = () => {
    console.log("left arrow pressed");
  };
  const handleBurguerMenu = () => {
    console.log("burguer menu pressed");
  };
  const text= (myRole === 'werewolf') ? "Jour X - Place du village - Vous êtes un Loup Garou" : "Jour X - Place du village - Vous êtes un Humain";
  return (
    <View
      style={
        time == "day"
          ? styles.flexContainer
          : [styles.flexContainer, { backgroundColor: "#2C124A" }]
      }
    >
      <ClickableImage
        source={leftArrow}
        onPress={handleLeftArrow}
        symbol={"leftArrow"}
      />
      <PartieField
        text={text}
        time={time}
        type={"title"}
      />
      <ClickableImage
        source={burguerMenu}
        onPress={handleBurguerMenu}
        symbol={"burguerMenu"}
      />
    </View>
  );
}
// module.exports = NavBarPartie;
const styles = StyleSheet.create({
  flexContainer: {
    height: "70px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#7858A6",
    //
    // justifyContent:"space"
  },
});

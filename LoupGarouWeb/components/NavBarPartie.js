import { Image, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-web";
import PartieField from "./PartieField";
const leftArrow = require("../assets/images/leftArrow.png");
const burguerMenu = require("../assets/images/burguerMenu.png");

const ClickableImage = ({ source, onPress, symbol }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={source}
        style={symbol == "burguerMenu" ? styles.burguerMenu : styles.leftArrow}
      />
    </TouchableOpacity>
  );
};
export default function NavBarPartie({ time }) {
  const handleLeftArrow = () => {
    console.log("left arrow pressed");
  };
  const handleBurguerMenu = () => {
    console.log("burguer menu pressed");
  };
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
        text={"Jour X - Place du village"}
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
    height: "60px",
    width: "360px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#7858A6",
    //
    // justifyContent:"space"
  },
  burguerMenu: {
    width: "27px",
    height: "15px",
    // display: "inline-block",
    // color: "white",
  },
  leftArrow: {
    width: "25.5px",
    height: "18.21px",
  },
});

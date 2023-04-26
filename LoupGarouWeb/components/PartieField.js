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
export const PartieField = ({ text, time, type }) => {
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  console.log(text);
  const handleSubmit = () => {
    console.log("handle submit");
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
          style={[
            styles.boxText,
            {
              width: "300px",
              height: "40px",
              justifyContent: "flex-start",
              placeholder: "Entrez votre message",
              placeholderTextColor: "#000",
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
    // borderWidth: 2,
    // borderStyle: "solid",
    // borderColor: "#7858A6",
    // fontSize: 18,
    // color: "rgba(255, 255, 255, 0.5)",
    // padding: 10,
    // fontFamily: "Poppins",
  },
  boxSend: {
    boxSizing: "border-box",
    width: "323px",
    height: "40px",
    // margin: 5,
    backgroundColor: "#FFF",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "20px",
    // alignSelf: "flex-end",

    // borderWidth: 2,
    // borderStyle: "solid",
    // borderColor: "#7858A6",
    // fontSize: 18,
    // color: "rgba(255, 255, 255, 0.5)",
    // padding: 10,
    // fontFamily: "Poppins",
  },
  boxSendItem: {
    width: "23px",
    height: "23px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: "20px",
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

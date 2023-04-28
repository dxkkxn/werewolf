import { StyleSheet, Text, View } from "react-native-web";
import PartieField from "./PartieField";
import FooterMessageField from "./FooterMessageField";

export default function FooterPartie({ time }) {
  return (
    <View
      style={
        time == "day"
          ? styles.bottomBox
          : [
              styles.bottomBox,
              {
                backgroundColor: "#2C124A",
              },
            ]
      }
      time={time}
    >
      <FooterMessageField />
      <PartieField type={"message"} />
    </View>
  );
}
const styles = StyleSheet.create({
  bottomBox: {
    width: "100%",
    height: "225px",
    backgroundColor: "#7858A6",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBoxMiddleBox: {
    // height: "320px",
    // height: "320px",
    height: "185px",
  },
});

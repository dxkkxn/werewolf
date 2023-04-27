import { StyleSheet, Text, View } from "react-native-web";
import PartieField from "./PartieField";

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
      <View style={styles.bottomBoxMiddleBox}></View>
      <PartieField type={"message"} />
    </View>
  );
}
const styles = StyleSheet.create({
  bottomBox: {
    width: "360px",
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

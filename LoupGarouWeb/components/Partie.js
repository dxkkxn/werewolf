import { StyleSheet, Text, View } from "react-native-web";
import NavBarPartie from "./NavBarPartie";
import BodyPartie from "./BodyPartie";
import FooterPartie from "./FooterPartie";
export default function Partie({ time }) {
  return (
    <View style={styles.container}>
      <NavBarPartie time={time} />
      <BodyPartie time={time} />
      <FooterPartie time={time} type={"message"} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // with: "100vw",
    // height: "100vh",
    // backgroundColor: "red",
    // width: "100%",
    // height: "100%",
    // backgroundColor: "#371b58",
    // height: "70%",
    height: "800px",
    width: "360px",
    backgroundColor: "yellow",
    // alignItems: "center",
    justifyContent: "space-around",
    // top: 14,
  },
  middleBox: {
    width: "360px",
    height: "575px",
    backgroundColor: "orange",
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    padding: "15px",
    gap: "15px",
  },
  middleBoxItem: {
    backgroundColor: "red",
    width: "100px",
    height: "100px",
    borderRadius: "20px",
    // display: "block",
    // padding: "15px",
  },
  bottomBox: {
    width: "360px",
    height: "225px",
    backgroundColor: "green",
  },
});

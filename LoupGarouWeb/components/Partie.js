import { StyleSheet, Text, View } from "react-native-web";
import NavBarPartie from "./NavBarPartie";
import BodyPartie from "./BodyPartie";
import FooterPartie from "./FooterPartie";
export default function Partie({ time }) {
  return (
    <View style={styles.container}>
      <NavBarPartie time={time} />
      <BodyPartie time={time} />
      <FooterPartie time={time} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    // backgroundColor: "yellow",
    justifyContent: "space-around",
  },
});

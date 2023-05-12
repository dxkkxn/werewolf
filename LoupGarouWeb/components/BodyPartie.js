import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native-web";
import { LinearGradient } from "expo-linear-gradient";
//
// const LinearGradient = require("react-native-linear-gradient");
const image1 = require("../assets/images/avatar1.png");

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
export default function BodyPartie({ time }) {
  //TODO fetch avec axios
  const users = [
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
    image1,
  ];
  //Pass token as an id or something add unit key
  const handleImage = () => {
    console.log("handle image");
  };
  return (
    <ScrollView>
      <View
        style={
          time == "day"
            ? styles.middleBox
            : [styles.middleBox, { backgroundColor: "#371B58" }]
        }
      >
        {users.map((user, index) => (
          <ClickableImage key={index} source={user} onPress={handleImage} />
        ))}
      </View>
    </ScrollView>
  );
}
// <Text style={styles.middleBox}>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//         <Text style={styles.middleBoxItem}></Text>
//       </Text>
//
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
});

import { Image, StyleSheet, TouchableOpacity, View } from "react-native-web";
const image1 = require("../assets/images/avatar1.png");

const ClickableImage = ({ source, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={source} style={styles.middleBoxItem} />
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
    <View
      style={
        time == "day"
          ? styles.middleBox
          : [styles.middleBox, { backgroundColor: "#371B58" }]
      }
    >
      {users.map((user) => (
        <ClickableImage source={user} onPress={handleImage} />
      ))}
    </View>
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
    width: "360px",
    height: "575px",
    backgroundColor: "#DAC9F2",
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    padding: "15px",
    gap: "15px",
  },
  middleBoxItem: {
    // backgroundColor: "red",
    width: "100px",
    height: "100px",
    borderRadius: "20px",
    // display: "block",
    // padding: "15px",
  },
});

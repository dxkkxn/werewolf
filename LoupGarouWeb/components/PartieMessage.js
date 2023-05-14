import { StyleSheet, Text, View } from "react-native-web";

export default function PartieMessage({ username, text }) {
  return (
    <View style={styles.messageBox}>
      <Text style={styles.messageId}>{username}:</Text>
      <Text style={styles.messageContent}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageBox: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    // marginTop: "21px",
    marginLeft: "14px",
  },
  messageId: {
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "21px",
    color: "white",
  },
  messageContent: {
    color: "white",
    marginLeft: "8px",
  },
});

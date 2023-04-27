import { ScrollView, StyleSheet, Text, View } from "react-native-web";
import PartieMessage from "./PartieMessage";
export default function FooterMessageField() {
  const messages = [
    { id: "juan Pablo", text: "probando id 1" },
    {
      id: "miguel angel",
      text: "probando id 2",
    },
    { id: "juan Pablo", text: "probando id 1" },
    {
      id: "miguel angel",
      text: "probando id 2",
    },
    { id: "juan Pablo", text: "probando id 1" },
    {
      id: "miguel angel",
      text: "probando id 2",
    },
    { id: "juan Pablo", text: "probando id 1" },
    {
      id: "miguel angel",
      text: "probando id 2",
    },
    { id: "juan Pablo", text: "probando id 1" },
    {
      id: "miguel angel",
      text: "probando id 2",
    },
    { id: "juan Pablo", text: "probando id 1" },
    {
      id: "miguel angel",
      text: "probando id 2",
    },
  ];
  return (
    <View style={styles.footerContainer}>
      <ScrollView styles={styles.scroller}>
        {messages.map((message) => {
          return <PartieMessage id={message.id} text={message.text} />;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    display: "flex",
    flexDirection: "column",
    height: "145px",
    width: "360px",
    marginVertical: "10px",
    justifyContent: "center",
    // marginBottom: "20px",
  },
  scroller: {
    height: "80%",
  },
});

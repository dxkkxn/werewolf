import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native-web";
import PartieMessage from "./PartieMessage";
export default function FooterMessageField({ messages }) {
  // const [messages, setMessages] = useState([]);
  console.log(messages);
  return (
    <View style={styles.footerContainer}>
      <ScrollView styles={styles.scroller}>
        {messages.map((message, index) => {
          return <PartieMessage key={message.idMessage} username={message.username} text={message.body} />;
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

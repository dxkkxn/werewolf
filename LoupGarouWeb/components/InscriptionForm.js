import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export function InscriptionForm() {
  // const [inputValueUsername, setInputValueUsername] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsername = (usernameInput) => {
    // console.log("hola");
    setUsername(usernameInput);
    console.log(username);
  };
  const handlePassword = (passwordInput) => {
    // console.log("hola2");
    setPassword(passwordInput);
    console.log(password);
  };
  return (
    <>
      <View style={styles.flexContainer}>
        <Text style={styles.label}>username</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleUsername}
          value={username}
          placeholder="Enter username"
        />
        <Text style={styles.label}>password</Text>
        <TextInput
          style={styles.input}
          onChangeText={handlePassword}
          value={password}
          placeholder="Enter password"
        />
        <Button title="Submit" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    // backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    fontSize: "25px",
  },
  input: {
    borderBottomWidth: "3px",
    borderBottomColor: "black",
    height: "35px",
    width: "70%",
    borderColor: "gray",
  },
});

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export function ConnectionForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (usernameInput) => {
    setUsername(usernameInput);
    console.log(username);
  };
  const handlePassword = (passwordInput) => {
    setPassword(passwordInput);
    console.log(password);
  };
  return (
    <>
      <View style={styles.flexContainer}>
        <Text style={styles.label}>nom d utilisateur</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleUsername}
          value={username}
          placeholder="Entrez nom d utilisateur"
        />
        <Text style={styles.label}>mot de passe</Text>
        <TextInput
          style={styles.input}
          onChangeText={handlePassword}
          value={password}
          placeholder="Entrez mot de passe"
        />
        <Button title="Connexion" />
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

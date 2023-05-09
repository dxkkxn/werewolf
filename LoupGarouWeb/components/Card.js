import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useState} from 'react';
import { useFonts } from 'expo-font';


export default function Card({ icon, text, onPress}) {
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.presable} onPress={onPress}>
        <Image source={icon} style={styles.image} />
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: "#7858A6",
    shadowColor: "#000000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 60,
    height: 60,
  },
  text: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: 'Poppins',
  },
  presable: {
    height: "60%",
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});

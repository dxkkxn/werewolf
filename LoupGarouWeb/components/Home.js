import React from 'react';
import { useFonts } from 'expo-font';
import { View, StyleSheet, Text } from 'react-native';
import SquareButton from './SquareButton.js';

export const Home = ({pseudo}) => {
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Bonjour {pseudo} ! </Text>
      <SquareButton onPress={() => alert('Button 1 pressed')} size={0.3} title="Créer une partie" />
      <SquareButton onPress={() => alert('Button 2 pressed')} size={0.3} title="Rejoindre une partie" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '70%',
    top: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text:{
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 42,
    color: 'white',
  },
});


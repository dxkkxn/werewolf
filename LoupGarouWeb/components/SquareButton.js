import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';

const SquareButton = ({ icon, iconAlt, onPress, title, size}) => {
  const screenHeight = Dimensions.get('screen').height;
  const buttonSize = (screenHeight * size);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, {width: buttonSize, height: buttonSize}]} onPress={onPress}>
        <img src={icon} alt={iconAlt} />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: '1%',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7858A6',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins',
    fontStyle : 'normal',
    fontWeight: 'bold',
    padding: 10,
  },
});

export default SquareButton;

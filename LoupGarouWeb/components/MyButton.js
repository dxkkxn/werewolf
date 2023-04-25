//Button.js
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useFonts } from 'expo-font';

export function MyButton({label, primary, onPress}){ //takes background color as parameter
  const bgStyle = primary ? {backgroundColor: '#7858a6'} : {backgroundColor: '#371b58', border: "2px solid #7858A6"};
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
	return (
		<View style={styles.buttonContainer}>
		<Pressable style={[styles.button, bgStyle]} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
    // width: 320,
    // height: 68,
    // marginHorizontal: 20,
    alignItems: 'center',
    // justifyContent: 'center',
    //  padding: 3,
    // height: '10%',
  },
  button: {
    borderRadius: 20,
    // textAlign: "center",
    width: "fit-content",
    // alignItems: "center",
    // borderStyle: 'solid',
    // borderColor: '#7858a6',
    // borderWidth: 2,
    // width: '100%',
    // height: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'row',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 400,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontFamily: 'Poppins',
    width: "fit-content",
  },
});

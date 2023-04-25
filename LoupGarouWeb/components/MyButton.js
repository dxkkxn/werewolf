//Button.js
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useFonts } from 'expo-font';

export function MyButton({label, bg, onPress}){ //takes background color as parameter
  const bgStyle = {backgroundColor: bg};
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
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    //  padding: 3,
    // height: '10%',
  },
  button: {
    borderRadius: 20,
    flex: 1,
    borderStyle: 'solid',
    borderColor: '#7858a6',
    borderWidth: 2,
    alignItems: 'safe-center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 400,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontFamily: 'Poppins',
  },
});

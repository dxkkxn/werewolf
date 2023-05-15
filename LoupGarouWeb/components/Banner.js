import { StyleSheet, View, Text} from 'react-native';
import { useFonts } from 'expo-font';


export const Banner = () =>{
    const [loaded] = useFonts({
        'Righteous': require('../assets/fonts/Righteous-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }
    return(
        <View> 
            <Text style={styles.banner}>Loup-Garou </Text>
            <Text style={styles.banner}>En Ligne </Text>
        </View>

    );};

const styles = StyleSheet.create({
    banner: {
        fontSize: 40,
        lineHeight: 50,
        textAlign: 'center',
        fontFamily: 'Righteous',
        color: 'white',
    },
});


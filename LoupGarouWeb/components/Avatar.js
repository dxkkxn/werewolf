import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native-web';
import { LinearGradient } from 'expo-linear-gradient';
//
// const LinearGradient = require("react-native-linear-gradient");
const image1 = require('../assets/images/avatar1.png');
  
export default function Avatar({ source, onPress , clicked}) {
    return (
        <View style={
            clicked == true 
                ? [styles.container, { backgroundColor: '#DAC9F2' }]
                : styles.container
        }>
            <TouchableOpacity onPress={onPress}>       
                <ImageBackground
                    source={source}
                    style={styles.middleBoxItem}
                ></ImageBackground>
            </TouchableOpacity>
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        backgroundColor: '#371B58',
        width: '90px',
        height: '90px',
        borderRadius: '20px',
        linearGradient: 'rgba(0,0,0,0)',
        alignItems: 'center',
        border : '2px',
        justifyContent: 'center',
    // display: "block",
    // padding: "15px",
    },
    middleBoxItem: {
    // backgroundColor: "red",
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        linearGradient: 'rgba(0,0,0,0)',
    // display: "block",
    // padding: "15px",
    },

});
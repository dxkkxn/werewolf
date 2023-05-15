import { StyleSheet, Text, View } from 'react-native-web';
import PartieField from './PartieField';
import FooterMessageField from './FooterMessageField';

export default function FooterPartie({ addLog, time, log, isDead, myIdPlayer, username, idGame, myRole, messages, token }) {
    return (
        <View
            style={
                time == 'day'
                    ? styles.bottomBox
                    : [
                        styles.bottomBox,
                        {
                            backgroundColor: '#2C124A',
                        },
                    ]
            }
            time={time}
        >
            <FooterMessageField messages={messages} log={log}/>
            <PartieField  
                isDead={isDead} 
                time={time} 
                text={'hello'} 
                myIdPlayer={myIdPlayer}
                username={username} 
                myRole={myRole} 
                addLog={addLog}
                idGame={idGame} 
                token={token} 
                type={'message'} />      
        </View>
    );
}
const styles = StyleSheet.create({
    bottomBox: {
        width: '100%',
        height: '30%',
        backgroundColor: '#7858A6',
        // display: "flex",
        // flexDirection: "column",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    // bottomBoxMiddleBox: {
    //   // height: "320px",
    //   // height: "320px",
    //   height: "185px",
    // },
});

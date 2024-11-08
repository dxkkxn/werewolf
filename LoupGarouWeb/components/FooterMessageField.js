import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native-web';
import PartieMessage from './PartieMessage';
export default function FooterMessageField({ messages, log }) {
    return (
        <View style={styles.footerContainer}>
            <ScrollView styles={styles.scroller}>
                {log.map((log, index) => {
                    return <PartieMessage key={index} username={'log'} text={log} />;
                })}
                {messages.map((message, index) => {
                    return <PartieMessage key={message.idMessage} username={message.username} text={message.body} />;
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '65%',
        width: '80%',
        marginVertical: '10px',
        justifyContent: 'center',
    // marginBottom: "20px",
    },
    scroller: {
        height: '80%',
    },
});

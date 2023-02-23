import {React} from 'react';

import { View, StyleSheet, Text} from 'react-native';


function Countdown(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{props.timer}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    timer: {
        color: "white",
        fontFamily: "Buttons",
        fontSize: 200,
    }
})

export default Countdown;
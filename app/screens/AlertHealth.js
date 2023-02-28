import {React, useState} from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';

function AlertHealth(props) {
    return (    
            <View style={styles.menuContainer}>
                <View style={styles.exclamationMark}>
                    <Image source={require("../assets/wykrzyknik.gif")} style={{opacity: 0.5}}></Image>
                </View>
                <Text style={styles.text2} adjustsFontSizeToFit={true} numberOfLines={1}>{props.text1}</Text>
                <Text style={styles.text2} adjustsFontSizeToFit={true} numberOfLines={1}>{props.text2}</Text>
                <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(0, 0, 0, 0.6)",}]} onPress={props.close}>
                    <Text style={styles.text}>BACK</Text>
                </Pressable>   
            </View>     
    );
}
const styles = StyleSheet.create({
    menuContainer: {     
        width: 300, 
        height: 400,
        backgroundColor: "white",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    exclamationMark: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        transform: [{scale: 0.24}]
    },
    buttons: {
        backgroundColor: "rgba(50, 50, 50, 0.5)",
        width: "70%",
        height: 70,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: 'rgb(40,40,40)'
    },
    text: {
        fontSize: 20,
        fontFamily: "Buttons",
        color: "white"
    },
    text2: {
        fontSize: 25,
        fontFamily: "Buttons",
        textAlign: "center",
        color: "rgb(40,40,40)",
    },
})

export default AlertHealth;
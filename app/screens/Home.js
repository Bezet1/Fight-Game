import React from 'react';
import {View, Text, Pressable, StyleSheet, Animated} from 'react-native';

function Home(props) {

    function start(){
        props.setIsHomeScreen(false);
        props.setIsChooseCharacter(true);
    }

    function howToPlay(){navigation.navigate("HowToPlay")}

    function ranking(){console.log("ranking")}

    function exit() {setTimeout(() => BackHandler.exitApp(), 100)}

    return (
        <Animated.View style={[styles.container, {opacity: props.aniOpacity}]}>
            <View press style={styles.titleContainer}>
                <Text style={[styles.title,{top: 30}]} adjustsFontSizeToFit={true} numberOfLines={1}>Fight</Text>
                <Text style={styles.title} adjustsFontSizeToFit={true} numberOfLines={1}>game</Text>          
            </View>
            <View style={styles.options}>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={start}>
                    <Text style={styles.singleText}>START</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={howToPlay}>
                    <Text style={styles.singleText}>HOW TO PLAY</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={ranking}>
                    <Text style={styles.singleText}>RANKING</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={exit}>
                    <Text style={styles.singleText}>EXIT</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        height: 200,
    },
    title:{
        color: "white",
        fontSize: 90,
        fontFamily: "Game",
        textAlign: "center",
    },
    options: {
        alignItems: "center",
        backgroundColor: 'rgba(20, 20, 20, 0.5)',
        borderRadius: 15,
        justifyContent: "space-evenly",
        paddingTop: 30,
        paddingBottom: 30,
    },
    button: {
        backgroundColor: "rgba(70, 70, 120, 0.95)",
        borderRadius: 10,
        width: 230,
        borderWidth: 3,
        borderColor: "rgba(133, 138, 171, 0.7)",
        height: 80,
        elevation: 50,
        marginHorizontal: 35,
        shadowColor: '#000000',
        justifyContent: "center",
        marginVertical: 13,
        
    },
    singleText: {
        fontSize: 25,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons"
    },
})

export default Home;
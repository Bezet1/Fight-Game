import {React, useRef, useState, useContext} from 'react';
import {View, Text, Pressable, StyleSheet, Animated, StatusBar, Image, Vibration} from 'react-native';

function Home(props) {

    //start button clicked
    function start(){
        props.setIsHomeScreen(false);
        props.setIsChooseCharacter(true);
        props.playClick();
    }

    //ranking button clicked
    function ranking(){
        props.navigation.navigate("Ranking");
        props.playClick();
    }

    //exit button clicked
    function exit() {
        props.exit();
        props.playClick();
    }

    function showSound(){
        if(props.isMusic){
            return(
                <Image source={require('../assets/images/musicon.png')} style={styles.soundIMG}/>
            )
        }
        else{
            return(
                <Image source={require('../assets/images/musicoff.png')} style={styles.soundIMG}/>
            )
        }
    }

    return (
        <Animated.View style={[styles.container, {opacity: props.aniOpacity}]}>
            <Pressable style={styles.soundContainer}>
                <Pressable onPress={()=> props.pressedMusic()} style={({pressed}) => [{right: 25}, pressed && {opacity: 0.5, transform: [{ scale: 0.9 }]}]}>
                    {showSound()}
                </Pressable>
            </Pressable>
            <View press style={styles.titleContainer}>
                <Text style={[styles.title,{top: 30}]} adjustsFontSizeToFit={true} numberOfLines={1}>Fight</Text>
                <Text style={styles.title} adjustsFontSizeToFit={true} numberOfLines={1}>game</Text>          
            </View>
            <View style={styles.options}>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], 
                backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={start}>
                    <Text style={styles.singleText}>START</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], 
                backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={ranking}>
                    <Text style={styles.singleText}>RANKING</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], 
                backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={exit}>
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
        justifyContent: "center",
    },
    soundContainer:{
        height: 40, 
        width: '100%', 
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    soundIMG: {
        width: 40,
        height: 40,
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
        justifyContent: "space-evenly",
        paddingVertical: 30,
        marginTop: 40,
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
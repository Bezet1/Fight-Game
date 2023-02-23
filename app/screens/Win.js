import {React, useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, Image, Animated} from 'react-native';

function Win(props) {

    const imgPath = useRef(props.imgpath);
    const myName = useRef(props.name);
    const score = useRef(0);
    const [toRefresh, setToRefresh] = useState(false)

    const imageOpacity =  useRef(new Animated.Value(0)).current

    function startOfModal(){
        setToRefresh((c)=> !c)
        imgPath.current = props.imgpath;
        imageOpacity.setValue(0);
        Animated.timing(imageOpacity, {toValue: 1, useNativeDriver: true, duration: 500, delay: 300}).start();
    }

    return (
        <Modal onShow={startOfModal} visible={props.isVisible} transparent statusBarTranslucent animationType="fade">
            <View style={styles.container}>
                <Text style={styles.winText} adjustsFontSizeToFit={true} numberOfLines={1}>{myName.current}</Text>
                <Text style={styles.winText}>WINS!</Text>
                <View style={styles.imageContainer}>
                    <Animated.Image source={imgPath.current} style={[styles.image, {opacity: imageOpacity}]}/>
                </View>
                <Text style={styles.scoreText}>SCORE: {score.current}</Text>
                <View style={styles.buttonsContainer}>
                    <Pressable onPress={props.restart} style={({pressed})=>[styles.buttonRestart, pressed && {backgroundColor: "#3e135c"}]}>
                        <Text style={styles.buttonText}>REPLAY</Text>
                    </Pressable>
                    <Pressable onPress={props.goMenu} style={({pressed})=>[styles.buttonMenu, pressed && {backgroundColor: "#10135e"}]}>
                        <Text style={styles.buttonText}>BACK TO MENU</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(15, 153, 38, 0.9)",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonMenu:{
        width: 150,
        height: 70,
        backgroundColor: "#181c8c",
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'darkpurple',
        justifyContent: "center",
        alignItems: "center",  
    },
    buttonRestart:{
        width: 150,
        height: 70,
        backgroundColor: "#661f99",
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'darkpurple',
        justifyContent: "center",
        alignItems: "center",   
    },
    winText: {
        textAlign: "center",
        fontSize: 60,
        fontFamily: "Game",
        color: "white",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontFamily: "Buttons",
        textAlign: "center",
    },
    buttonsContainer: {
        marginTop: 15,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    imageContainer:{
        width: 200,
        height: 200,
    },
    image:{
        width: "100%",
        height:'100%',
    },
    scoreText:{
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Buttons",
        color: "white",
    }
})

export default Win;
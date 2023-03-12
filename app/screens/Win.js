import {React, useRef, useState} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, Animated, Dimensions} from 'react-native';

function Win(props) {

    const [forRefresh, setForRefresh] = useState(false)

    const passedArg = useRef({
        imgPath: props.imgPath, myName: props.name, score: props.score, time: props.time})

    const imageOpacity =  useRef(new Animated.Value(0)).current

    //when star of modal
    function startOfModal(){
        
        //set values and start animation
        passedArg.current.score = props.score;
        passedArg.current.imgPath = props.imgpath;
        passedArg.current.time = props.time;

        imageOpacity.setValue(0);
        Animated.timing(imageOpacity, {toValue: 1, useNativeDriver: true, duration: 500, delay: 300}).start();
        
        //update sreen
        setForRefresh((c)=> !c)
    } 

    return (
        <Modal onShow={startOfModal} visible={props.isVisible} transparent statusBarTranslucent animationType="fade">
            <View style={styles.container2}>
            <View style={{height: '100%', width: Math.min(400, Dimensions.get('window').width), alignSelf: 'center'}}>
                <View style={styles.container}>
                    <Text style={styles.winText} adjustsFontSizeToFit={true} numberOfLines={1}>{passedArg.current.myName}</Text>
                    <Text style={styles.winText}>WINS!</Text>
                    <View style={styles.imageContainer}>
                        <Animated.Image source={passedArg.current.imgPath} style={[styles.image, {opacity: imageOpacity}]}/>
                    </View>
                    <Text style={styles.scoreText}>SCORE: {passedArg.current.score}</Text>
                    <Text style={styles.scoreText}>TIME: {passedArg.current.time}</Text>
                    <View style={styles.buttonsContainer}>
                        <Pressable onPress={props.restart} style={({pressed})=>[styles.buttonRestart, 
                            pressed && {backgroundColor: "#3e135c"}]}>
                            <Text style={styles.buttonText}>REPLAY</Text>
                        </Pressable>
                        <Pressable onPress={props.goMenu} style={({pressed})=>[styles.buttonMenu, 
                            pressed && {backgroundColor: "#10135e"}]}>
                            <Text style={styles.buttonText}>BACK TO MENU</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container2:{
        flex: 1,
        backgroundColor: "rgba(15, 153, 38, 0.95)",
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
        marginVertical: 40,
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
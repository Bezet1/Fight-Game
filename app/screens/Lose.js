import {React, useRef, useState, useContext} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, Animated, Dimensions, Image} from 'react-native';

import { MusicContext } from '../assets/modules/MusicContext';

function Lose(props) {

    const {contextObj, setContextObj} = useContext(MusicContext);

    const [forRefresh, setForRefresh] = useState(false)
    
    const oppName = useRef(props.name);
    const imgPath = useRef(props.imgpath);

    const imageOpacity =  useRef(new Animated.Value(0)).current
    const imageUP =  useRef(new Animated.Value(-2)).current

    //when start of modal
    function startOfModal(){
        
        //set values and start animation
        imgPath.current = props.imgpath;
        imageOpacity.setValue(0);
        Animated.timing(imageOpacity, {toValue: 1, useNativeDriver: true, duration: 500, delay: 300}).start();
        
        //update screen
        setForRefresh((c)=> !c)

        //loop opponent animation
        Animated.loop(
            Animated.sequence([
                Animated.spring(imageUP, {toValue: 2, useNativeDriver: true, 
                    restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 1}),
                Animated.spring(imageUP, {toValue: -2, useNativeDriver: true, 
                    restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 1}),
            ])
        ).start();
    }

    //menu button clicked
    function gomenu(){
        imageUP.stopAnimation();
        props.goMenu();
    }

    //restart button clicked
    function replay(){
        imageUP.stopAnimation();
        props.restart();
    }

    return (
        <Modal onShow={startOfModal} visible={props.isVisible} transparent statusBarTranslucent animationType="fade">
            <View style={styles.container2}>
                <View style={{height: '100%', width: Math.min(400, Dimensions.get('window').width), alignSelf: 'center'}}>
                <View style={styles.container}>
                    <Text style={styles.winText} adjustsFontSizeToFit={true} numberOfLines={1}>{oppName.current}</Text>
                    <Text style={styles.winText}>WINS!</Text>
                    <Animated.View style={[styles.imageContainer, {opacity: imageOpacity, transform:[{translateY: imageUP}]}]}>
                        <Image resizeMode='cover' style={styles.image} 
                        source={{uri: contextObj.oppPictureType == "media" ? 
                            contextObj.oppPicture: 'data:image/jpg;base64,' + contextObj.oppPicture?.base64}}/>                    
                    </Animated.View>
                    <View style={styles.buttonsContainer}>
                        <Pressable onPress={replay} style={({pressed})=>[styles.buttonRestart, 
                            pressed && {backgroundColor: "#3e135c"}]}>
                            <Text style={styles.buttonText}>REPLAY</Text>
                        </Pressable>
                        <Pressable onPress={gomenu} style={({pressed})=>[styles.buttonMenu, 
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
        backgroundColor: "rgba(255, 3, 36, 0.9)",
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
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    imageContainer:{
        width: 200,
        height: 200,
        marginVertical: 40,
        borderRadius: 30,
        borderWidth: 3,
        overflow: "hidden"
    },
    image:{
        width: "100%",
        height:'100%',
    },
})

export default Lose;
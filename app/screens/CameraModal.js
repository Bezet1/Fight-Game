import React, {useContext, useState} from 'react';
import { Modal, StyleSheet, View, Text, Pressable, Image, StatusBar ,Vibration} from 'react-native';
import {Camera} from 'expo-camera'
//import { manipulateAsync, FlipType, SaveFormat, ImageManipulator  } from 'expo-image-manipulator';

import { MusicContext } from '../assets/modules/MusicContext';

function CameraModal(props) {

    const {contextObj, setContextObj} = useContext(MusicContext);
    const [cameraType, setCameraType] = useState("back")

    function startOfModal(){

    }

    async function takePicture(){
        let options = {
            quality: 1,
            base64: true,
            exif: false
        }

        Vibration.vibrate(6);

        let newPhoto = await props.cameraRef.current.takePictureAsync(options);

        setContextObj((obj)=> ({...obj, oppPicture: newPhoto, oppPictureType: "camera"}));
        props.setNoElem(false);
    }

    function changeCamera(){
        cameraType == "back" ? setCameraType("front"): setCameraType("back");
    }

    function renew(){
        setContextObj((obj)=> ({...obj, oppPicture: undefined}));
    }

    function back(){
        props.back();
        Vibration.vibrate(6);
    }

    function screen(){
        if(!contextObj.oppPicture || contextObj.oppPictureType == "media"){
            return(
                <View>
                    <Camera style={styles.camera} ratio={"4:3"} ref={props.cameraRef} type={cameraType}>
                        <View style={styles.aroundCamera}/>
                        <View style={styles.fieldOfCamera}/>
                        <View style={styles.aroundCamera}/>
                    </Camera>
                    <View style={[styles.buttonsContainer, {marginTop: 20}]}>
                        <View style={styles.cameraRotate}/>
                        <Pressable style={({pressed})=>[styles.takePicture, pressed && {backgroundColor: '#cccaca'}]} onPress={takePicture}/>
                        <Pressable style={({pressed})=>[styles.cameraRotate, pressed && {transform: [{scale: 0.9}]}]} onPress={changeCamera}>
                            <Image style={styles._100} source={require("../assets/images/cameraRotate.png")}/>
                        </Pressable>
                    </View>
                </View>
            )
        }else{
            return(
                <View>
                    <View>
                        <Image resizeMode='cover' style={styles.preview} source={{uri: 'data:image/jpg;base64,' + contextObj.oppPicture?.base64}}/>
                    </View>
                    <View style={[styles.buttonsContainer, {marginTop: 20}]}>
                        <Pressable style={({pressed})=>[styles.button, pressed && {backgroundColor: 'rgba(255,255,255, 0.4)'}]} onPress={renew}>
                            <Text style={styles.backText}>Discard</Text>
                        </Pressable>
                        <Pressable style={({pressed})=>[styles.button, pressed && {backgroundColor: 'rgba(255,255,255, 0.4)'}]} onPress={back}>
                            <Text style={styles.backText}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            )
        
        }    
    }

    return (
        <Modal onLayout={startOfModal} visible={props.isVisible} transparent statusBarTranslucent animationType="slide">
            <View style={[styles.container, {backgroundColor: 'black'}]}>
                <View style={{height: StatusBar.currentHeight}}/>
                <View style={{flex: 1,justifyContent: 'space-evenly'}}>
                    <View style={{height: 50, justifyContent: "flex-end"}}>
                        <Pressable onPress={back} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                            <Text style={styles.backText}>Back</Text>
                        </Pressable>
                    </View>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        {screen()}
                    </View>
                </View>
            </View>
        </Modal>        
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black'
    },
    center:{
        justifyContent: "center",
        alignItems: "center",
    },  
    camera:{
        aspectRatio: 3/4,
        width: '100%',
        alignSelf: "center",
        backgroundColor: "black",
        justifyContent: "center",
    },
    fieldOfCamera:{
        aspectRatio: 1/1,
    },
    aroundCamera: {
        flex: 1,
        backgroundColor: "rgba(0,0,0, 0.7)"
    },
    preview:{
        width: '100%',
        aspectRatio: 1/1,
        alignSelf: "center",
    },
    takePicture:{
        width: 70,
        height: 70,
        backgroundColor: "white",
        borderRadius: 35,
        borderWidth: 5,
        borderColor: 'white',
    },
    cameraRotate:{
        width: 50,
        height: 50,
        borderRadius: 35,
    },
    backContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 70, 
        height: 40,
        borderRadius: 10,
        marginLeft: 10
    },
    buttonsContainer:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: 70,
        alignItems: "center"
    },
    button: {
        height: 60,
        width: 130,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255, 0.3)',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255,255,255, 0.2)'
    },
    backText:{
        fontSize: 25,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons",
    },
    _100:{
        height: "100%",
        width: '100%',
    }
})

export default CameraModal;
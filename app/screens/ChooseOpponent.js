import React, {useRef, useState, useContext} from 'react';
import {View, Text, Pressable, StyleSheet, Animated, Image, TextInput} from 'react-native';
import {Camera} from 'expo-camera'

import CameraModal from './CameraModal';
import { MusicContext } from '../assets/modules/MusicContext';
function ChooseOpponent(props) {
    //zrobic camera ref i hascamerapermission na context chyba
    const {contextObj, setContextObj} = useContext(MusicContext);
    const cameraRef = useRef();

    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [isCamera, setIsCamera] = useState(false);

    //input logic
    function inputChange (newText) {
        props.setNoName(false);
        props.setOppName(newText); 
    }

    function displayPicture(){
        if(contextObj.oppPicture === undefined){
            if(hasCameraPermission === undefined || hasCameraPermission){
                return (
                    <Text style={styles.noPicture}>No picture...</Text>
                )
           
            }else if(!hasCameraPermission){
                return (
                    <>
                    <Text style={styles.noPicture} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>No picture...</Text>
                    <Text style={styles.noGranted} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>Permisions not granted</Text>
                    <Text style={styles.noGranted} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>change this in settings</Text>
                    </>
                )
            }
        } else{
            return(
                <Image resizeMode='cover' style={styles.takeImg} source={{uri: 'data:image/jpg;base64,' + contextObj.oppPicture?.base64}}/>
            )
        }
    }

    function TakePicture(){
        if(!hasCameraPermission){            
            Camera.requestCameraPermissionsAsync().then((cameraPermission) => {
                setHasCameraPermission(cameraPermission.status === "granted");
                if (cameraPermission.status === "granted") {
                  setIsCamera(true);
                }
              });
        }else{
            setIsCamera(true);   
        }

    }

    return (
        <>
            <CameraModal isVisible={isCamera} cameraRef={cameraRef} 
            back={()=> setIsCamera(false)} setNoElem={(val)=>props.setNoElem(val)}/>
            <View style={{flex: 0.2}}>
                <Pressable onPress={props.backChooseOpponent} style={({pressed})=>
                [styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                    <Text style={styles.backText}>BACK</Text>   
                </Pressable>
            </View>
            <Animated.View style={[styles.container, {transform: [{scale: props.aniScale}], opacity: props.aniOpacity}]}>        
                <View style={styles.center}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>TAKE PICTURE</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>OF OPPONENT</Text>
                </View>
                <View style={styles.center}>
                    <View style={[styles.myOpponentsContainer, props.noOpponent && {borderColor: "rgba(255,70,70, 0.8)"}]}>
                        {displayPicture()}
                    </View>
                    <Pressable onPress={TakePicture} style={({pressed})=> [styles.takePhoto, pressed && {transform: [{ scale: 0.9 }]}]}>
                        <Image resizeMode='contain' source={require("../assets/images/photo.png")} style={styles.takeImg}/>
                    </Pressable>               
                </View>
                <View style={styles.center}>
                    <TextInput style={[styles.input, props.noName && {borderWidth: 3, borderColor:"rgba(255,70,70, 0.8)"}]} placeholder="Opponent's name" 
                            placeholderTextColor={"#444444"} textAlign={"center"}
                            onChangeText={newText => {inputChange(newText)}} value={props.myName} maxLength={15}
                            />
                </View>
                <View style={styles.center}>
                    <Pressable style={({pressed}) => [styles.buttonChooseDifficulty, 
                    {marginHorizontal: 0, marginVertical: 0}, pressed && {transform: [{ scale: 0.9 }], 
                    backgroundColor: "rgba(37, 37, 64, 0.5)",}]} 
                    onPress={() => props.confirmChooseOpponent()}>
                        <Text style={{textAlign:'center', fontSize: 30, fontFamily: 'Buttons', color: 'white'}}>CONFIRM</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </>
    );
}



const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: "space-between", 
        marginBottom: 50,
    },
    center:{
        justifyContent:'center', 
        alignItems: "center"
    },
    textChooseDifficulty: {
        fontSize: 40,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons",
    },
    myOpponentsContainer: {
        justifyContent: "center",
        width: 250,
        height: 250,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 3,
        borderColor: 'rgba(0, 0, 0, 0.7)',
        overflow: "hidden"
    },
    individualOpponent:{
        margin: 5,
        flex:1,
        borderRadius: 1,
        borderWidth: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        flexDirection: 'row',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    buttonChooseDifficulty: {
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
        marginVertical: 50,
    },
    backContainer: {
        marginLeft: 10,
        marginTop: 60,
        width: 75,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignContent: "center",
    },
    backText: {
        color: "white",
        fontSize: 20,
        fontFamily: "Buttons",
        textAlign:"center",
    },
    takePhoto: {
        width: 60,
        height: 60,
        borderRadius: 40,
        borderWidth: 3,
        marginTop: 10,
        padding:8,
        borderColor: "rgba(150,150,150, 0.8)",
        backgroundColor: "rgba(100,100,100, 0.5)"
    },
    noPicture: {
        fontSize: 20,
        textAlign: "center",
        color: "rgba(255,255,255, 0.8)",
        fontFamily: "Buttons",
    },
    noGranted: {
        fontSize: 15,
        textAlign: "center",
        color: "rgba(255,70,70, 0.8)",
        fontFamily: "Buttons",
    },
    takeImg: {
        width: '100%',
        height: '100%',
    },
    input: {
        height: 40,
        width: 260,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
})


export default ChooseOpponent;
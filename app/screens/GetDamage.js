import {React, useRef, useState, useContext} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, ImageBackground, Image, 
    SafeAreaView, Animated, StatusBar, Dimensions, Vibration} from 'react-native';

import { MusicContext } from '../assets/modules/MusicContext';

const GetDamage = (props) => {

    let GetDamageDuration = 8000;

    const {contextObj, setContextObj} = useContext(MusicContext);

    const[health, setHealth] =  useState(0);
    const [isElem, setIsElem] = useState({point: false, text: false})
    
    const healthPass = useRef(0);
    const maxHealth = useRef(props.maxHealth);
    const view = useRef({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - (50 + StatusBar.currentHeight),
    });
    const oppPos = useRef({x: 0.0, y: 0.0});
    const firstRound = useRef(true);
    const restSpeedThreshold_value = useRef(null);
    const restDisplacementThreshold_value = useRef(null);
    const oppVal = useRef({name: props.oppName});
    const isFinish = useRef(false);
    
    const textProgress = useRef(new Animated.Value(0)).current;
    const pointPosition =  useRef(new Animated.ValueXY({x: 0, y: 0})).current
    const pointOpacity =  useRef(new Animated.Value(0)).current;
    const opponentPosition =  useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    const spinValue =  useRef(new Animated.Value(0)).current;
    
    const spinOpponent = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    
    //random numbers
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    function randomNumber(min, max) { 
        return Math.random() * (max - min) + min;
    }

    //setting difficulty
    function setDifficulty(){
        if(props.difficulty === "easy"){
            restSpeedThreshold_value.current = 0.5;
            restDisplacementThreshold_value.current = 0.9;
        }
        else{
            restSpeedThreshold_value.current = 10;
            restDisplacementThreshold_value.current = 2;
        }
    }

    //setting values
    function initialValues(){
        setHealth(() => props.health);
        healthPass.current = props.health;
        maxHealth.current = props.maxHealth;
        firstRound.current = props.firstRound;
        opponentPosition.setValue({x: view.current.width/2, y: view.current.height * 1.5});
        spinValue.setValue(0);
        isFinish.current = false;
    }

    //check if first round
    function checkFirstRound(){
        if(firstRound.current){
            setIsElem((obj)=> ({...obj, text: true}));
            textProgress.setValue(0);
            Animated.spring(textProgress, {toValue: 1, useNativeDriver: true, delay: 500}).start();
            setTimeout(() => {
                Animated.spring(textProgress, {toValue: 0, useNativeDriver: true}).start(() => setIsElem((obj)=> ({...obj, text: false})));
            }, 2500);
        }
    }

    //each time at the begining
    function startOfModal(){

        setDifficulty();

        initialValues();
        
        checkFirstRound();
        
        //start moving opponent
        setTimeout(()=> {
            intervalForOpponent();
            startListener(opponentPosition, "x");
            startListener(opponentPosition, 'y');
        }, firstRound.current ? 3000: 1000)
        
        //set end of round
        setTimeout(() => {
            if(!isFinish.current){
                endOfModal();
                isFinish.current = true;
            }
        }, firstRound.current ? GetDamageDuration + 2000: GetDamageDuration);
        
    }

    function startListener(oppPosition, corinate){
        oppPosition[corinate].removeAllListeners();

        oppPosition[corinate].addListener(({value}) => {
            oppPos.current[corinate] = value
        });
    }
    
    //opponents moving logic
    function intervalForOpponent() {
        
        //start move animation
        Animated.spring(opponentPosition, {toValue: {x: getRandomInt(view.current.width - 30), y: getRandomInt(view.current.height - 60)}, 
        useNativeDriver: true, speed: 200, restSpeedThreshold: 10, restDisplacementThreshold: 0.9
        }).start(({finished}) => {
            if(finished){
                
                //second move animations 
                Animated.spring(opponentPosition, {toValue: {x: oppPos.current.x + randomNumber(-100, 100), y: oppPos.current.y + randomNumber(-100, 100)},
                useNativeDriver: true, restSpeedThreshold: restSpeedThreshold_value.current, restDisplacementThreshold: restDisplacementThreshold_value.current 
            }).start(({finished}) => {
                    if(finished){
                        
                        //stop animations and renew interval
                        opponentPosition.stopAnimation();
                        intervalForOpponent();
                    }
                })        
            }
        })
    }

    //when opponent clicked
    function enemyHit(evt){

        Vibration.vibrate(10);

        //stop moving animations
        opponentPosition.stopAnimation();   

        //return if out of health
       if(healthPass.current <= 0){
            return;
       }
        
        //decrement health
        healthPass.current = healthPass.current - 1;
        setHealth((val) => val - 1); 

        //when opponent hp = 0, end of modal
        if(healthPass.current <= 0){
            setTimeout(() => {
                if(!isFinish.current){
                    endOfModal();
                    isFinish.current = true;
                }
            }, 300);
        }

        pointAnimation(evt);
        
        //spin opponent after hit
        spinValue.setValue(0);
        Animated.spring(spinValue, {toValue: 1, useNativeDriver: true, speed: 0.01}).start();
        
        //renew opponent animation
        intervalForOpponent();
    }
    
    function pointAnimation(evt){

        //set point position
        pointPosition.setValue({x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY - 180});
        pointOpacity.setValue(0);
        setIsElem((obj)=> ({...obj, point: true}));
        
        //start point animation
        Animated.parallel([
            Animated.sequence([
                Animated.timing(pointOpacity, {toValue: 1, useNativeDriver: true, duration: 100}),
                Animated.timing(pointOpacity, {toValue: 0, useNativeDriver: true, duration: 200, delay: 200}),
            ]),
            Animated.spring(pointPosition.y, {toValue: evt.nativeEvent.pageY - 300, useNativeDriver: true, mass: 10}),
        ]).start(()=> setIsElem((obj)=> ({...obj, point: false})))
    }

    //when end of modal, stop animations
    function endOfModal(){
        spinValue.setValue(0);
        textProgress.stopAnimation();
        pointPosition.stopAnimation();
        pointOpacity.stopAnimation();
        opponentPosition.stopAnimation();
        spinValue.stopAnimation();
        opponentPosition.setValue({x: view.current.width/2, y: 2 * view.current.height});
        props.close(healthPass.current);
    }

    //creating opponent
    function opponent(){
        return (
            <Animated.View style={[{transform: [{translateX: opponentPosition.x}, {translateY: opponentPosition.y}, {rotate: spinOpponent} ]}, styles.opponentContainer]}>
                <Pressable onPress={(evt) => enemyHit(evt)}>
                    <Image resizeMode='cover' style={styles.opponentIMG} source={{uri: contextObj.oppPictureType == "media" ? 
                    contextObj.oppPicture: 'data:image/jpg;base64,' + contextObj.oppPicture?.base64}}/>
                </Pressable>
            </Animated.View>
        ) 
    }
    
    function middleText(){
        if(isElem.text){
            return(
                <Animated.View
                style={{position: 'absolute', height: '70%', margin: 20, top: '35%', alignSelf: 'center', opacity: textProgress, transform: [{scale: textProgress}]}}>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>HIT OPPONENT</Text>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TO LOWER HP!</Text>
                </Animated.View>
            )
        }
    }

    function point(){
        if(isElem.point){
            return(
                <Animated.View style={{transform: [{translateX: pointPosition.x}, {translateY: pointPosition.y}], opacity: pointOpacity}}>
                    <Text style={styles.point}>-1</Text>
                </Animated.View>
            )
        }
    }

    return (
        <Modal onShow={startOfModal} visible={props.isVisible} statusBarTranslucent animationType="slide">
            <ImageBackground style={styles.background} source={require("../assets/images/tloRed.jpg")}>
            <SafeAreaView style={styles.background}>
            <View style={{height: '100%', width: Math.min(400, Dimensions.get('window').width), alignSelf: 'center'}}>
                <View style={styles.container}>
                    <View style={[styles.damageContainer, {height: 50 + StatusBar.currentHeight}]}>
                        <Text style={styles.valueText} adjustsFontSizeToFit={true} numberOfLines={1}>{oppVal.current.name} {health}/{maxHealth.current}</Text>
                    </View>
                    <View style={styles.fieldContainer}>       
                        {opponent()}
                        {middleText()}
                        {point()}
                    </View>
                </View>
            </View>
            </SafeAreaView>
            </ImageBackground>
        </Modal>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width:"100%"
    },
    container: {
        flex: 1,
    },
    damageContainer:{
        height: 80,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    fieldContainer: {
        flex: 1,
    },
    opponentIMG: {
        width: '100%',
        height: '100%',   
    },
    opponentContainer: {
        width: 30,
        height: 30,
        borderRadius: 7,
        overflow: "hidden",
        borderWidth: 0.7
    }, 
    valueText: {
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Buttons",
        color: "white",
        fontWeight: "300",
    },
    middleText: {
        fontSize: 60,
        color: "white",
        fontFamily: "Buttons",
        textAlign: "center",
    },
    point:{
        fontFamily: "Buttons", 
        color: "#ff0000",
        fontSize: 30,
    }
})

export default GetDamage;
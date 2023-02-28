import {React, useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, ImageBackground, Image, SafeAreaView, Animated, StatusBar, Dimensions} from 'react-native';


const GetDamage = (props) => {

    let GetDamageDuration = 8000;
    const restSpeedThreshold_value = useRef(null);
    const restDisplacementThreshold_value = useRef(null);
    const oppPath = useRef(props.imgpath);

    
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    function randomNumber(min, max) { 
        return Math.random() * (max - min) + min;
    } 
    
    const healthPass = useRef(0);
    const[health, setHealth] =  useState(0);
    const[isPoint, setIsPoint] = useState(false);
    const[isText, setIsText] = useState(false);
    const viewHeight = useRef(Dimensions.get('window').height - (50 + StatusBar.currentHeight));
    const viewWidth = useRef(Dimensions.get('window').width);
    const oppX = useRef();
    const oppY = useRef();
    const firstRound = useRef(true);
    const maxHealth = useRef(props.maxHealth)
    const oppName = useRef(props.oppName);

    const textProgress = useRef(new Animated.Value(0)).current;
    const pointPosition =  useRef(new Animated.ValueXY({x: 0, y: 0})).current
    const pointOpacity =  useRef(new Animated.Value(0)).current
    const opponentPosition =  useRef(new Animated.ValueXY({x: 0, y: 0})).current
    const spinValue =  useRef(new Animated.Value(0)).current
    
    const spinOpponent = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    
    function startOfModal(){
        if(props.difficulty === "easy"){
            restSpeedThreshold_value.current = 0.5;
            restDisplacementThreshold_value.current = 0.9;
        }
        else{
            restSpeedThreshold_value.current = 10;
            restDisplacementThreshold_value.current = 2;
        }
        
        setHealth(() => props.health);
        healthPass.current = props.health;
        maxHealth.current = props.maxHealth;
        firstRound.current = props.firstRound;
        opponentPosition.setValue({x: viewWidth.current/2, y: viewHeight.current * 1.5})
        oppPath.current = props.imgpath;

        if(firstRound.current){
            setIsText(() => true)
            textProgress.setValue(0);
            Animated.spring(textProgress, {toValue: 1, useNativeDriver: true, delay: 500}).start();
            setTimeout(() => {
                Animated.spring(textProgress, {toValue: 0, useNativeDriver: true}).start(() => setIsText(() => false));
            }, 2500);
        }
        
        setTimeout(()=> {
            intervalForOpponent();
        }, firstRound.current ? 3000: 1000)
        
        //end of round
        setTimeout(() => {
            textProgress.stopAnimation();
            pointPosition.stopAnimation();
            pointOpacity.stopAnimation();
            opponentPosition.stopAnimation();
            spinValue.stopAnimation();

            props.close(healthPass.current);
            opponentPosition.setValue({x: viewWidth.current/2, y: 2 * viewHeight.current});
        }, firstRound.current ? GetDamageDuration + 2000: GetDamageDuration);
        
    }
    
    const intervalForOpponent =() => {
          
        //get enemy position
        opponentPosition.x.addListener(({value}) => oppX.current = value);
        opponentPosition.y.addListener(({value}) => oppY.current = value);
        
        Animated.spring(opponentPosition, {toValue: {x: getRandomInt(viewWidth.current - 30), y: getRandomInt(viewHeight.current - 60)}, 
        useNativeDriver: true, speed: 200, restSpeedThreshold: 10, restDisplacementThreshold: 0.9
        
        }).start(({finished}) => {
            if(finished){
                Animated.spring(opponentPosition, {toValue: {x: oppX.current + randomNumber(-100, 100), y: oppY.current + randomNumber(-100, 100)},
                useNativeDriver: true, restSpeedThreshold: restSpeedThreshold_value.current, restDisplacementThreshold: restDisplacementThreshold_value.current 
            
            }).start(({finished}) => {
                    if(finished){
                        Animated.spring(opponentPosition, {toValue: {x: getRandomInt(viewWidth.current - 30), y: getRandomInt(viewHeight.current - 60)}, 
                        useNativeDriver: true, speed: 500, restSpeedThreshold: 10, restDisplacementThreshold: 0.9}).stop()
                        intervalForOpponent();
                    }
                })        
            }
    })
    
    }

    function enemyHit(evt){

       if(healthPass.current <= 0){
            return;
       }
        
        healthPass.current = healthPass.current - 1;
        setHealth((val) => val - 1); 

        //when beat
        if(healthPass.current <= 0){
            setTimeout(() => {
                textProgress.stopAnimation();
                pointPosition.stopAnimation();
                pointOpacity.stopAnimation();
                opponentPosition.stopAnimation();
                spinValue.stopAnimation();
                
                props.close(healthPass.current);
                opponentPosition.setValue({x: viewWidth.current/2, y: 2 * viewHeight.current});
            }, 300);
        }
    
        opponentPosition.stopAnimation();   
        opponentPosition.stopAnimation();

        //point position
        pointPosition.setValue({x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY - 180});
        pointOpacity.setValue(0);
        
        setIsPoint(()=>true)
        
        //point animation
        Animated.parallel([
            Animated.sequence([
                Animated.timing(pointOpacity, {toValue: 1, useNativeDriver: true, duration: 100}),
                Animated.timing(pointOpacity, {toValue: 0, useNativeDriver: true, duration: 200, delay: 200}),
            ]),
            Animated.spring(pointPosition.y, {toValue: evt.nativeEvent.pageY - 300, useNativeDriver: true, mass: 10}),
        ]).start(()=> setIsPoint(()=>false))
        
        //spin after hit
        spinValue.setValue(0);
        Animated.spring(spinValue, {toValue: 1, useNativeDriver: true, speed: 0.01}).start();
        
        //opponent animation
        intervalForOpponent();
    

    }

    //creating opponent
    function opponent(){
        return (
            <Animated.View style={[{transform: [{translateX: opponentPosition.x}, {translateY: opponentPosition.y}, {rotate: spinOpponent} ]}, styles.opponentContainer]}>
                <Pressable onPress={(evt) => enemyHit(evt)}>
                    <Image source={oppPath.current} style={styles.opponentIMG}/>
                </Pressable>
            </Animated.View>
        ) 
    }
    
    function middleText(){
        if(isText){
            return(
                <Animated.View
                style={{position: 'absolute', height: '70%', top: '35%', alignSelf: 'center', opacity: textProgress, transform: [{scale: textProgress}]}}>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TAP ENEMY</Text>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TO GET DAMAGE!</Text>
                </Animated.View>
            )
        }
    }
    function point(){
        if(isPoint){
            return(
                <Animated.View style={{transform: [{translateX: pointPosition.x}, {translateY: pointPosition.y}], opacity: pointOpacity}}>
                    <Text style={styles.point}>-1</Text>
                </Animated.View>
            )
        }
    }

    return (

        <Modal onShow={startOfModal} visible={props.isVisible} statusBarTranslucent animationType="slide">
            <ImageBackground style={styles.background} source={require("../assets/tlo2.jpg")}>
            <SafeAreaView style={styles.background}>
                <View style={styles.container}>
                    <View style={[styles.damageContainer, {height: 50 + StatusBar.currentHeight}]}>
                        <Text style={styles.valueText} adjustsFontSizeToFit={true} numberOfLines={1}>{oppName.current} {health}/{maxHealth.current}</Text>
                    </View>
                    <View style={styles.fieldContainer}>       
                        {opponent()}
                        {middleText()}
                        {point()}
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
        backgroundColor: "rgba(0, 0, 0, 0.3)"
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
        borderRadius: 10,  
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
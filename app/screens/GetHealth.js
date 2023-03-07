import {React, useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, ImageBackground, Image, SafeAreaView, Animated, StatusBar} from 'react-native';

function GetHealth(props) {
    
    const [health, setHealth] = useState(props.health);
    const [isElem, setIsElem]= useState({medKit: false, point: false, text: false});
    const [counterOfKit, setCounterOfKit] = useState(0);
    const [bonus, setBonus] = useState(1);
    
    const howFastIsChange = useRef(null);
    const firstRound = useRef(true);
    const changeTimeout = useRef({_1:null, _2:null})
    const bonusCounter = useRef(0);
    const healthPass = useRef(0);
    const view = useRef({width: 0.0, height: 0.0});
    const maxHealth = useRef(props.maxHealth)
    
    const medKitPosition =  useRef(new Animated.ValueXY({x: 0, y: 0})).current
    const pointPosition =  useRef(new Animated.ValueXY({x: 0, y: 0})).current
    const pointOpacity =  useRef(new Animated.Value(0)).current
    const kitOpacity = useRef(new Animated.Value(0)).current
    const textProgress = useRef(new Animated.Value(0)).current;
    const bonusOpacity = useRef(new Animated.Value(0)).current;
    const bonusPosition =  useRef(new Animated.Value(-20)).current 
    
    function randomNumber(min, max) { 
        return Math.random() * (max - min) + min;
    } 

    //getting dimentions of view
    function getDimentions(layout){
        view.current.height = layout.height;
        view.current.width = layout.width;
    }

    //set game diffuculty
    function setDifficulty(){
        if(props.difficulty === "easy"){
            howFastIsChange.current = 600;
        }
        else{
            howFastIsChange.current = 500;
        }
    }

    //check if first round
    function checkFirstRound(){
        if(firstRound.current){
            setIsElem((obj)=>({...obj, text: true}))
            textProgress.setValue(0);
            Animated.spring(textProgress, {toValue: 1, useNativeDriver: true, delay: 500}).start();
            setTimeout(() => {
                Animated.spring(textProgress, {toValue: 0, useNativeDriver: true}).start(() => setIsElem((obj)=>({...obj, text: false})));
            }, 2500);
        }
    }

    //set actual values
    function setInitialValues(){
        healthPass.current = props.health;
        setHealth(()=> props.health);
        maxHealth.current = props.maxHealth;
    }

    //start animations of bonus
    function bonusAnimation(){
        Animated.loop(
            Animated.sequence([
                Animated.timing(bonusPosition, {toValue: 20, useNativeDriver: true, duration: 750}),
                Animated.timing(bonusPosition, {toValue: -20, useNativeDriver: true,duration: 750}),
            ])
        ).start();

    }

    //start of modal
    function startOfModal(){

        setDifficulty();
        
        firstRound.current = props.firstRound;
        
        checkFirstRound();
        
        setInitialValues();
        
        bonusAnimation();

        //start showing medkit
        setTimeout(()=> {
            kitHit();
        }, firstRound ? 3000: 0)
        
    }

    //end of modal
    useEffect(()=>{
        if(counterOfKit == 6){     
            setTimeout(() => {              
                endModal();
            }, 1500);
        }
    }, [counterOfKit])
    
    //changes of position 
    function kitHit(){

        //set new position
        medKitPosition.x.setValue(randomNumber(0, view.current.width - 80))
        medKitPosition.y.setValue(randomNumber(0, view.current.height - 80))
        
        //show medkit
        changeTimeout.current._1 = setTimeout(() => {
            kitOpacity.setValue(0);
            setIsElem((obj)=>({...obj, medKit: true}))
            setCounterOfKit((current)=> current + 1);
            Animated.spring(kitOpacity, {toValue: 1, useNativeDriver: true, duration: 100}).start();
            
            //hide medkit
            changeTimeout.current._2 = setTimeout(() => {
                setIsElem((obj)=>({...obj, medKit: false}))
                if(counterOfKit != 6){
                    kitHit();
                    bonusCounter.current = 0;
                    Animated.timing(bonusOpacity, {toValue: 0, useNativeDriver: true, duration: 300}).start();
                }
            }, howFastIsChange.current);
            
        }, randomNumber(1000, 2000)); 
    }
    
    function pointAnimation(){

        //set point position
        pointPosition.setValue({x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY - 180});
        pointOpacity.setValue(0);
        setIsElem((obj)=>({...obj, point: true}));
        
        //start point animation
        Animated.parallel([
            Animated.sequence([
                Animated.timing(pointOpacity, {toValue: 1, useNativeDriver: true, duration: 100}),
                Animated.timing(pointOpacity, {toValue: 0, useNativeDriver: true, duration: 200, delay: 200}),
            ]),
            Animated.spring(pointPosition.y, {toValue: evt.nativeEvent.pageY - 300, useNativeDriver: true, mass: 10}),
        ]).start(()=> setIsElem((obj)=>({...obj, point: false})))    
    }
    
    //when medkit pressed
    function kitPressed(evt){
        
        //return if player has max health
        if(healthPass.current == maxHealth.current){
            return;
        }
        
        //track bonus
        bonusCounter.current = bonusCounter.current + 1;
        
        //adding damage
        if(bonusCounter.current == 1){
            setHealth((current)=>current + 1);
            healthPass.current = healthPass.current + 1; 
        }
        else if(bonusCounter.current == 2){
            setHealth((current)=>current + 2);
            healthPass.current = healthPass.current + 2;
            bonusOpacity.setValue(0);
            Animated.timing(bonusOpacity, {toValue: 1, useNativeDriver: true, duration: 300}).start();
            setBonus(()=>1);
        }
        else if(bonusCounter.current >= 3){
            setHealth((current)=>current + 3);
            healthPass.current = healthPass.current + 3;
            setBonus(()=>2);
        }
        
        //check if player has max health
        if(healthPass.current >= maxHealth.current){
            
            healthPass.current = maxHealth.current;
            setHealth(()=>maxHealth.current);
            
            setTimeout(() => {
                endModal();
            }, 300);
        }
        
        //reset values
        setIsElem((obj)=>({...obj, medKit: false}));
        clearTimeout(changeTimeout.current._1);
        clearTimeout(changeTimeout.current._2);

        pointAnimation();
        
        //start new show of medkit
        kitHit();
        
    }
    
    //stop animations and timeouts
    function stopAllAnimation(){
        medKitPosition.stopAnimation(); 
        pointPosition.stopAnimation();
        pointOpacity.stopAnimation();
        kitOpacity.stopAnimation();
        textProgress.stopAnimation();
        bonusOpacity.stopAnimation();
        bonusPosition.stopAnimation();
        clearTimeout(changeTimeout.current._1);
        clearTimeout(changeTimeout.current._2);
    }

    //end of modal
    function endModal(){
        props.close(healthPass.current);
        setIsElem((obj)=>({...obj, medKit: false}));
        setCounterOfKit(()=>0);
        bonusCounter.current = 0;
        setBonus(()=>1);
        bonusOpacity.setValue(0);
        stopAllAnimation();  
    }
    
    function medkit(){
        if(isElem.medKit){
            return (
                <Animated.View style={{transform: [{translateX: medKitPosition.x}, {translateY: medKitPosition.y}], opacity: kitOpacity}}>
                <Pressable onPress={(evt)=> kitPressed(evt)} style={styles.medKitContainer}>
                    <Image source={require("../assets/aidkit.png")} style={styles.medkit}/>
                </Pressable>
            </Animated.View>
            )
        }
    }
    
    function point(){
        if(isElem.point){
            return(
                <Animated.View style={{transform: [{translateX: pointPosition.x}, {translateY: pointPosition.y}], opacity: pointOpacity}}>
                    <Text style={styles.point}>+1</Text>
                </Animated.View>
            )
        }
    }
    
    function middleText(){
        if(isElem.text){
            return(
                <Animated.View
                style={{position: 'absolute', height: '70%', margin: 20, top: '35%', alignSelf: 'center', opacity: textProgress, transform: [{scale: textProgress}]}}>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TAP MEDKIT</Text>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TO HEAL!</Text>
                </Animated.View>
            )
        }
    }
    
    
    return (
        <Modal onShow={startOfModal} visible={props.isVisible} statusBarTranslucent animationType="slide">
            <ImageBackground style={styles.background} source={require("../assets/green.jpg")}>
                <SafeAreaView style={styles.background}>
                <View style={styles.container}>
                    <View style={[styles.textContainer, {height: 50 + StatusBar.currentHeight}]}>
                        <Text style={styles.valueText} adjustsFontSizeToFit={true} numberOfLines={1}>HP {health}/{maxHealth.current}</Text>
                    </View>
                    <Animated.View style={[styles.textContainer, {opacity: bonusOpacity, transform: [{translateX: bonusPosition}]}]}>
                        <Text style={styles.bonusText} adjustsFontSizeToFit={true} numberOfLines={1}>BONUS: +{bonus}</Text>
                    </Animated.View>
                    <View onLayout={(event) => getDimentions(event.nativeEvent.layout)} style={styles.fieldContainer} collapsable={false}>
                        {medkit()} 
                        {point()}
                        {middleText()}
                    </View>
                </View>
                </SafeAreaView>
            </ImageBackground>
        </Modal>
    );
}

const styles = StyleSheet.create({
    medkit: {
        width: '100%',
        height: '100%',
    },
    medKitContainer: {
        justifyContent: "center",
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 10,
    }, 
    container: {
        flex: 1,
        alignItems: "center",
    },
    background: {
        flex: 1,
        width:"100%"
    },
    valueText: {
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Buttons",
        color: "white",
        fontWeight: "300",
    },
    fieldContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    textContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    point:{
        fontFamily: "Buttons", 
        color: "#9e00a1",
        fontSize: 30,
    },
    middleText: {
        fontSize: 60,
        color: "white",
        fontFamily: "Buttons",
        textAlign: "center",
    },
    bonusText: {
        textAlign: "center",
        fontSize: 20,
        fontFamily: "Buttons",
        color: "red",
    },
})


export default GetHealth;
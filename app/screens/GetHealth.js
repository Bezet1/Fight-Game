import {React, useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text, Modal, Pressable, ImageBackground, Image, SafeAreaView, Animated, StatusBar} from 'react-native';


function GetHealth(props) {

    const howFastIsChange = useRef(null);
    const healthPass = useRef(0);
    const [health, setHealth] = useState(props.health);
    const [isMedKit, setIsMedKit] = useState(false);
    const[isPoint, setIsPoint] = useState(false);
    const changeTimeout1 = useRef();
    const changeTimeout2 = useRef();
    const [kitHit, setKitHit] = useState(false);
    const [firstUpdateInterval, setFirstUpdateInterval] = useState();
    const [counterOfKit, setCounterOfKit] = useState(0);
    const[isText, setIsText] = useState(false);
    const firstRound = useRef(true);
    const[bonus, setBonus] = useState(1);
    const bonusCounter = useRef(0);
    const viewWidth = useRef();
    const viewHeight = useRef();
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
    
    //start of modal
    function startOfModal(){
        //set game diffuculty
        if(props.difficulty === "easy"){
            howFastIsChange.current = 600;
            
        }
        else{
            howFastIsChange.current = 500;
        }
        
        firstRound.current = props.firstRound;

        if(firstRound.current){
            setIsText(() => true)
            textProgress.setValue(0);
            Animated.spring(textProgress, {toValue: 1, useNativeDriver: true, delay: 500}).start();
            setTimeout(() => {
                Animated.spring(textProgress, {toValue: 0, useNativeDriver: true}).start(() => setIsText(() => false));
            }, 2500);
        }

        healthPass.current = props.health;
        setHealth(()=> props.health);
        maxHealth.current = props.maxHealth;

        Animated.loop(
            Animated.sequence([
                Animated.timing(bonusPosition, {toValue: 20, useNativeDriver: true, duration: 750}),
                Animated.timing(bonusPosition, {toValue: -20, useNativeDriver: true,duration: 750}),
            ])
        ).start();

        setTimeout(()=> {
            setKitHit((c)=> !c);
        }, firstRound ? 3000: 0)
        
    }
    
    //changes of position 
    useEffect(()=>{
        if(!firstUpdateInterval){
            setFirstUpdateInterval(()=>true);
            return;
        }

        medKitPosition.x.setValue(randomNumber(0, viewWidth.current - 80))
        medKitPosition.y.setValue(randomNumber(0, viewHeight.current - 80))

        changeTimeout1.current = setTimeout(() => {

            kitOpacity.setValue(0);
            setIsMedKit(()=>true); 
            setCounterOfKit((current)=> current + 1);

            Animated.spring(kitOpacity, {toValue: 1, useNativeDriver: true, duration: 100}).start();
            changeTimeout2.current = setTimeout(() => {
                setIsMedKit(()=>false)
                if(counterOfKit != 6){
                    setKitHit((c)=>!c);
                    bonusCounter.current = 0;
                    Animated.timing(bonusOpacity, {toValue: 0, useNativeDriver: true, duration: 300}).start();
                }
            }, howFastIsChange.current);
            
        }, randomNumber(1000, 2000));
        
        
    }, [kitHit])

    //end of modal
    useEffect(()=>{
        if(counterOfKit == 6){     
            setTimeout(() => {
                props.close(healthPass.current);
                clearTimeout(changeTimeout1.current);
                clearTimeout(changeTimeout2.current);
                setIsMedKit(()=>false);
                setCounterOfKit(()=>0);
                bonusCounter.current = 0;
                setBonus(()=>1);
                bonusOpacity.setValue(0);
                bonusPosition.stopAnimation();

                //stop animations
                medKitPosition.stopAnimation(); 
                pointPosition.stopAnimation();
                pointOpacity.stopAnimation();
                kitOpacity.stopAnimation();
                textProgress.stopAnimation();
                bonusOpacity.stopAnimation();
                bonusPosition.stopAnimation();

            }, 1500);
        }
    }, [counterOfKit])

    //when healthPass kit pressed
    function kitPressed(evt){
        if(healthPass.current == maxHealth.current){
            return;
        }

        bonusCounter.current = bonusCounter.current + 1;
        
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

        //end if max
        if(healthPass.current >= maxHealth.current){
            healthPass.current = maxHealth.current;
            setHealth(()=>maxHealth.current);

            setTimeout(() => {
                props.close(healthPass.current);
                clearTimeout(changeTimeout1.current);
                clearTimeout(changeTimeout2.current);
                setIsMedKit(()=>false);
                setCounterOfKit(()=>0);
                bonusCounter.current = 0;
                setBonus(()=>1);
                bonusOpacity.setValue(0);
                bonusPosition.stopAnimation();

                //stop animations
                medKitPosition.stopAnimation(); 
                pointPosition.stopAnimation();
                pointOpacity.stopAnimation();
                kitOpacity.stopAnimation();
                textProgress.stopAnimation();
                bonusOpacity.stopAnimation();
                bonusPosition.stopAnimation();

            }, 300);
        }

        setIsMedKit(()=>false);
        clearTimeout(changeTimeout1.current);
        clearTimeout(changeTimeout2.current);
        setKitHit((current)=>!current);
        
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

    }


    //creating new medkit
    function medkit(){
        if(isMedKit){
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
        if(isPoint){
            return(
                <Animated.View style={{transform: [{translateX: pointPosition.x}, {translateY: pointPosition.y}], opacity: pointOpacity}}>
                    <Text style={styles.point}>+1</Text>
                </Animated.View>
            )
        }
    }

    function middleText(){
        if(isText){
            return(
                <Animated.View
                style={{position: 'absolute', height: '70%', top: '35%', alignSelf: 'center', opacity: textProgress, transform: [{scale: textProgress}]}}>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TAP MEDKIT</Text>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TO HEAL!</Text>
                </Animated.View>
            )
        }
    }

    function getDimentions(layout){
        viewHeight.current = layout.height;
        viewWidth.current = layout.width;
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
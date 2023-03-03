import {React, useState, useEffect, useRef, useCallback} from 'react';
import { Image, Text, View, StyleSheet, ImageBackground, Pressable, SafeAreaView, Animated, Dimensions} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import Menu from "./Menu";
import Win from './Win';
import Lose from './Lose';
import Countdown from './Countdown';
import GetDamage from './GetDamage';
import GetHealth from './GetHealth';
import AlertHealth from './AlertHealth';
import EnemyRound from './EnemyRound';

function Game({navigation, route}) {
    let timerValue = 1;
    let opponentAmountHealth = route?.params?.health;
    let myAmountHealth = route?.params?.health;
    let usesOfGetHealth = 2;
    
    let windowWidth = Dimensions.get("window").width;
    
    const difficulty = useRef(route?.params?.difficulty);
    const charID = useRef(route?.params?.char);
    const oppID = useRef(route?.params?.opp);
    const myName = useRef(route?.params?.myname?.toUpperCase());
    const oppName = useRef(route?.params?.oppname);
    const oppPath = useRef();
    const charPath = useRef();
    
    const [isAlertHealthMax, setIsAlertHealthMax] = useState(false);
    const [isAlertHealthLimit, setIsAlertHealthLimit] = useState(false);
    const [isGetHealth, setIsGetHealth] = useState(false);
    const [isGetDamage, setIsGetDamage] = useState(false);
    const [IsWin, setIsWin] = useState(false);
    const [IsLoose, setIsLoose] = useState(false);
    const [IsMenu, setIsMenu] = useState(false);
    const [startEnemyRound, setStartEnemyRound] = useState(false);
    const [healthMinusValue, setHealthMinusValue] = useState([])
    const [damageMinusValue, setDamageMinusValue] = useState([])
    const [My_DamageMinusValue, setMy_DamageMinusValue] = useState([])
    const [buttonsActive, setButtonsActive] = useState(true);
    const [myTurn, setMyTurn] = useState(true);
    const [startTimer, setStartTimer] = useState(false);
    const [isTimer, setIsTimer] = useState(true);
    const [myHealth, setMyHealth] = useState(myAmountHealth-2);
    const [opponentHealth, setopponentHealth] = useState(opponentAmountHealth);
    const [timer, setTimer] = useState(timerValue);
    const [menuIsShown, setMenuIsShown] = useState(true);opponentUPDOWN
    const [startAnimations, setStartAnimations] = useState(false);
    const [stopAnimations, setStopAnimations] = useState(false);
    const [isFirstRound, setIsFirstRound] = useState({
        EnemyRound: true,
        GetHealth: true,
        GetDamage: true,
    });
    const [healthUsedCounter, setHealthUsedCounter] = useState(usesOfGetHealth);

    const progress = useRef(new Animated.Value(0)).current;
    const playerRight = useRef(new Animated.Value(windowWidth)).current;
    const playerLeft = useRef(new Animated.Value(-windowWidth)).current;
    const healthRound = useRef(new Animated.Value(5)).current;
    const TimmerOpacity = useRef(new Animated.Value(0)).current;
    const opponentUPDOWN = useRef(new Animated.Value(0)).current;
    
    const wasFirstFocus = useRef(false);
    const firstUpdateForstopAnim = useRef(false);
    const intervalForTimer = useRef(null);
    const intervalForOpponentHealth = useRef(null);
    const intervalForMyHealth = useRef(null);
    const FirstUpdate_enemyRound = useRef(false);
    const myHealthRef = useRef(myAmountHealth);
    const ER_healthPassed = useRef(0);
    const maxHealth = useRef(route?.params?.health)
    
    //AIMATIONS
    useEffect(()=>{
    
        Animated.spring(playerLeft, {toValue: 0, useNativeDriver: true, delay: 1800}).start();
        Animated.spring(playerRight, {toValue: 0, useNativeDriver: true, delay: 2000}).start();
        Animated.spring(TimmerOpacity, {toValue: 1, useNativeDriver: true}).start();

        Animated.loop(
            Animated.sequence([
                Animated.spring(opponentUPDOWN, {toValue: 10, useNativeDriver: true, restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 3}),
                Animated.spring(opponentUPDOWN, {toValue: 0, useNativeDriver: true, restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 3}),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(healthRound, {toValue: 20, useNativeDriver: true}),
                Animated.timing(healthRound, {toValue: 5, useNativeDriver: true})
            ])
        ).start();

    }, [startAnimations])

    useEffect(()=>{
        Animated.loop(
            Animated.sequence([
                Animated.timing(healthRound, {toValue: 20, useNativeDriver: true}),
                Animated.timing(healthRound, {toValue: 5, useNativeDriver: true})
            ])
        ).start();

    }, [myTurn, startAnimations])

    //stops animations
    useEffect(()=>{
        if(!firstUpdateForstopAnim.current){
            firstUpdateForstopAnim.current = false;
            return;
        }

        progress.stopAnimation();
        playerRight.stopAnimation();
        playerLeft.stopAnimation();
        healthRound.stopAnimation();
        TimmerOpacity.stopAnimation();
        opponentUPDOWN.stopAnimation();
    }, [stopAnimations])

    //setting images
    useEffect(() => {
        
        if(charID.current == "1"){
            charPath.current = require("../assets/char1.gif")
        }
        else if(charID.current == "2"){
            charPath.current = require("../assets/char2.gif")
        }
        else if(charID.current == "3"){
            charPath.current = require("../assets/char3.gif")
        }

        if(oppID.current == "1"){
            oppPath.current = require("../assets/opp1.png")
        }
        else if(oppID.current == "2"){
            oppPath.current = require("../assets/opp2.png")
        }
        else if(oppID.current == "3"){
            oppPath.current = require("../assets/opp3.png")
        }


        console.log(route.params)
    }, [])
    
    //find random number
    function randomNumber(min, max) { 
        return Math.random() * (max - min) + min;
    } 

    //count down timer
    useEffect(() => { 
            intervalForTimer.current = setInterval(() => {
                setTimer((prevtime) => prevtime - 1);
                return () => clearInterval(intervalForTimer.current)
            }, 800);
    }, [startTimer]);

    useEffect(()=> {
        if(timer == 0){
            clearInterval(intervalForTimer.current);
            Animated.spring(TimmerOpacity, {toValue: 0, useNativeDriver: true, 
                restSpeedThreshold: 3, 
                restDisplacementThreshold: 0.9
            }).start(({finished}) => {

                if (finished) {
                    setIsTimer(()=> false);
                }
            })}
    }, [timer])

    function showTimer(){
        if(isTimer){
            return(
                <Animated.View style={{width: "100%", height: "100%", position: "absolute", 
                justifyContent: "center", opacity: TimmerOpacity}}> 
                    <Countdown timer={timer}/>  
                </Animated.View>
            )
        }
    }
    
    //check if win
    useEffect(() => {
        if(opponentHealth <= 0 ){
            setopponentHealth(() => 0); 
            setIsWin(() => true);
            setButtonsActive(()=>false);   

            //stop animations
            setStopAnimations(()=>true);
        }
    }, [opponentHealth])
    
    //check if loose
    useEffect(()=> {
        if(myHealth <= 0){
            setMyHealth(() => 0);
            setIsLoose(() => true);
            setButtonsActive(()=>false); 

            //stop animations
            setStopAnimations((current) => !current)
        }
    },[myHealth])

    //check if end of increase health after restart
    useEffect(()=> {
        if(opponentHealth == opponentAmountHealth){
            clearInterval(intervalForOpponentHealth.current)
        }
        if(myHealth == myAmountHealth){
            clearInterval(intervalForMyHealth.current)
        }
    }, [opponentHealth, myHealth])
    
    //go menu pressed
    function goMenu(){
        //stop animations
        progress.stopAnimation();
        playerRight.stopAnimation();
        playerLeft.stopAnimation();
        healthRound.stopAnimation();
        TimmerOpacity.stopAnimation();
        opponentUPDOWN.stopAnimation();

        navigation.navigate("Homescreen")
    }

    //restart pressed
    function restart(){
        //increase health
        if(opponentHealth < opponentAmountHealth){
            intervalForOpponentHealth.current = setInterval(() => {
                setopponentHealth((prevtime) => prevtime + 1);
                return () => clearInterval(intervalForOpponentHealth.current)
            }, 5);
        }
        if(myHealth < myAmountHealth){
            intervalForMyHealth.current = setInterval(() => {
                setMyHealth((prevtime) => prevtime + 1);
                return () => clearInterval(intervalForMyHealth.current)
            }, 5);
        }

        
        setIsMenu(() => false);
        setIsWin(() => false);
        setIsLoose(() => false);
        setTimer(() => timerValue);
        setStartTimer((prevvalue)=> !prevvalue);
        TimmerOpacity.setValue(0)
        setIsTimer(() => true);
        Animated.spring(TimmerOpacity, {toValue: 1, useNativeDriver: true}).start();
        setButtonsActive(() => true);
        if(!menuIsShown){
            setMenuIsShown((current) => !current);            
        }
        setStartAnimations((current)=>!current);
        setHealthMinusValue(()=>[])
        setDamageMinusValue(()=>[])
        setMy_DamageMinusValue(()=>[])
        setMyTurn(()=>true);
        setIsFirstRound((obj)=>({...obj, GetDamage: true, GetHealth: true, EnemyRound: true}));
        setHealthUsedCounter(()=>usesOfGetHealth)
        
        myHealthRef.current = myAmountHealth;
        
        navigation.setParams({
            EN_health: 0,
        });
        
    }

    //when attack, opens getDamage
    function attack(){
        setButtonsActive(() => false);
        
        setTimeout(() => {
            setIsGetDamage(()=>true)       
        }, 100);
        
    }

    //when heal pressed, opens getHealth
    function heal(){

        if(myHealth >= myAmountHealth){
            setIsAlertHealthMax(()=>true)
            setButtonsActive(()=>false)
            return
        }

        if(healthUsedCounter <= 0){
            setIsAlertHealthLimit(()=>true);
            setButtonsActive(()=>false);
            return;
        }

        setHealthUsedCounter((current)=>current - 1);
        setButtonsActive(()=>false);

        setTimeout(() => {
            setIsGetHealth(()=>true)   
        }, 100);
    }

    //close getDamage, changes health, sets enemy round
    function closeGetDamage(healthPassed){
        setIsGetDamage(()=>false);

        setTimeout(() => {
            setIsFirstRound((obj)=>({...obj, GetDamage: false}));

            setDamageMinusValue(() => ["-" + (opponentHealth - healthPassed)])
            setopponentHealth(() => healthPassed)
            setTimeout(() => {
                setDamageMinusValue(() => []);
                setStartEnemyRound((current)=> !current);
            }, 1000);
        }, randomNumber(100,700));   
    }

    //close getHealht, changes health, sets enemy round
    function closeGetHealth(healthPlusPassed){
        setIsGetHealth(()=>false)

        setTimeout(() => {
            setIsFirstRound((obj)=>({...obj, GetHealth: false}));

            setHealthMinusValue(() => ["+" + (healthPlusPassed - myHealth)])
            setMyHealth(() => healthPlusPassed)
            myHealthRef.current = healthPlusPassed;

            setTimeout(() => {
                setHealthMinusValue(() => [])
                setStartEnemyRound((current)=> !current);
            }, 1000);
        }, randomNumber(100,700));   
    }

    //ENEMY ROUND
    useEffect(()=> {
        if(!FirstUpdate_enemyRound.current){
            FirstUpdate_enemyRound.current = true;
            return;
        }
        
        if(IsLoose || IsWin){
            return;
        }

        setMyTurn(() => false)
        setTimeout(() => {
            navigation.navigate("EnemyRound", {difficulty: difficulty.current, path: oppPath.current, health: myHealth, isFirstRound: isFirstRound.EnemyRound, maxHealth: maxHealth.current})
        }, randomNumber(700,1000));

    },[startEnemyRound])

    //when screen is back after enemys round
    useEffect(() => {
      if (route.params?.EN_health) {
          ER_healthPassed.current = route.params.EN_health;
      }
    }, [route.params?.EN_health]);
   
    useFocusEffect(
        useCallback(() => {    
            if(!wasFirstFocus.current){
                wasFirstFocus.current = true;
                return;
            }
    
            setIsFirstRound((obj)=>({...obj, EnemyRound: false}));

            setTimeout(() => {
                setMy_DamageMinusValue(() => '-' + ER_healthPassed.current);
                myHealthRef.current = myHealthRef.current - ER_healthPassed.current;

                setMyHealth(()=> myHealthRef.current)
                setTimeout(() => {
                    setButtonsActive(() => true)
                    setMyTurn(() => true)
                    setMy_DamageMinusValue([])
                    ER_healthPassed.current = 0;
                }, 1000);
            }, 1000);
        }, [])
      );


    //when menu botton pressed
    function MenuPressed() {

        setIsAlertHealthMax(() => false)
        if(menuIsShown){ 
            setButtonsActive(()=> false)
            progress.setValue(0);
            setIsMenu(() => true);    
            Animated.spring(progress, {toValue: 1, useNativeDriver: true}).start();
        }
        else{
            setButtonsActive(()=> true)
            progress.setValue(1);
            Animated.spring(progress, {toValue: 0, useNativeDriver: true}).start(() => setIsMenu(() => false));
        }
        setMenuIsShown((current) => !current)
    }

    //when close menu pressed
    function closeMenu() {
        setMenuIsShown((current) => !current);
        progress.setValue(1);
        Animated.spring(progress, {toValue: 0, useNativeDriver: true}).start(() => setIsMenu(() => false));
        setButtonsActive(() => true);
    }

    //shows alert when max health
    function showAlertHealthMax(){
        if(isAlertHealthMax){
            return(
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}> 
                    <AlertHealth close={()=> setIsAlertHealthMax(()=>false, setButtonsActive(()=> true))} 
                    text1={"YOU HAVE A FULL HEALTH"}
                    text2={"CAN'T ADD MORE"}
                    />    
                </View>
            )
        }
    }

    //shows alert when max health
    function showAlertHealthLimit(){
        if(isAlertHealthLimit){
            return(
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}> 
                    <AlertHealth close={()=> setIsAlertHealthLimit(()=>false, setButtonsActive(()=> true))}
                    text1={"YOU'RE OUT OF USES"}
                    text2={"CAN'T USE MORE"}
                    />    
                </View>
            )
        }
    }

    //shows menu when true
    function showMenu(){
        if(IsMenu){
            return(
                <Animated.View style={{position: 'absolute', height: '50%', top: '25%', alignSelf: 'center', opacity: progress, transform: [{scale: progress}]}}> 
                    <Menu restartPressed={restart} goMenu={goMenu} isVisible={IsMenu} close={closeMenu}/>  
                </Animated.View>
            )
        }
    }
    
    return (  
        <ImageBackground style={styles.background} source={require("../assets/cosmos.png")}>
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>                         
                <Win goMenu={goMenu} isVisible={IsWin} restart={restart} imgpath={charPath.current} name={myName.current}/>                
                <Lose goMenu={goMenu} isVisible={IsLoose} restart={restart} imgpath={oppPath.current} name={oppName.current}/>
                <GetDamage isVisible={isGetDamage} close={closeGetDamage} difficulty={difficulty.current} imgpath={oppPath.current}
                health={opponentHealth} firstRound={isFirstRound.GetDamage} maxHealth={maxHealth.current} oppName={oppName.current}/>

                <GetHealth isVisible={isGetHealth} close={closeGetHealth} difficulty={difficulty.current} health={myHealth} firstRound={isFirstRound.GetHealth} maxHealth={maxHealth.current}/>
                <Pressable 
                onPress={MenuPressed}
                style={({pressed}) => [styles.menuContainer, pressed && {opacity: 0.5}]}>
                    <Image resizeMode='center' style={styles.image} source={require("../assets/menu.png")}/>
                </Pressable>
                
                <View style={styles.secondContainer}>
                    <View style={styles.aboutHealth} >
                        <Text style={styles.bigHealth}>HEALTH</Text>
                        <View style={styles.healthContainer}>
                            <View style={styles.singleHealth}>
                                <Text style={styles.HealthText}>{myHealth}</Text>
                            </View>
                            <View style={styles.singleHealth}>
                                <Text style={styles.HealthText}>{opponentHealth}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.containerValues}>
                        <View style={styles.singleValue}>
                            <Text style={styles.textHeal}>{healthMinusValue}</Text>
                            <Text style={styles.textMyDamage}>{My_DamageMinusValue}</Text>
                        </View>
                        <View style={styles.singleValue}>
                            <Text style={styles.textAttack}>{damageMinusValue}</Text>
                        </View>
                    </View>

                    <View style={styles.playersNamesContainer}>
                        <View style={styles.namesContainer}>
                            <Animated.View style={[styles.playersText, myTurn ? {
                                borderWidth: 2, borderColor: "red", borderRadius: healthRound}: {borderRadius: 5}]}>
                                <Text style={styles.names} adjustsFontSizeToFit={true} numberOfLines={1} >{myName.current}</Text>
                            </Animated.View>
                        </View>
                        <View style={styles.namesContainer}>
                            <Animated.View style={[styles.playersText, !myTurn ? {
                                borderWidth: 2, borderColor: "red", borderRadius: healthRound}: {borderRadius: 5}]}>
                                <Text style={styles.names} adjustsFontSizeToFit={true} numberOfLines={1}>{oppName.current}</Text>
                            </Animated.View>
                        </View>
                    </View>
                    <View style={styles.players}>
                        <Animated.Image style={[styles.meGif, {transform: [{translateX: playerLeft}]}]} source={charPath.current}/>
                        <Animated.Image style={[styles.meGif, {transform: [{translateX: playerRight}, {translateY: opponentUPDOWN}]}]} source={oppPath.current}/>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Pressable onPress={attack} disabled={!buttonsActive} style={({pressed}) => [
                            styles.hitButton, pressed && buttonsActive && {
                                backgroundColor: "rgba(56, 13, 21, 0.6)",
                                transform: [{ scale: 0.9 }]
                                
                            }, 
                            !buttonsActive && {
                                backgroundColor: "rgba(150, 150, 150, 0.6)", 
                                borderColor: "rgba(60, 60, 60, 0.6)",
                            }]}>

                            <Text style={styles.buttonText}>ATTACK</Text>
                        </Pressable>

                        <Pressable onPress={heal} disabled={!buttonsActive} style={({pressed}) => [
                            styles.healButton, pressed && buttonsActive && {
                                backgroundColor: "rgba(18, 70, 16, 0.6)",
                                transform: [{ scale: 0.9 }]
                                
                            }, 
                            !buttonsActive && {
                                backgroundColor: "rgba(150, 150, 150, 0.6)", 
                                borderColor: "rgba(60, 60, 60, 0.6)",
                            }]}>
                            <Text style={styles.buttonText}>HEAL</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            {showAlertHealthMax()}
            {showAlertHealthLimit()}
            {showMenu()}
            {showTimer()}
        </SafeAreaView>
        </ImageBackground>    
        );
    }
    const styles = StyleSheet.create({
    background:{
        flex: 1,
    },
    container: {
        flex: 1,  
    },
    secondContainer: {
        flex: 1,        
    },
    background: {
        flex: 1,
        width:"100%"
    },
    menuContainer: {
        top: 20,
        width: 50,
        height: 50,
        marginTop: 20,
        marginLeft: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 40,
    },
    namesContainer: {
        flex: 1,
        alignItems: "center"   
    },
    
    names: {
        color: "white",
        fontSize: 25,
        fontFamily: "Buttons"
    },
    playersNamesContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    buttonsContainer: {
        flex: 1,
        width: "100%",       
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",
        
    },
    hitButton: {
        width:150,
        height:70,
        backgroundColor: "rgba(194, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderWidth: 4,
        borderColor: "rgba(46, 11, 17, 0.6)",
        elevation: 40,
        shadowColor: '#000000',
    },
    healButton:{
        width:150,
        height:70,
        backgroundColor: "rgba(40, 122, 35, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderWidth: 4,
        borderColor: "rgba(18, 54, 16, 0.6)",
        elevation: 40,
        shadowColor: '#000000',
    },
    buttonText: {
        color: "white",
        fontSize: 30,
        fontWeight: "400",
        fontFamily: "Game"
    },
    playersText:{
        paddingHorizontal: 3,
        width: 170,
        height: 40,
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: 'center',
    },
    players:{
        flex:1,
        justifyContent: "space-evenly",
        flexDirection: "row",
    },
    meGif:{
        height: 150,
        width: 150,
        marginHorizontal: 30,
    },
    healthContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        
    },
    singleHealth: {
        width: 120,
        height: 70,
        backgroundColor: "rgba(160, 160, 160, 0.4)",
        marginHorizontal: 20,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
    },
    HealthText: {
        fontFamily: "Buttons",
        color: "white",
        fontSize: 35,
    },
    aboutHealth: {
        alignItems: "center",
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: 'center',
        borderRadius: 40,
        marginHorizontal: 15,
        top: 25,   
    },
    bigHealth: {
        fontFamily: "Buttons",
        color: "white",
        fontSize:45,
        marginBottom: 15,
    },
    containerValues: {
        height: 50,
        
        marginBottom: 50,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    singleValue: {
        width: 100,
        
        marginHorizontal: 20,
        alignItems: "center"
    },
    textAttack: {
        color: "red",
        fontFamily: "Buttons",
        fontSize: 25,
    },
    textHeal: {
        color: "#00ff00",
        fontFamily: "Buttons",
        fontSize: 25,
    },
    textMyDamage: {
        color: "red",
        fontFamily: "Buttons",
        fontSize: 25,
        bottom: 30,
    },
    menu:{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
    }
    
})

export default Game;
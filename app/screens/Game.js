import {React, useState, useEffect, useRef, useCallback, useContext} from 'react';
import { Image, Text, View, StyleSheet, ImageBackground, 
    Pressable, SafeAreaView, Animated, Dimensions, Vibration, StatusBar} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Menu from "./Menu";
import Win from './Win';
import Lose from './Lose';
import Countdown from './Countdown';
import GetDamage from './GetDamage';
import GetHealth from './GetHealth';
import AlertHealth from './AlertHealth';
import { MusicContext } from '../assets/modules/MusicContext';
import {toggleMusic, playClick, playLoose, playWin} from '../assets/modules/SoundFunctions'
import { addRecord } from '../assets/modules/sqlFunctions';


function Game({navigation, route}) {

    const {contextObj, setContextObj} = useContext(MusicContext);

    let timerValue = 3;
    let opponentAmountHealth = route?.params?.health;
    let myAmountHealth = route?.params?.health;
    let usesOfGetHealth = 2;
    let windowWidth = Dimensions.get("window").width;
    
    const [health, setHealth] = useState({mine: myAmountHealth, opp: opponentAmountHealth});
    const [isElem, setIsElem] = useState({alertHealthMax: false, alertHealthLimit: false,
     getDamage: false, getHealth: false, win: false, loose: false, menu: false,
    timer: true})
    const [myTurn, setMyTurn] = useState(true);
    const [buttonsActive, setButtonsActive] = useState(true);
    const [timer, setTimer] = useState(timerValue);
    const [menuIsShown, setMenuIsShown] = useState(true);
    const [healthUsedCounter, setHealthUsedCounter] = useState(usesOfGetHealth);
    const [healthChange, setHealthChange] = useState({my_plus: [''], my_minus: [''], opp_minus: ['']})
    const [isFirstRound, setIsFirstRound] = useState({
        EnemyRound: true,
        GetHealth: true,
        GetDamage: true,
    });

    const interval = useRef({timer: null, oppHp: null, mineHp: null});
    const passedArg = useRef({difficulty: route?.params?.difficulty, charID: route?.params?.char,
        oppID: route?.params?.opp, myName: route?.params?.myname?.toUpperCase(),
        oppName: route?.params?.oppname, maxHealth: route?.params?.health});
    const imgPath = useRef({char: 0, opp: 0})
    const wasFirstFocus = useRef(false);
    const myHealthRef = useRef(myAmountHealth);
    const ER_healthPassed = useRef(0);
    const time = useRef({start: 0.8, end: 0.8, total: 0.8});
    const isFinish = useRef(false);
    const timeout = useRef({getDamage: null, getHealth: null});
    const score = useRef(0);

    const progress = useRef(new Animated.Value(0)).current;
    const playerRight = useRef(new Animated.Value(windowWidth)).current;
    const playerLeft = useRef(new Animated.Value(-windowWidth)).current;
    const healthRound = useRef(new Animated.Value(5)).current;
    const TimmerOpacity = useRef(new Animated.Value(0)).current;
    const opponentUPDOWN = useRef(new Animated.Value(0)).current;

    function toggleMusicHandler(){
        toggleMusic(contextObj.ref, contextObj.isMusic);
        setContextObj((obj)=> ({...obj, isMusic: !obj.isMusic}));
        Vibration.vibrate(3);
    }
    
    //AIMATIONS
    function startAnimations(){

        Animated.spring(playerLeft, {toValue: 0, useNativeDriver: true, delay: 1800}).start();
        Animated.spring(playerRight, {toValue: 0, useNativeDriver: true, delay: 2000}).start();
    
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
    }
    
    function animateRedRound(){
        Animated.loop(
            Animated.sequence([
                Animated.timing(healthRound, {toValue: 20, useNativeDriver: true}),
                Animated.timing(healthRound, {toValue: 5, useNativeDriver: true})
            ])
        ).start();
    }

    useEffect(()=> {
        animateRedRound();
    }, [myTurn])
    
    //stops animations
    function stopAllAnimations(){
        
        progress.stopAnimation();
        playerRight.stopAnimation();
        playerLeft.stopAnimation();
        healthRound.stopAnimation();
        TimmerOpacity.stopAnimation();
        opponentUPDOWN.stopAnimation();
    }


    //setting images
    function setPlayersIMG(){
        if(passedArg.current.charID == "1"){
            imgPath.current.char = require("../assets/images/char1.gif");
        }
        else if(passedArg.current.charID == "2"){
            imgPath.current.char = require("../assets/images/char2.gif");
        }
        else if(passedArg.current.charID == "3"){
            imgPath.current.char = require("../assets/images/char3.gif");
        }
    
        if(passedArg.current.oppID == "1"){
            imgPath.current.opp= require("../assets/images/opp1.png");
        }
        else if(passedArg.current.oppID == "2"){
            imgPath.current.opp = require("../assets/images/opp2.png");
        }
        else if(passedArg.current.oppID == "3"){
            imgPath.current.opp = require("../assets/images/opp3.png");
        }
    }

    //count down timer    
    function startTimer(){

        setTimer(()=> timerValue);
        setIsElem((obj)=> ({...obj, timer: true}));
        TimmerOpacity.setValue(0);
        Animated.timing(TimmerOpacity, {toValue: 1, useNativeDriver: true, duration: 200 
        }).start(({finished}) => {  
            if(finished){
                interval.current.timer = setInterval(() => {
                    setTimer((prevtime) => prevtime - 1);
                    Vibration.vibrate(3);
                }, 700)
            }  
        })
    }
    
    //timer listener
    useEffect(()=> {
        if(timer <= 0){
            clearInterval(interval.current.timer);
            Animated.timing(TimmerOpacity, {toValue: 0, useNativeDriver: true, 
                duration: 500
            }).start(({finished})=> {
                if(finished){
                    setIsElem((obj)=> ({...obj, timer: false}));
                }   
            });
        }
    }, [timer])
    
    //go menu pressed
    function goMenu(){
        stopAllAnimations();
        navigation.navigate("Homescreen");
    }
    
    //stop animations
    function stopAllAnimations(){
        playerRight.stopAnimation();
        playerLeft.stopAnimation();
        healthRound.stopAnimation();
        opponentUPDOWN.stopAnimation();
    }
    
    //increase health
    function increaseHealth(health, amountHealth, who, interval, whosehp){
        if(health < amountHealth){
            interval.current[whosehp] = setInterval(() => {
                setHealth((obj)=> ({...obj, [who]: obj[who] + 1}))
            }, 20);
        }
    }
    
    //track and check if end of increase health after restart
    useEffect(()=> {
        if(health.opp >= opponentAmountHealth){
            clearInterval(interval.current.oppHp);
            isFinish.current = false;
        }
        if(health.mine >= myAmountHealth){
            clearInterval(interval.current.mineHp);
            isFinish.current = false;
        }
    }, [health.opp, health.mine])
    
    function beginingOfScreen(){
        startTimer();
        setPlayersIMG();
        startAnimations();
    }
    
    //restart pressed
    function restart(){
        
        startTimer();

        time.current.start = new Date();

        stopAllAnimations();
        startAnimations();
        
        increaseHealth(health.mine, myAmountHealth, "mine", interval, "mineHp");
        increaseHealth(health.opp, opponentAmountHealth, "opp", interval, "oppHp");
        
        if(!menuIsShown){
            setMenuIsShown((current) => !current);            
        }
        setButtonsActive(() => true);
        setMyTurn(()=>true);
        setIsElem((obj)=> ({...obj, menu: false, win: false, loose: false})); 
        setHealthChange((obj)=> ({...obj, opp_minus: [''], my_minus: [''], my_plus: ['']}));
        setIsFirstRound((obj)=>({...obj, GetDamage: true, GetHealth: true, EnemyRound: true}));
        setHealthUsedCounter(()=>usesOfGetHealth);
        
        myHealthRef.current = myAmountHealth;
        
        navigation.setParams({
            EN_health: 0,
        });
        
    }
    
    
    //when attack, opens getDamage
    function attack(){
        playClick(setContextObj);
        Vibration.vibrate(3);

        setButtonsActive(() => false);
        
        setTimeout(() => {
            setIsElem((obj)=> ({...obj, getDamage: true}));
        }, 100);
        
    }
    
    //when heal pressed, opens getHealth
    function heal(){
        playClick(setContextObj);
        Vibration.vibrate(3);

        //check if max health
        if(health.mine >= myAmountHealth){
            setIsElem((obj)=> ({...obj, alertHealthMax: true}));
            setButtonsActive(()=>false)
            return
        }
        
        //check if out of limit of getHealth
        if(healthUsedCounter <= 0){
            setIsElem((obj)=> ({...obj, alertHealthLimit: true}));
            setButtonsActive(()=>false);
            return;
        }
        
        setHealthUsedCounter((current)=>current - 1);
        setButtonsActive(()=>false);
        
        setTimeout(() => {
            setIsElem((obj)=> ({...obj, getHealth: true}));
        }, 100);
    }
    
    //close getDamage, changes health, sets enemy round
    function closeGetDamage(healthPassed){
        setIsElem((obj)=> ({...obj, getDamage: false}));
        
        setTimeout(() => {
            if(isFirstRound.GetDamage){
                setIsFirstRound((obj)=>({...obj, GetDamage: false}));
            }
        
            setHealthChange((obj)=> ({...obj, opp_minus: ["-",(health.opp - healthPassed)]}));
            setHealth((obj)=> ({...obj, opp: healthPassed}));
              
            timeout.current.getDamage = setTimeout(() => {
                setHealthChange((obj)=> ({...obj, opp_minus: ['']}));
                if(!isFinish.current){
                    startEnemyRound();
                }
            }, 600);
        }, 900);   
    }
    
    //close getHealht, changes health, sets enemy round
    function closeGetHealth(healthPlusPassed){
        setIsElem((obj)=> ({...obj, getHealth: false}));
        
        setTimeout(() => {
            if(isFirstRound.getHealth){
                setIsFirstRound((obj)=>({...obj, GetHealth: false}));
            } 
           
            setHealthChange((obj)=> ({...obj, my_plus: ["+",healthPlusPassed - health.mine]}));
            setHealth((obj)=> ({...obj, mine: healthPlusPassed}));
            myHealthRef.current = healthPlusPassed;
            
            timeout.current.getHealth = setTimeout(() => {
                setHealthChange((obj)=> ({...obj, my_plus: ['']}));
                if(!isFinish.current){
                    startEnemyRound();
                }
            }, 600);
        }, 900);   
    }
    
    //track health and check if win or loose
    useEffect(()=> {
        if(!isFinish.current){
            if(health.mine <= 0){
                setHealth((obj)=>({...obj, mine: 0}));
                isFinish.current = true;
                setTimeout(() => {
                    winOrLoose("mine", "loose");
                    Vibration.vibrate(500);
                    playLoose(setContextObj);
                }, 1000);
            }
            if(health.opp <= 0 ){
                setHealth((obj)=>({...obj, opp: 0}));
                isFinish.current = true;
                setTimeout(() => {
                    winOrLoose("opp", "win");
                    Vibration.vibrate(500);
                    playWin(setContextObj);
                }, 1000);
                
                measureTime();

                calculateScore();

                addRecord(contextObj.db, passedArg.current.difficulty, passedArg.current.myName, 
                    score.current, time.current.total);

            }
        }
    }, [health.mine, health.opp]);
    
    function calculateScore(){
        let newScore = Math.round((health.mine / passedArg.current.maxHealth) * 100);
        score.current = newScore;
    }
    
    //get duration of round
    function measureTime(){

        time.current.end = new Date();
            
        let duration = time.current.end - time.current.start;

        let hours = Math.floor(duration / (1000 * 60 * 60));
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let seconds = Math.floor((duration / 1000) % 60);

        let formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        time.current.total = formattedDuration;
    }
    
    function winOrLoose(who, modal){
        setHealth((obj)=> ({...obj, [who]: 0}));
        setIsElem((obj)=> ({...obj, [modal]: true})); 
        setButtonsActive(()=>false); 
        clearTimeout(timeout.current.getDamage);
        clearTimeout(timeout.current.getHealth);
        stopAllAnimations();
    }

    
    function startEnemyRound(){
        
        setMyTurn(() => false);
     
        navigation.navigate("EnemyRound", {difficulty: passedArg.current.difficulty, path: imgPath.current.opp, 
            health: myHealthRef.current, isFirstRound: isFirstRound.EnemyRound, maxHealth: passedArg.current.maxHealth});
    } 
        

        
    //when screen is back after enemys round
    useEffect(() => {
        console.log('useeffect')
        if (route.params !== undefined && route.params.EN_health !== undefined && route.params.EN_health !== null) {
            console.log('if')
            ER_healthPassed.current = route.params.EN_health;
        }
    }, [route.params?.EN_health]);
    
    useFocusEffect(
        useCallback(() => {
            //start of screen
            if(!wasFirstFocus.current){
                wasFirstFocus.current = true;
                beginingOfScreen();
                time.current.start = new Date();
            }
            else{
    
                if(isFirstRound.EnemyRound){
                    setIsFirstRound((obj)=>({...obj, EnemyRound: false}));
                }
                setTimeout(() => {
                    setHealthChange((obj)=> ({...obj, my_minus: ['-',ER_healthPassed.current]}));
                    myHealthRef.current = myHealthRef.current - ER_healthPassed.current;
                    setHealth((obj)=> ({...obj, mine: myHealthRef.current}));

                    setTimeout(() => {
                        setButtonsActive(() => true)
                        setMyTurn(() => true)
                        setHealthChange((obj)=> ({...obj, my_minus: ['']}));
                        //ER_healthPassed.current = 0;
                    }, 1000);
                }, 1000);
            }

        }, [])
      );


    //when menu botton pressed
    function MenuPressed() {

        Vibration.vibrate(3);

        setIsElem((obj)=> ({...obj, alertHealthMax: false}));
        if(menuIsShown){ 
            setButtonsActive(()=> false)
            progress.setValue(0);
            setIsElem((obj)=> ({...obj, menu: true}));
            Animated.spring(progress, {toValue: 1, useNativeDriver: true}).start();
        }
        else{
            setButtonsActive(()=> true)
            progress.setValue(1);
            Animated.spring(progress, {toValue: 0, useNativeDriver: true}).start(() => setIsElem((obj)=> ({...obj, menu: false})));
        }
        setMenuIsShown((current) => !current)
    }

    //when close menu pressed
    function closeMenu() {
        setMenuIsShown((current) => !current);
        progress.setValue(1);
        Animated.spring(progress, {toValue: 0, useNativeDriver: true}).start(() => setIsElem((obj)=> ({...obj, menu: false})));
        setButtonsActive(() => true);
    }

    function showAlertHealthMax(){
        if(isElem.alertHealthMax){
            return(
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}> 
                    <AlertHealth close={()=> {
                        setIsElem((obj)=> ({...obj, alertHealthMax: false})); 
                        setButtonsActive(()=> true)}} 
                    text1={"YOU HAVE A FULL HEALTH"}
                    text2={"CAN'T ADD MORE"}
                    />    
                </View>
            )
        }
    }

    function showAlertHealthLimit(){
        if(isElem.alertHealthLimit){
            return(
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}> 
                    <AlertHealth close={()=> {
                        setIsElem((obj)=> ({...obj, alertHealthLimit: false})); 
                        setButtonsActive(()=> true)}}
                    text1={"YOU'RE OUT OF USES"}
                    text2={"CAN'T USE MORE"}
                    />    
                </View>
            )
        }
    }
 
    function showMenu(){
        if(isElem.menu){
            return(
                <Animated.View style={{position: 'absolute', top: Dimensions.get('screen').height/2 - 175, alignSelf: 'center', opacity: progress, transform: [{scale: progress}]}}> 
                    <Menu restartPressed={restart} goMenu={goMenu} isVisible={isElem.menu} close={closeMenu} playClick={()=>playClick(setContextObj)}/> 
                </Animated.View>
            )
        }
    }

    function showTimer(){
        if(isElem.timer){
            return(
                <Animated.View style={{width: "100%", height: "100%", position: "absolute", 
                justifyContent: "center", opacity: TimmerOpacity}}> 
                    <Countdown timer={timer}/>  
                </Animated.View>
            )
        }
    }

    function showSound(){
        if(contextObj.isMusic){
            return(
                <Image source={require('../assets/images/musicon.png')} style={styles.image}/>
            )
        }
        else{
            return(
                <Image source={require('../assets/images/musicoff.png')} style={styles.image}/>
            )
        }
    }
    
    return (  
        <ImageBackground style={styles.container} source={require("../assets/images/cosmos.png")}>
        <SafeAreaView style={styles.container}>
        <View style={{height: '100%', width: Math.min(400, Dimensions.get('window').width), alignSelf: 'center'}}>
        <View style={{height: StatusBar.currentHeight + 10}}/>
            <View style={[styles.menuSoundContainer]}>
                <Pressable onPress={MenuPressed}
                style={({pressed}) => [styles.menuContainer,pressed && {opacity: 0.5, transform: [{ scale: 0.9 }]}]}>
                    <Image resizeMode='contain' style={styles.image} source={require("../assets/images/menu.png")}/>
                </Pressable>
                <Pressable onPress={toggleMusicHandler} style={({pressed})=> [styles.menuContainer,pressed && {opacity: 0.5, transform: [{ scale: 0.9 }]}]}>
                    {showSound()}
                </Pressable>
            </View>
            <View style={styles.container}>                         
                <Win goMenu={goMenu} isVisible={isElem.win} restart={restart} imgpath={imgPath.current.char} name={passedArg.current.myName}
                score={score.current} time={time.current.total} />                
                <Lose goMenu={goMenu} isVisible={isElem.loose} restart={restart} imgpath={imgPath.current.opp} name={passedArg.current.oppName}/>
                <GetDamage isVisible={isElem.getDamage} close={closeGetDamage} difficulty={passedArg.current.difficulty} imgpath={imgPath.current.opp}
                health={health.opp} firstRound={isFirstRound.GetDamage} maxHealth={passedArg.current.maxHealth} oppName={passedArg.current.oppName}/>

                <GetHealth isVisible={isElem.getHealth} close={closeGetHealth} difficulty={passedArg.current.difficulty} 
                health={health.mine} firstRound={isFirstRound.GetHealth} maxHealth={passedArg.current.maxHealth}/>
                
                <View style={styles.container}>
                    <View style={styles.aboutHealth} >
                        <Text style={styles.bigHealth}>HEALTH</Text>
                        <View style={styles.healthContainer}>
                            <View style={styles.singleHealth}>
                                <Text style={styles.HealthText}>{health.mine}</Text>
                            </View>
                            <View style={styles.singleHealth}>
                                <Text style={styles.HealthText}>{health.opp}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.containerValues}>
                        <View style={styles.singleValue}>
                            <Text style={styles.textHeal}>{healthChange.my_plus}</Text>
                            <Text style={styles.textMyDamage}>{healthChange.my_minus}</Text>
                        </View>
                        <View style={styles.singleValue}>
                            <Text style={styles.textAttack}>{healthChange.opp_minus}</Text>
                        </View>
                    </View>

                    <View style={styles.playersNamesContainer}>
                        <View style={styles.namesContainer}>
                            <Animated.View style={[styles.playersText, myTurn ? {
                                borderWidth: 2, borderColor: "red", borderRadius: healthRound}: {borderRadius: 5}]}>
                                <Text style={styles.names} adjustsFontSizeToFit={true} numberOfLines={1} >{passedArg.current.myName}</Text>
                            </Animated.View>
                        </View>
                        <View style={styles.namesContainer}>
                            <Animated.View style={[styles.playersText, !myTurn ? {
                                borderWidth: 2, borderColor: "red", borderRadius: healthRound}: {borderRadius: 5}]}>
                                <Text style={styles.names} adjustsFontSizeToFit={true} numberOfLines={1}>{passedArg.current.oppName}</Text>
                            </Animated.View>
                        </View>
                    </View>
                    <View style={styles.players}>
                        <Animated.Image style={[styles.meGif, {transform: [{translateX: playerLeft}]}]} source={imgPath.current.char}/>
                        <Animated.Image style={[styles.meGif, {transform: [{translateX: playerRight}, {translateY: opponentUPDOWN}]}]} source={imgPath.current.opp}/>
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
        </View>
        </SafeAreaView>
        </ImageBackground>    
        );
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,  
    },
    menuContainer: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    menuSoundContainer:{
        height: 40, 
        width: '100%', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 40,
        height: 40
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
        marginTop: 10,
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
})

export default Game;
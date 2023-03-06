import {React, useState, useRef, useEffect} from 'react';
import { View, Image, Animated, ImageBackground, 
    StyleSheet, SafeAreaView, StatusBar, Text, Easing} from 'react-native';
import Movable from './MovableHeart';

function EnemyRound({navigation, route}) {

    const throttleDelay = 0;

    const [health, setHealth] = useState(route?.params?.health);
    const [maxHealth] = useState(route?.params?.maxHealth);
    const [isElem, setIsElem] = useState({heart: false, text: false});
    const [viewHeight_s, setViewHeight_s] = useState(0);
    const [lineHit, setLineHit] = useState({
        _1: false,
        _2: false
    });
    
    const healthPass = useRef(0);
    const firstRound = useRef(route?.params?.isFirstRound);
    const oppPath = useRef(route?.params?.path);
    const lineSpeed = useRef({vertical: 0, horizontal: 0});
    const view = useRef({x: 0, y: 0, width: 0, height: 0});
    const heartPos = useRef({x: 0, y: 0});
    const linePos = useRef({_1: {x: 0, y: 0}, _2: {x: 0, y: 0}});
    const changeColorLine = useRef({_1: null, _2: null});
    const randomHeight = useRef({_1: 0, _2: 0});
    const UpDown = useRef({_1: 0.0, _2: 0.0});
    const verticalDuration  = useRef({_1: 0, _2: 0});
    const viewForLine = useRef({_1: 0, _2: 0});
    const wasHit = useRef(true);
    
    const textProgress = useRef(new Animated.Value(0)).current;
    const line1Ani = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    const line2Ani = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    const oppPosition = useRef(new Animated.ValueXY({x: -100, y: -5})).current;
    const oppOpacity = useRef(new Animated.Value(0)).current;
    
    function randomNumber(min, max) { 
        return Math.random() * (max - min) + min;
    }
    
    //set hearts passed cordinates
    function takeHeartPosition(valueX, valueY){
        heartPos.current.x = valueX + view.current.width/2;
        heartPos.current.y = valueY + view.current.height/2;
        
    }
    
    //information that heart hit border
    function borderHit(){
        setHealth((current)=> current - 4);
        healthPass.current = healthPass.current + 4;
    }

    function throttle (func, limit){
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        }
    }
    
    //navigate when end of screen
    function endOfScreen(){
        navigation.navigate({
            name: 'Game',
            params: { EN_health: healthPass.current },
            merge: true,
          });
    }

    //end of round
    useEffect(()=> {
        setTimeout(() => {
            endOfScreen();
        },500000)//firstRound.current ? 18500: 15000);
    }, [])

    //track amount of health and end when 0 
    useEffect(()=> {
        if(health <= 0){
            setHealth(()=>0);
            line1Ani.removeAllListeners();
            line2Ani.removeAllListeners(); //tutaj

            setTimeout(() => {
                endOfScreen();
            }, 300);
        }
    }, [health])

    //how fast lines moves
    function setDifficulty(){
        if(route?.params?.difficulty == 'easy'){
            lineSpeed.current.vertical = 2000;
            lineSpeed.current.horizontal = 2500;
        }else{
            lineSpeed.current.vertical = 1200;
            lineSpeed.current.horizontal = 1700;
        }
    }

    //actions when is first round
    function whenFirstRound(){
        if(firstRound.current){
            setIsElem((obj)=> ({...obj, text: true}));
            textProgress.setValue(0);
            Animated.spring(textProgress, {toValue: 1, useNativeDriver: true, delay: 500}).start();
            setTimeout(() => {
                Animated.spring(textProgress, {toValue: 0, useNativeDriver: true}).start(() => {
                    setIsElem((obj)=> ({...obj, text: false, heart: true}));             
                });
            }, 2500);
        }
        else{
            setTimeout(() => {
                setIsElem((obj)=> ({...obj, heart: true}));
            }, 500);
        }
    }

    //opponent animations
    function startOpponentAnimations(){
        Animated.timing(oppOpacity, {toValue: 1, useNativeDriver: true, delay: 1000, duration: 500}).start();

        Animated.loop(
            Animated.sequence([
                Animated.spring(oppPosition.x, {toValue: 100, speed: 3 ,useNativeDriver: true}),
                Animated.spring(oppPosition.x, {toValue: -100, speed: 3, useNativeDriver: true}),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(oppPosition.y, {toValue: 5, useNativeDriver: true}),
                Animated.timing(oppPosition.y, {toValue: -5, useNativeDriver: true}),
            ])
        ).start();
    }
  
    //get dimentions of view which move lines in 
    function getDimentions(layout){
        view.current.x = layout.x;
        view.current.y = layout.y;
        view.current.width = layout.width;
        view.current.height = layout.height;
        setViewHeight_s(()=>layout.height);
    }

    //on layout when start of the screen
    function startOfScreen(layout){

        getDimentions(layout);

        setDifficulty();
        
        //initial position
        heartPos.current.x = layout.width/2;
        heartPos.current.y = layout.height/2;
        line1Ani.setValue({x: -layout.width/2, y: 0})      
        line2Ani.setValue({x: -layout.width/2, y: 0})      

        //check if first round
        whenFirstRound();
        
        //start of lines aniamtions
        
        startAllLines();

        startOpponentAnimations();

    }

    //starts animations of vertival and horizontal move for all lines
    function startAllLines(){
        setTimeout(() => {
            startListener(line1Ani, "_1", "x");
            startListener(line1Ani, "_1", "y");            
            startHorizontalMove(line1Ani, "_1");
        }, firstRound.current ? 5500: 2000);
        
        setTimeout(() => {
            startListener(line2Ani, "_2", "x");
            startListener(line2Ani, "_2", "y");
            startHorizontalMove(line2Ani, "_2");

        }, firstRound.current? 5500 + lineSpeed.current.horizontal/2: 2000 
        + lineSpeed.current.horizontal/2);
    }

    //listener of one cordinate
    function startListener(lineAni, _lineNR, cordinate){
        
        lineAni[cordinate].removeAllListeners();
        
        lineAni[cordinate].addListener(throttle(({value})=>{
            lineGetCordinate(_lineNR, cordinate, value);
            if(cordinate =="x"){
                checkIfHit(_lineNR);
            }
        }, throttleDelay));

    }
    
    //set actual ani value to ref
    function lineGetCordinate(_lineNr, cordinate, value) {
        if(cordinate == "x"){
            linePos.current[_lineNr][cordinate] = value + view.current.width/2;
        }
        else{
            linePos.current[_lineNr][cordinate] = value + view.current.height/2;
        }

        
    }

    //chec if heart hit one of lines
    function checkIfHit(_lineNr){
        if(!wasHit.current){
            return;
        }

        if(linePos.current[_lineNr].x + 30 > heartPos.current.x && 
            linePos.current[_lineNr].x - 30 < heartPos.current.x && 
            (linePos.current[_lineNr].y + 17 < heartPos.current.y || 
                linePos.current[_lineNr].y - 17 > heartPos.current.y)){
    
            setLineHit((obj)=>({...obj, _lineNR: true}));

            setHealth((c)=> c - 2)
            healthPass.current = healthPass.current + 2;

            // changeColorLine.current._2 = setTimeout(() => {
            //     setLineHit((obj)=>({...obj, _2: false}));
            // }, 500);

            wasHit.current = false;
            setTimeout(() => {
                wasHit.current = true;
            }, 500);
        }
    }

    //horizontal move of line
    function startHorizontalMove(lineAni, _lineNr){
        lineAni.stopAnimation();

        //random height of lines on start
        randomHeight.current[_lineNr] = randomNumber((-view.current.height * 0.75)/2, (view.current.height * 0.75)/2);
        
        //set if line goes down or up
        UpDown.current[_lineNr] = Math.random();
        
        lineAni.setValue({x: -view.current.width/2 - 10, y: randomHeight.current[_lineNr]});

        startVertical(lineAni, _lineNr);

        Animated.timing(lineAni.x, {toValue: view.current.width/2 + 20, duration: lineSpeed.current.horizontal, 
        easing: Easing.linear ,useNativeDriver: true}).start(({finished})=>{
            if(finished){
                //reset red
                clearTimeout(changeColorLine.current[_lineNr]);
                setLineHit((obj)=>({...obj, [_lineNr]: false}));
    
                // setWasHit((current)=> !current);
                startHorizontalMove(lineAni,_lineNr);
            }
        }); 
    }

    //vertival move of line
    function startVertical(lineAni, _lineNR){

        if(!randomHeight.current[_lineNR]){
            if(UpDown.current[_lineNR] > 0.5){
                verticalDuration.current[_lineNR] = lineSpeed.current.vertical;
                viewForLine.current[_lineNR] = view.current.height;
            }
            else{
                verticalDuration.current[_lineNR] = lineSpeed.current.vertical;
                viewForLine.current[_lineNR] = -view.current.height;
            }
        }
        else{
            if(UpDown.current[_lineNR] > 0.5){ //up
                verticalDuration.current[_lineNR] = (randomHeight.current[_lineNR]
                    + view.current.height) * lineSpeed.current.vertical/500;
                viewForLine.current[_lineNR] = view.current.height;
            }
            else{ //down
                verticalDuration.current[_lineNR] = (-randomHeight.current[_lineNR] 
                    + view.current.height) * lineSpeed.current.vertical/500;
                viewForLine.current[_lineNR] = -view.current.height
            }
        }

        Animated.sequence([
            Animated.timing(lineAni.y, {toValue: (-viewForLine.current[_lineNR] * 0.75)/2, 
            duration: verticalDuration.current[_lineNR], easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(lineAni.y, {toValue: (viewForLine.current[_lineNR] * 0.75)/2, 
            duration: lineSpeed.current.vertical, easing: Easing.linear, useNativeDriver: true})
            
        ]).start(({finished})=>{
            if(finished){
                randomHeight.current[_lineNR] = 0;
                startVertical(lineAni, _lineNR);
            }
        });
    }

    function heart(){
        if(isElem.heart){
            return(
                <Movable position={takeHeartPosition} borderHit={borderHit} 
                viewX={view.current.x} viewY={view.current.y} 
                viewWidth={view.current.width} viewHeight={view.current.height}/>
            )
        }
    }

    function opponent(){
        return(
            <Animated.View style={[styles.opponent, {opacity: oppOpacity, 
            transform: [{translateX: oppPosition.x}, {translateY: oppPosition.y}]}]}>
                <Image source={oppPath.current}  style={styles.image100} />
            </Animated.View>
        )
    }

    

    function line1(){
        return(
            <Animated.View style={[styles.lineVertical, {height: viewHeight_s* 2.5,width: viewHeight_s/80 ,
            transform: [{translateX: line1Ani.x}, {translateY: line1Ani.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} 
                source={require('../assets/lineHorizontal.png')}></Image>
            </Animated.View>
        )
    }

    function line2(){
        return(
            <Animated.View style={[styles.lineVertical, lineHit._2 && {backgroundColor:"rgba(255, 0, 0, 0.6)"}, 
            {height: viewHeight_s* 2.5,width: viewHeight_s/80 ,
            transform: [{translateX: line2Ani.x}, {translateY: line2Ani.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} 
                source={require('../assets/lineHorizontal.png')}></Image>
            </Animated.View>
        )
    }

    function middleText(){
        if(isElem.text){
            return(
                <Animated.View
                style={{position: 'absolute', height: '70%', top: '35%', alignSelf: 'center', 
                margin: 20, opacity: textProgress, transform: [{scale: textProgress}]}}>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>MOVE HEART</Text>
                    <Text style={styles.middleText} adjustsFontSizeToFit={true} numberOfLines={1}>TO AVOID ATTACK!</Text>
                </Animated.View>
            )
        }
    }

    return (
        <ImageBackground style={styles.background} source={require("../assets/flame34k.jpg")}>
            <SafeAreaView style={styles.background}>
                <View style={[styles.opponenContainer, {height: 120 + StatusBar.currentHeight}]}>
                    {opponent()}
                </View>
                <View onLayout={(event) => startOfScreen(event.nativeEvent.layout)} 
                style={styles.fieldContainer}>
                    {line1()}
                    {line2()}
                    {heart()}
                    {middleText()}
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={styles.healhText} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>HP {health}/{maxHealth}</Text>
                </View>
            </SafeAreaView>
        </ImageBackground>
);
    
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width:"100%",
        backgroundColor: "rgba(255,255,255, 0.1)"//do przerobienia w gimpie
    },
    opponenContainer:{
        justifyContent: 'flex-end',
        alignItems:'center',
    },
    opponent: {
        height: 100,
        width: 100,
    },
    image100:{
        width: '100%',
        height: '100%',
    },
     fieldContainer:{
         flex: 1,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal: 20,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: "black",
        backgroundColor: "rgba(0,0,0, 0.5)",
        overflow: 'hidden'
     },
     heartContainer:{
        width: 40,
        height: 40,
     },
     heartIMG: {
        width: '100%',
        height: '100%',
     },
     button: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: 'blue'
      },
      healhText: {
        color: 'white',
        textAlign: 'center',
        fontFamily:'Buttons',
        fontSize: 50,
      },
      lineVertical:{
        position: "absolute",
        height: 1000,
        justifyContent: 'center',
        alignItems: 'center',
      },
      middleText: {
        fontSize: 60,
        color: "white",
        fontFamily: "Buttons",
        textAlign: "center",
    },
})

export default EnemyRound;
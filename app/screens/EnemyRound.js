import {React, useState, useRef, Component, useEffect, useReducer, useCallback} from 'react';
import { View, Image, Animated, ImageBackground, StyleSheet, SafeAreaView, StatusBar, Text, Dimensions, Easing} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Movable from './MovableHeart';

function EnemyRound({navigation, route}) {

    const [health, setHealth] = useState(route?.params?.health);
    const [maxHealth] = useState(route?.params?.maxHealth);
    const [isElem, setIsElem] = useState({heart: false, text: false});
    const [viewHeight_s, setViewHeight_s] = useState(0);
    const [wasHit, setWasHit] = useState(false);
    const [startVertical, setStartVertical] = useState({_1: false, _2: false});
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
    const firstUpdate_line = useRef({_1: false, _2: false});
    const randomHeight = useRef({_1: 0, _2: 0});
    const UpDown = useRef({_1: 0.0, _2: 0.0});
    
    const textProgress = useRef(new Animated.Value(0)).current;
    const linePosition1 = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    const linePosition2 = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
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
        healthPass.current = healthPass.current - 4;
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
            linePosition1.y.removeAllListeners();
            linePosition2.y.removeAllListeners();

            setTimeout(() => {
                endOfScreen();
            }, 300);
        }
    }, [health])
  
    //on layout when start of the screen
    function startOfScreen(layout){

        //get dimentions
        view.current.x = layout.x;
        view.current.y = layout.y;
        view.current.width = layout.width;
        view.current.height = layout.height;
        setViewHeight_s(()=>layout.height);
    
        //set difficulty
        if(route?.params?.difficulty == 'easy'){
            lineSpeed.current.vertical = 2000;
            lineSpeed.current.horizontal = 2500;
        }else{
            lineSpeed.current.vertical = 1200;
            lineSpeed.current.horizontal = 1700;
        }
        
        //initial position of heart
        heartPos.current.x = layout.width/2;
        heartPos.current.y = layout.height/2;

        //random height of lines on start
        randomHeight.current._1 = randomNumber((-view.current.height * 0.75)/2, (view.current.height * 0.75)/2);
        randomHeight.current._2 = randomNumber((-view.current.height * 0.75)/2, (view.current.height * 0.75)/2);

        linePosition1.setValue({x: -layout.width/2, y: randomHeight.current._1})      
        linePosition2.setValue({x: -layout.width/2, y: randomHeight.current._2})      

        //set if line goes down or up
        UpDown.current._1 = Math.random();
        UpDown.current._2 = Math.random();

        //check if first round
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
        
        //start of lines aniamtions
        setTimeout(() => {
            Animated.timing(linePosition1.x, {toValue: view.current.width/2 + 20, duration: lineSpeed.current.horizontal, easing: Easing.linear ,useNativeDriver: true}).start();
            setStartVertical((obj)=> ({...obj, _1: !obj._1}));
        }, firstRound.current ? 5500: 2000);

        setTimeout(() => {
            Animated.timing(linePosition2.x, {toValue: view.current.width/2 + 20, duration: lineSpeed.current.horizontal, easing: Easing.linear ,useNativeDriver: true}).start();
            setStartVertical((obj)=> ({...obj, _2: !obj._2}));
        }, firstRound.current? 5500 + lineSpeed.current.horizontal/2: 2000 + lineSpeed.current.horizontal/2);

        //opponent animations
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
    //all listeners
    useEffect(()=> {

        //LINE1
        linePosition1.x.removeAllListeners();
        
        linePosition1.x.addListener(({value}) => {
            
            //get position
            linePos.current._1.x = value + view.current.width/2;

            //line on the end of view
            if(linePos.current._1.x > view.current.width + 10){
                linePosition1.stopAnimation();

                //reset red
                clearTimeout(changeColorLine.current._1);
                setLineHit((obj)=>({...obj, _1: false}));

                //set new random height and the way
                randomHeight.current._1 = randomNumber((-view.current.height * 0.75)/2, (view.current.height * 0.75)/2);
                linePosition1.setValue({x: -view.current.width/2 - 10, y: randomHeight.current._1});
                UpDown.current._1 = Math.random();

                //renew animations
                setStartVertical((obj)=> ({...obj, _1: !obj._1}));
                Animated.timing(linePosition1.x, {toValue: view.current.width/2 + 20, duration: lineSpeed.current.horizontal ,easing: Easing.linear ,useNativeDriver: true}).start();
            }
        })
        
        linePosition1.y.removeAllListeners();
        linePosition1.y.addListener(({value}) => {
            linePos.current._1.y = value + view.current.height/2;

            //when hit heart
            if(linePos.current._1.x + 30 > heartPos.current.x && linePos.current._1.x - 30 < heartPos.current.x && (linePos.current._1.y + 17 < heartPos.current.y || linePos.current._1.y - 17 > heartPos.current.y)){
                linePosition1.y.removeAllListeners();
                linePosition2.y.removeAllListeners();

                setLineHit((obj)=>({...obj, _1: true}));

                setHealth((c)=> c - 2);
                healthPass.current = healthPass.current + 2;

                setTimeout(() => {
                    setWasHit((c) => !c)
                }, 500);

                changeColorLine.current._1 = setTimeout(() => {
                    setLineHit((obj)=>({...obj, _1: false}));
                }, 500);
            }
        })
        
        //LINE2
        linePosition2.x.removeAllListeners();
        linePosition2.x.addListener(({value}) => {
        linePos.current._2.x = value + view.current.width/2;

            //line on the end of view
            if(linePos.current._2.x > view.current.width + 10){
                linePosition2.stopAnimation();

                clearTimeout(changeColorLine.current._2);
                setLineHit((obj)=>({...obj, _2: false}));

                randomHeight.current._2 = randomNumber((-view.current.height * 0.75)/2, (view.current.height * 0.75)/2);

                linePosition2.setValue({x: -view.current.width/2 - 10, y: randomHeight.current._2});
                UpDown.current._2 = Math.random();

                setStartVertical((obj)=> ({...obj, _2: !obj._2}));
                Animated.timing(linePosition2.x, {toValue: view.current.width/2 + 20, duration: lineSpeed.current.horizontal, easing: Easing.linear ,useNativeDriver: true}).start();
            }
        })

        linePosition2.y.removeAllListeners();
        linePosition2.y.addListener(({value}) => {
            linePos.current._2.y = value + view.current.height/2;

            //when hit heart
            if(linePos.current._2.x + 30 > heartPos.current.x && linePos.current._2.x - 30 < heartPos.current.x && (linePos.current._2.y + 17 < heartPos.current.y || linePos.current._2.y - 17 > heartPos.current.y)){
                linePosition1.y.removeAllListeners();
                linePosition2.y.removeAllListeners();

                setLineHit((obj)=>({...obj, _2: true}));

                setHealth((c)=> c - 2)
                healthPass.current = healthPass.current + 2;

                setTimeout(() => {
                    setWasHit((c) => !c)
                }, 500);

                changeColorLine.current._2 = setTimeout(() => {
                    setLineHit((obj)=>({...obj, _2: false}));
                }, 500);
            }
        })

    }, [wasHit])

    const duration1  = useRef();
    const viewForLine1 = useRef();
    const duration2  = useRef();
    const viewForLine2 = useRef();

    //horizontal line1 animation
    useEffect(()=> {
        if(!firstUpdate_line.current._1){
            firstUpdate_line.current._1 = true;
            return;
        }

        //LINE1 logic
        if(!randomHeight.current._1){
            if(UpDown.current._1 > 0.5){
                duration1.current = lineSpeed.current.vertical;
                viewForLine1.current = view.current.height;
            }
            else{
                duration1.current = lineSpeed.current.vertical;
                viewForLine1.current = -view.current.height;
            }
        }
        else{
            if(UpDown.current._1 > 0.5){ //up
                duration1.current = (randomHeight.current._1 + view.current.height) * lineSpeed.current.vertical/500;
                viewForLine1.current = view.current.height;
            }
            else{ //down
                duration1.current = (-randomHeight.current._1 + view.current.height) * lineSpeed.current.vertical/500;
                viewForLine1.current = -view.current.height
            }
        }
        
        Animated.sequence([
            Animated.timing(linePosition1.y, {toValue: (-viewForLine1.current * 0.75)/2, duration: duration1.current, easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(linePosition1.y, {toValue: (viewForLine1.current * 0.75)/2, duration: lineSpeed.current.vertical, easing: Easing.linear, useNativeDriver: true})
            
        ]).start(({finished})=>{
            if(finished){
                randomHeight.current._1 = 0;
                setStartVertical((obj)=> ({...obj, _1: !obj._1}));
            }
        });
    }, [startVertical._1])

    //horizontal line2 animation
    useEffect(()=> {
        if(!firstUpdate_line.current._2){
            firstUpdate_line.current._2 = true;
            return;
        }

        //LINE2 logic
        if(!randomHeight.current._2){
            if(UpDown.current._2 > 0.5){
                duration2.current = lineSpeed.current.vertical;
                viewForLine2.current = view.current.height;
            }
            else{
                duration2.current = lineSpeed.current.vertical;
                viewForLine2.current = -view.current.height;
            }
        }
        else{
            if(UpDown.current._2> 0.5){ //up
                duration2.current = (randomHeight.current._2 + view.current.height/2) * lineSpeed.current.vertical/500;
                viewForLine2.current = view.current.height;
            }
            else{ //down
                duration2.current = (-randomHeight.current._2 + view.current.height/2) * lineSpeed.current.vertical/500;
                viewForLine2.current = -view.current.height;
            }
        }
        
        Animated.sequence([
            Animated.timing(linePosition2.y, {toValue: (-viewForLine2.current * 0.75)/2, duration: duration2.current, easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(linePosition2.y, {toValue: (viewForLine2.current * 0.75)/2, duration: lineSpeed.current.vertical, easing: Easing.linear, useNativeDriver: true})
            
        ]).start(({finished})=>{
            if(finished){
                randomHeight.current._2 = 0;
                setStartVertical((obj)=> ({...obj, _2: !obj._2}));
            }
        });
    }, [startVertical._2])


    function heart(){
        if(isElem.heart){
            return(
                <Movable position={takeHeartPosition} borderHit={borderHit} viewX={view.current.x} viewY={view.current.y} 
                viewWidth={view.current.width} viewHeight={view.current.height}/>
            )
        }
    }

    function opponent(){
        return(
            <Animated.View style={[styles.opponent, {opacity: oppOpacity, transform: [{translateX: oppPosition.x}, {translateY: oppPosition.y}]}]}>
                <Image source={oppPath.current}  style={styles.image100} />
            </Animated.View>
        )
    }

    

    function line1(){
        return(
            <Animated.View style={[styles.lineVertical, lineHit._1 && {backgroundColor:"rgba(255, 0, 0, 0.6)"}, {height: viewHeight_s* 2.5,width: viewHeight_s/80 ,transform: [{translateX: linePosition1.x}, {translateY: linePosition1.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} source={require('../assets/lineHorizontal.png')}></Image>
            </Animated.View>
        )
    }

    function line2(){
        return(
            <Animated.View style={[styles.lineVertical, lineHit._2 && {backgroundColor:"rgba(255, 0, 0, 0.6)"}, {height: viewHeight_s* 2.5,width: viewHeight_s/80 ,transform: [{translateX: linePosition2.x}, {translateY: linePosition2.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} source={require('../assets/lineHorizontal.png')}></Image>
            </Animated.View>
        )
    }

    function middleText(){
        if(isElem.text){
            return(
                <Animated.View
                style={{position: 'absolute', height: '70%', top: '35%', alignSelf: 'center', opacity: textProgress, transform: [{scale: textProgress}]}}>
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
                <View onLayout={(event) => startOfScreen(event.nativeEvent.layout)} style={styles.fieldContainer}>
                    {line1()}
                    {line2()}
                    {heart()}
                    {middleText()}
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={styles.healhText} adjustsFontSizeToFit={true} numberOfLines={1}>HP {health}/{maxHealth}</Text>
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
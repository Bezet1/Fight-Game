import {React, useState, useRef, Component, useEffect, useReducer, useCallback} from 'react';
import { View, Image, Animated, ImageBackground, StyleSheet, SafeAreaView, StatusBar, Text, Dimensions, Easing} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Movable from './MovableHeart';

function EnemyRound({navigation, route}) {

    const oppPath = useRef(route?.params?.path);
    const [health, setHealth] = useState(route?.params?.health);
    const healthPass = useRef(0);
    
    const lineSpeedVertical = useRef(0);
    const lineSpeedHorizontal = useRef(0);
    const viewX = useRef(0);
    const viewY = useRef(0);
    const viewWidth = useRef(0);
    const viewHeight = useRef(0);
    const heartX = useRef(0);
    const heartY = useRef(0);
    const [isHeart, setIsHeart] = useState(false);
    const [viewHeight_s, setViewHeight_s] = useState(0);
    const line1Y = useRef(0);
    const line1X = useRef(0);
    const line2Y = useRef(0);
    const line2X = useRef(0);
    const changeColorLine1 = useRef();
    const changeColorLine2 = useRef();
    const [maxHealth, setMaxHealth] = useState(route?.params?.maxHealth)
    
    const [wasHit, setWasHit] = useState(false);
    const firstUpdate_line1 = useRef(false);
    const firstUpdate_line2 = useRef(false);
    
    const [startVertical1, setStartVertical1] = useState(false);
    const [startVertical2, setStartVertical2] = useState(false);

    const [line1IMG, setLine1IMG] = useState(require('../assets/lineHorizontal.png'));
    const [line2IMG, setLine2IMG] = useState(require('../assets/lineHorizontal.png'));

    const randomHeight1 = useRef(0);
    const randomHeight2 = useRef(0);
    const UpDown1 = useRef();
    const UpDown2 = useRef();

    const[isText, setIsText] = useState(false);
    const textProgress = useRef(new Animated.Value(0)).current;

    const linePosition1 = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    const linePosition2 = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    const oppPosition = useRef(new Animated.ValueXY({x: -100, y: -5})).current;
    const oppOpacity = useRef(new Animated.Value(0)).current;

    const[firstRound, setFirstRound] = useState(route?.params?.isFirstRound);

    function randomNumber(min, max) { 
        return Math.random() * (max - min) + min;
    }

    //end of round
    useEffect(()=> {
        setTimeout(() => {
            navigation.navigate({
                name: 'Game',
                params: { EN_health: healthPass.current },
                merge: true,
              });
        },12000)//firstRound ? 18500: 15000);
    }, [])

    //when loose
    useEffect(()=> {
        if(health < 1){
            setHealth(()=>0);
            linePosition1.y.removeAllListeners();
            linePosition2.y.removeAllListeners();

            setTimeout(() => {
                navigation.navigate({
                    name: 'Game',
                    params: { EN_health: healthPass.current },
                    merge: true,
                  });
            }, 300);
        }
    }, [health])
  
    //on layout when start of screen
    function getDimentions(layout){
        viewX.current = layout.x;
        viewY.current = layout.y;
        viewWidth.current = layout.width;
        viewHeight.current = layout.height;
        setViewHeight_s(()=>layout.height);
    
        if(route?.params?.difficulty == 'easy'){
            lineSpeedVertical.current = 10000//2000;
            lineSpeedHorizontal.current = 10000//2500;
        }else{
            lineSpeedVertical.current = 1200;
            lineSpeedHorizontal.current = 1700;
        }
        
        heartX.current = layout.width/2;
        heartY.current = layout.height/2;

        //random height of lines on start
        randomHeight1.current = randomNumber((-viewHeight.current * 0.75)/2, (viewHeight.current * 0.75)/2);
        randomHeight2.current = randomNumber((-viewHeight.current * 0.75)/2, (viewHeight.current * 0.75)/2);

        linePosition1.setValue({x: -layout.width/2, y: randomHeight1.current})      
        linePosition2.setValue({x: -layout.width/2, y: randomHeight1.current})      

        UpDown1.current = Math.random();
        UpDown2.current = Math.random();

        if(firstRound){
            setIsText(() => true)
            textProgress.setValue(0);
            Animated.spring(textProgress, {toValue: 1, useNativeDriver: true, delay: 500}).start();
            setTimeout(() => {
                Animated.spring(textProgress, {toValue: 0, useNativeDriver: true}).start(() => {
                    setIsText(() => false)
                    setIsHeart(()=>true);
                });
            }, 2500);
        }
        else{
            setTimeout(() => {
                setIsHeart(()=>true);
            }, 500);
        }
        
        //start of aniamtions
        setTimeout(() => {
            Animated.timing(linePosition1.x, {toValue: viewWidth.current/2 + 20, duration: lineSpeedHorizontal.current,easing: Easing.linear ,useNativeDriver: true}).start();
            setStartVertical1((current)=> !current)
        }, firstRound ? 5500: 2000);

        setTimeout(() => {
            Animated.timing(linePosition2.x, {toValue: viewWidth.current/2 + 20, duration: lineSpeedHorizontal.current, easing: Easing.linear ,useNativeDriver: true}).start();
            setStartVertical2((current)=> !current)
        }, firstRound? 5500 + lineSpeedHorizontal.current/2: 2000 + lineSpeedHorizontal.current/2);

        
        Animated.spring(oppOpacity, {toValue: 1, useNativeDriver: true, delay: 1000}).start();

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
    
    //heart get position
    function takeHeartPosition(valueX, valueY){
        heartX.current = valueX + viewWidth.current/2;
        heartY.current = valueY + viewHeight.current/2;
    }

    //all listeners
    useEffect(()=> {

        //LINE1
        linePosition1.x.removeAllListeners();
        linePosition1.x.addListener(({value}) => {
            line1X.current = value + viewWidth.current/2;

            //line on the end of view
            if(line1X.current > viewWidth.current + 10){
                linePosition1.stopAnimation();

                clearTimeout(changeColorLine1.current);
                setLine1IMG(()=>require('../assets/lineHorizontal.png'))

                randomHeight1.current = randomNumber((-viewHeight.current * 0.75)/2, (viewHeight.current * 0.75)/2);

                linePosition1.setValue({x: -viewWidth.current/2 - 10, y: randomHeight1.current});
                UpDown1.current = Math.random();

                setStartVertical1((current)=> !current);
                Animated.timing(linePosition1.x, {toValue: viewWidth.current/2 + 20, duration: lineSpeedHorizontal.current ,easing: Easing.linear ,useNativeDriver: true}).start();
            }
        })
        
        linePosition1.y.removeAllListeners();
        linePosition1.y.addListener(({value}) => {
            line1Y.current = value + viewHeight.current/2;

            //when hit heart
            if(line1X.current + 30 > heartX.current && line1X.current - 30 < heartX.current && (line1Y.current + 17 < heartY.current || line1Y.current - 17 > heartY.current)){
                linePosition1.y.removeAllListeners();
                linePosition2.y.removeAllListeners();

                setLine1IMG(()=>require('../assets/lineHorizontalRed.png'));

                setHealth((c)=> c - 2);
                healthPass.current = healthPass.current + 2;

                setTimeout(() => {
                    setWasHit((c) => !c)
                }, 500);

                changeColorLine1.current = setTimeout(() => {
                    setLine1IMG(()=>require('../assets/lineHorizontal.png'))
                }, 500);
            }
        })
        
        //LINE2
        linePosition2.x.removeAllListeners();
        linePosition2.x.addListener(({value}) => {
        line2X.current = value + viewWidth.current/2;

            //line on the end of view
            if(line2X.current > viewWidth.current + 10){
                linePosition2.stopAnimation();

                clearTimeout(changeColorLine2.current);
                setLine2IMG(()=>require('../assets/lineHorizontal.png'))

                randomHeight2.current = randomNumber((-viewHeight.current * 0.75)/2, (viewHeight.current * 0.75)/2);

                linePosition2.setValue({x: -viewWidth.current/2 - 10, y: randomHeight2.current});
                UpDown2.current = Math.random();

                setStartVertical2((current)=> !current);
                Animated.timing(linePosition2.x, {toValue: viewWidth.current/2 + 20, duration: lineSpeedHorizontal.current, easing: Easing.linear ,useNativeDriver: true}).start();
            }
        })

        linePosition2.y.removeAllListeners();
        linePosition2.y.addListener(({value}) => {
            line2Y.current = value + viewHeight.current/2;

            //when hit heart
            if(line2X.current + 30 > heartX.current && line2X.current - 30 < heartX.current && (line2Y.current + 17 < heartY.current || line2Y.current - 17 > heartY.current)){
                linePosition1.y.removeAllListeners();
                linePosition2.y.removeAllListeners();

                setLine2IMG(()=>require('../assets/lineHorizontalRed.png'))

                setHealth((c)=> c - 2)
                healthPass.current = healthPass.current + 2;

                setTimeout(() => {
                    setWasHit((c) => !c)
                }, 500);

                changeColorLine2.current = setTimeout(() => {
                    setLine2IMG(()=>require('../assets/lineHorizontal.png'))
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
        if(!firstUpdate_line1.current){
            firstUpdate_line1.current = true;
            return;
        }

        //LINE1 logic
        if(!randomHeight1.current){
            if(UpDown1.current > 0.5){
                duration1.current = lineSpeedVertical.current;
                viewForLine1.current = viewHeight.current;
            }
            else{
                duration1.current = lineSpeedVertical.current;
                viewForLine1.current = -viewHeight.current;
            }
        }
        else{
            if(UpDown1.current > 0.5){ //up
                duration1.current = (randomHeight1.current + viewHeight.current/2) * lineSpeedVertical.current/500;
                viewForLine1.current = viewHeight.current;
            }
            else{ //down
                duration1.current = (-randomHeight1.current + viewHeight.current/2) * lineSpeedVertical.current/500;
                viewForLine1.current = -viewHeight.current;
            }
        }
        
        Animated.sequence([
            Animated.timing(linePosition1.y, {toValue: (-viewForLine1.current * 0.75)/2, duration: duration1.current, easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(linePosition1.y, {toValue: (viewForLine1.current * 0.75)/2, duration: lineSpeedVertical.current, easing: Easing.linear, useNativeDriver: true})
            
        ]).start(({finished})=>{
            if(finished){
                randomHeight1.current = 0;
                setStartVertical1((current) => !current);
            }
        });
    }, [startVertical1])

    //horizontal line2 animation
    useEffect(()=> {
        if(!firstUpdate_line2.current){
            firstUpdate_line2.current = true;
            return;
        }

        //LINE2 logic
        if(!randomHeight2.current){
            if(UpDown2.current > 0.5){
                duration2.current = lineSpeedVertical.current;
                viewForLine2.current = viewHeight.current;
            }
            else{
                duration2.current = lineSpeedVertical.current;
                viewForLine2.current = -viewHeight.current;
            }
        }
        else{
            if(UpDown2.current > 0.5){ //up
                duration2.current = (randomHeight2.current + viewHeight.current/2) * lineSpeedVertical.current/500;
                viewForLine2.current = viewHeight.current;
            }
            else{ //down
                duration2.current = (-randomHeight2.current + viewHeight.current/2) * lineSpeedVertical.current/500;
                viewForLine2.current = -viewHeight.current;
            }
        }
        
        Animated.sequence([
            Animated.timing(linePosition2.y, {toValue: (-viewForLine2.current * 0.75)/2, duration: duration2.current, easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(linePosition2.y, {toValue: (viewForLine2.current * 0.75)/2, duration: lineSpeedVertical.current, easing: Easing.linear, useNativeDriver: true})
            
        ]).start(({finished})=>{
            if(finished){
                randomHeight2.current = 0;
                setStartVertical2((current) => !current);
            }
        });
    }, [startVertical2])

    function borderHit(){
        setHealth((current)=> current - 4);
        healthPass.current = healthPass.current + 4;
    }

    function heart(){
        if(isHeart){
            return(
                <Movable position={takeHeartPosition} borderHit={borderHit} viewX={viewX} viewY={viewY} viewWidth={viewWidth} viewHeight={viewHeight}/>
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
            <Animated.View style={[styles.lineVertical, {height: viewHeight_s* 2.5,width: viewHeight_s/80 ,transform: [{translateX: linePosition1.x}, {translateY: linePosition1.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} source={line1IMG}></Image>
            </Animated.View>
        )
    }

    function line2(){
        return(
            <Animated.View style={[styles.lineVertical, {height: viewHeight_s* 2.5,width: viewHeight_s/80 ,transform: [{translateX: linePosition2.x}, {translateY: linePosition2.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} source={line2IMG}></Image>
            </Animated.View>
        )
    }

    function middleText(){
        if(isText){
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
                <View onLayout={(event) => getDimentions(event.nativeEvent.layout)} style={styles.fieldContainer}>
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
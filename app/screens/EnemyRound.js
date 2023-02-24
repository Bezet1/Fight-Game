import {React, useState, useRef, Component, useEffect} from 'react';
import { View, Image, Animated, ImageBackground, StyleSheet, SafeAreaView, StatusBar, Text} from 'react-native';
import { useGestureHandlerRef } from 'react-navigation-stack';

import Movable from './MovableHeart';

function EnemyRound({navigation, route}) {

    const oppPath = useRef(route.params.path);
    const [health, setHealth] = useState(0);
    
    const viewX = useRef(0);
    const viewY = useRef(0);
    const viewWidth = useRef(0);
    const viewHeight = useRef(0);
    const heartX = useRef(0);
    const heartY = useRef(0);
    const ballX = useRef(0);
    const ballY = useRef(0);
    const [viewWidth_s, setViewWidth_s] = useState(0);
    const [viewHeight_s, setViewHeight_s] = useState(0);
    const line1Y = useRef(0);
    const line1X = useRef(0);
    const [wasHit, setWasHit] = useState(false);
    const firstUpdate_wasHit = useRef(false);

    const ballPosition = useRef(new Animated.ValueXY({x: 20, y: -50})).current;
    const linePosition1 = useRef(new Animated.ValueXY({x: -100, y: -200})).current;

    function opponent(){
        return(
            <View style={styles.opponent}>
                <Image source={oppPath.current}  style={styles.image100} />
            </View>
        )
    }

    function getDimentions(layout){
        viewX.current = layout.x;
        viewY.current = layout.y;
        viewWidth.current = layout.width;
        viewHeight.current = layout.height;
        setViewHeight_s(()=>layout.height);
        setViewWidth_s(()=> layout.width);
        
        heartX.current = layout.width/2;
        heartY.current = layout.height/2;
    }
    
    function takeHeartPosition(valueX, valueY){
        heartX.current = valueX + viewWidth_s/2;
        heartY.current = valueY + viewHeight.current/2;
        console.log(heartX.current)
}
    useEffect(()=> {
        ballPosition.x.addListener(({value}) => {
            ballX.current = value + viewWidth.current/2;
        });
        
        ballPosition.y.addListener(({value}) => {
            ballY.current = value + viewHeight.current/2
        });
        
        linePosition1.x.addListener(({value}) => {
            line1X.current = value + viewWidth.current/2;
            if(line1X.current + 30 > heartX.current && line1X.current - 30 < heartX.current && (line1Y.current + 30 < heartY.current || line1Y.current - 30 > heartY.current)){

                linePosition1.x.removeAllListeners();
                setHealth((c)=> c + 1)
                setTimeout(() => {
                    setWasHit((c) => !c)
                }, 500);
            }
        })
        
        linePosition1.y.addListener(({value}) => {
            line1Y.current = value + viewHeight.current/2;
        })

    }, [wasHit])

    useEffect(()=> {
        Animated.loop(
            Animated.sequence([
            Animated.timing(linePosition1.y, {toValue: 200, duration: 50000,useNativeDriver: true}),
                Animated.timing(linePosition1.y, {toValue:-200, duration: 50000, useNativeDriver: true})
            ])
        ).start();
        
        Animated.loop(
            Animated.sequence([
            Animated.timing(linePosition1.x, {toValue: 100, duration: 18000,useNativeDriver: true}),
                Animated.timing(linePosition1.x, {toValue:-100, duration: 18000, useNativeDriver: true})
            ])
        ).start();
    }, [])

    function ball(){
        return(
            <Animated.View style={[styles.ball, {transform: [{translateX: ballPosition.x}, {translateY: ballPosition.y}]}]}/>
        )
    }

    function line1(){
        return(
            <Animated.View style={[styles.lineVertical, {height: viewHeight_s* 2.5, backgroundColor: 'blue',width: viewHeight_s/80 ,transform: [{translateX: linePosition1.x}, {translateY: linePosition1.y}]}]}>
                <Image resizeMode='contain' style={styles.image100} source={require('../assets/lineHorizontal.png')}></Image>
            </Animated.View>
        )
    }

    return (
        <ImageBackground style={styles.background} source={require("../assets/flame34k.jpg")}>
            <SafeAreaView style={styles.background}>
                <View style={[styles.opponenContainer, {height: 120 + StatusBar.currentHeight}]}>
                    {opponent()}
                </View>
                <View onLayout={(event) => getDimentions(event.nativeEvent.layout)} style={styles.fieldContainer}>
                    {line1()}
                    <Movable position={takeHeartPosition} viewX={viewX} viewY={viewY} viewWidth={viewWidth} viewHeight={viewHeight}/>
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={styles.healhText} adjustsFontSizeToFit={true} numberOfLines={1}>HP: {health}</Text>
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
      ball:{
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        backgroundColor: 'blue',
        position: "absolute"
      },
      lineVertical:{
        position: "absolute",
        height: 1000,
        justifyContent: 'center',
        alignItems: 'center',
      }
})

export default EnemyRound;
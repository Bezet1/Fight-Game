import {React, useState, useRef, Component, useEffect} from 'react';
import { View, Image, Animated, ImageBackground, StyleSheet, SafeAreaView, StatusBar, Text} from 'react-native';
import { useGestureHandlerRef } from 'react-navigation-stack';

import Movable from './MovableHeart';

function EnemyRound({navigation, route}) {

    const oppPath = useRef(route.params.path);
    const [health, setHealth] = useState(0);
    
    const viewX = useRef();
    const viewY = useRef();
    const viewWidth = useRef();
    const viewHeight = useRef();
    const heartX = useRef();
    const heartY = useRef();
    const ballX = useRef();
    const ballY = useRef();

    const ballPosition = useRef(new Animated.ValueXY({x: 20, y: -50})).current;
    
    function opponent(){
        return(
            <View style={styles.opponent}>
                <Image source={oppPath.current}  style={styles.imageOpp} />
            </View>
        )
    }

    function getDimentions(layout){
        viewX.current = layout.x;
        viewY.current = layout.y;
        viewWidth.current = layout.width;
        viewHeight.current = layout.height;
    }
    
    function takeHeartPosition(valueX, valueY){
        heartX.current = valueX + viewWidth.current/2;
        heartY.current = valueY + viewHeight.current/2;
        //console.log(heartX.current, ' ', heartY.current);
        
        if(ballX.current + 40 > heartX.current && ballX.current - 40 < heartX.current && ballY.current + 40 > heartY.current && ballY.current - 40 < heartY.current){
            console.log("dotkniecie")
            setHealth((c)=> c + 1)
        }
    }
    
    ballPosition.x.addListener(({value}) => {
        ballX.current = value + viewWidth.current/2;
    });

    ballPosition.y.addListener(({value}) => {
        ballY.current = value + viewHeight.current/2
    });
    
    useEffect(()=> {
        setTimeout(() => {
            Animated.timing(ballPosition.y, {toValue: 200, useNativeDriver: true, duration: 2000}).start();
        }, 2000);

    }, [])

    return (
        <ImageBackground style={styles.background} source={require("../assets/flame34k.jpg")}>
            <SafeAreaView style={styles.background}>
                <View style={[styles.opponenContainer, {height: 120 + StatusBar.currentHeight}]}>
                    {opponent()}
                </View>
                <View onLayout={(event) => getDimentions(event.nativeEvent.layout)} style={styles.fieldContainer}>
                    <Movable position={takeHeartPosition} viewX={viewX} viewY={viewY} viewWidth={viewWidth} viewHeight={viewHeight}/>
                    <Animated.View style={[styles.ball, {transform: [{translateX: ballPosition.x}, {translateY: ballPosition.y}]}]}/>
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
    imageOpp:{
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
      }
})

export default EnemyRound;
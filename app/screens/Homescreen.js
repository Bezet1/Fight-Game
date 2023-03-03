import {React, useEffect, useState, useRef, useCallback} from 'react';
import { ImageBackground, StyleSheet, View, Animated, Text, Pressable, BackHandler, SafeAreaView, Image, TextInput} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import {Audio} from 'expo-av'
import click from '../assets/sounds/click.mp3'

import Home from './Home';
import ChooseCharacter from './ChooseCharacter';
import ChooseOpponent from './ChooseOpponent';
import ChooseDifficulty from './ChooseDifficulty';

function Homescreen({navigation}) {

    const[isHomeScreen, setIsHomeScreen] = useState(true);
    const[isChooseCharacter, setIsChooseCharacter] = useState(false);
    const[isChooseOpponent, setisChooseOpponent] = useState(false);
    const[isChooseDifficulty, setIsChooseDifficulty] = useState(false);
    const[alertText, setAlertText] = useState([""]);
    const[is50Pressed, setIs50Pressed] = useState(false);
    const[is30Pressed, setIs30Pressed] = useState(false);
    const [myName, setMyName] = useState("");
    const [oppName, setOppName] = useState("");
    const [noName, setNoName] = useState(false);
    const [noCharacter, setNoCharacter] = useState(false);
    const [noOpponent, setNoOpponent] = useState(false);
    const [Char1Pressed, setChar1Pressed] = useState(false);
    const [Char2Pressed, setChar2Pressed] = useState(false);
    const [Char3Pressed, setChar3Pressed] = useState(false);
    const [opp1Pressed, setOpp1Pressed] = useState(false);
    const [opp2Pressed, setOpp2Pressed] = useState(false);
    const [opp3Pressed, setOpp3Pressed] = useState(false);
    const [charID, setCharID] = useState('');
    const [oppID, setOppID] = useState('');
    const passValues = useRef({health:0, difficulty:""});

    const aniScale = useRef(new Animated.Value(0.8)).current;
    const aniOpacity = useRef(new Animated.Value(0)).current;
    const damianUP = useRef(new Animated.Value(-2)).current;
    const rudyUP = useRef(new Animated.Value(-5)).current;

    const spinValue =  useRef(new Animated.Value(-1)).current
    
    const spinPrzemo = spinValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-10deg','0deg', '10deg']
    })

    //reset values when focus
    useFocusEffect(
        useCallback(() => { 
            setIsHomeScreen(()=>false);
            setIsChooseCharacter(()=>false);
            setisChooseOpponent(()=>false);
            setIsChooseDifficulty(()=>true);
            setAlertText(()=>false);
            setIs50Pressed(()=>false);
            setIs30Pressed(()=>false);
            setMyName(()=>"");
            setOppName(()=>'');
            setNoName(()=>false);
            setNoCharacter(()=>false);
            setNoOpponent(()=>false);
            setChar1Pressed(()=>false);
            setChar2Pressed(()=>false);
            setChar3Pressed(()=>false);
            setOpp1Pressed(()=>false);
            setOpp2Pressed(()=>false);
            setOpp3Pressed(()=>false);
            setCharID(()=>'');
            setOppID(()=>'');

        }, [])
      );

    //ANIMATIONS
    useEffect(()=> { 
        aniScale.setValue(0.8);
        aniOpacity.setValue(0);
        Animated.spring(aniScale, {toValue: 1, useNativeDriver: true}).start();
        Animated.timing(aniOpacity, {toValue: 1, duration: 200,useNativeDriver: true}).start();

    }, [isHomeScreen, isChooseCharacter, isChooseOpponent, isChooseDifficulty])

    useEffect(()=> {
        if(isChooseOpponent){
            Animated.loop(
                Animated.sequence([
                    Animated.spring(damianUP, {toValue: 2, useNativeDriver: true, restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 1}),
                    Animated.spring(damianUP, {toValue: -2, useNativeDriver: true, restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 1}),
                ])
            ).start();
            Animated.loop(
                Animated.sequence([
                    Animated.spring(spinValue, {toValue: 1, useNativeDriver: true, mass: 1}),
                    Animated.spring(spinValue, {toValue: -1, useNativeDriver: true, mass: 1}),
                ])
            ).start();
            Animated.loop(
                Animated.sequence([
                    Animated.spring(rudyUP, {toValue: 5, useNativeDriver: true, restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 3}),
                    Animated.spring(rudyUP, {toValue: -5, useNativeDriver: true, restDisplacementThreshold: 1, restSpeedThreshold: 1, mass: 3}),
                ])
            ).start();
        }
        else {
            damianUP.stopAnimation();

        }
    }, [isChooseOpponent])

      //homescreen element
      function Home_Screen(){
        if(isHomeScreen){
            return(
                <Home aniOpacity={aniOpacity} setIsHomeScreen={(val)=> setIsHomeScreen(()=> val)} setIsChooseCharacter={(val)=> setIsChooseCharacter(()=> val)} />
            )
        }
      }

      function chooseCharacter_Screen(){
        if(isChooseCharacter){
            return(
                <ChooseCharacter noCharacter={noCharacter} Char1Pressed={Char1Pressed} firstCharPressed={firstCharPressed}
                Char2Pressed={Char2Pressed} secondCharPressed={secondCharPressed} Char3Pressed={Char3Pressed} thirdCharPressed={thirdCharPressed}
                noName={noName} myName={myName} confirmChooseCharacter={confirmChooseCharacter} setNoName={(val) => setNoName(()=>val)}
                setMyName={(name)=> setMyName(()=>name)} backChooseCharacter={backChooseCharacter} aniScale={aniScale} aniOpacity={aniOpacity}/>
            )
        }
      }

      function chooseOpponent_Screen(){
        if(isChooseOpponent){
            return(
                <ChooseOpponent noOpponent={noOpponent} opp1Pressed={opp1Pressed} firstOppPressed={firstOppPressed}
                opp2Pressed={opp2Pressed} secondOppPressed={secondOppPressed} opp3Pressed={opp3Pressed} thirdOppPressed={thirdOppPressed}
                confirmChooseOpponent={confirmChooseOpponent} backChooseOpponent={backChooseOpponent} aniScale={aniScale} aniOpacity={aniOpacity}
                damianUP={damianUP} spinPrzemo={spinPrzemo} rudyUP={rudyUP}/>
            )
        }
      }

      //diffuculty element
      function chooseDifficulty_Screen(){
        if(isChooseDifficulty){
            return(
                <ChooseDifficulty backChooseDifficulty={backChooseDifficulty} pressed30={pressed30} is30Pressed={is30Pressed}
                pressed50={pressed50} is50Pressed={is50Pressed} alertText={alertText} goEasyLevel={goEasyLevel} goHardLevel={goHardLevel}
                aniScale={aniScale} aniOpacity={aniOpacity} />
            )
        }
      }

      function goEasyLevel(){passValues.current.difficulty = "easy"; startGame();}
      function goHardLevel(){passValues.current.difficulty = "hard"; startGame();}

      function startGame(){
        if(!is50Pressed && !is30Pressed){
            setAlertText(()=>["CHOOSE HEALTH!"]);
            return;
        }
        stopAnimation();

        navigation.navigate("Game", {difficulty: passValues.current.difficulty, health: passValues.current.health, char: charID, opp: oppID, myname: myName, oppname: oppName})
      }

      //when 50 health pressed
      function pressed50(){
        if(is30Pressed){
            setIs30Pressed(()=>false);
        }
        setIs50Pressed(() => true);
        passValues.current.health = 50;
      }

      //when 100 health pressed
      function pressed30(){
        if(is50Pressed){
            setIs50Pressed(()=>false)
        }
        setIs30Pressed(() => true);
        passValues.current.health = 30;
      }

      //go back pressed
      function backChooseDifficulty(){
        setIsChooseDifficulty(()=>false)
        setisChooseOpponent(()=>true);
        setIs30Pressed(()=> false);
        setIs50Pressed(()=> false);
        setAlertText(()=> []);
      }

      function backChooseCharacter(){
        setIsChooseCharacter(() =>false);
        setIsHomeScreen(() => true);
        setChar1Pressed(()=>false);
        setChar2Pressed(()=> false);
        setChar3Pressed(()=>false);
        setNoCharacter(()=> false);
        setNoName(()=> false)
        setMyName(()=> "")
      }

      function backChooseOpponent(){
        setisChooseOpponent(()=>false);
        setIsChooseCharacter(()=>true);
        setOpp1Pressed(()=>false);
        setOpp2Pressed(()=>false);
        setOpp3Pressed(()=>false);
        setNoOpponent(()=>false)
    }

      function firstCharPressed(){
        setChar1Pressed(()=>true);
        setChar2Pressed(()=> false);
        setChar3Pressed(()=>false);
        setNoCharacter(()=> false);
        setCharID(()=>'1');
      }

      function secondCharPressed(){
        setChar2Pressed(()=> true);
        setChar1Pressed(()=>false);
        setChar3Pressed(()=>false);
        setNoCharacter(()=> false);
        setCharID(()=>'2');
      }

      function thirdCharPressed(){
        setChar3Pressed(()=>true);
        setChar1Pressed(()=>false);
        setChar2Pressed(()=> false);
        setNoCharacter(()=> false);
        setCharID(()=>'3'); 
        }
        function firstOppPressed(){
            setOpp1Pressed(()=>true);
            setOpp2Pressed(()=>false)
            setOpp3Pressed(()=>false)
            setNoOpponent(()=>false)
            setOppID(()=> '1')
            setOppName(()=>'PROXIMITY')
        }
        function secondOppPressed(){
            setOpp1Pressed(()=>false);
            setOpp2Pressed(()=>true)
            setOpp3Pressed(()=>false)
            setNoOpponent(()=>false)
            setOppID(()=> '2')
            setOppName(()=>'PRZEMO')
        }
        function thirdOppPressed(){
            setOpp1Pressed(()=>false);
            setOpp2Pressed(()=>false)
            setOpp3Pressed(()=>true)
            setNoOpponent(()=>false)
            setOppID(()=> '3')
            setOppName(()=>'DJRUDY')
        }

      function confirmChooseCharacter(){
        if(myName == "" && !Char1Pressed && !Char2Pressed && !Char3Pressed){    
            setNoName(()=> true);
            setNoCharacter(() => true);
            return;                
        }
        else if(myName == ""){
            setNoName(()=> true);
            return;
        }
        else if(!Char1Pressed && !Char2Pressed && !Char3Pressed){           
            setNoCharacter(() => true);
            return;
        }

        setIsChooseCharacter(()=>false);
        setisChooseOpponent(()=>true);
      }

      function confirmChooseOpponent(){
        if(!opp1Pressed && !opp2Pressed && !opp3Pressed){
            setNoOpponent(()=>true);
            return;
        }
        setisChooseOpponent(()=> false);
        setIsChooseDifficulty(()=> true);

      }

      function stopAnimation(){
        aniScale.stopAnimation(); 
        aniOpacity.stopAnimation(); 
        damianUP.stopAnimation(); 
        rudyUP.stopAnimation(); 
        spinValue.stopAnimation(); 
      }

    return (
        <>
        <StatusBar translucent backgroundColor='transparent' style='light'/>
        <ImageBackground resizeMode='cover' style={styles.background} source={require("../assets/planet.jpg")}>
            <SafeAreaView style={{flex: 1}}>
                {Home_Screen()}
                {chooseCharacter_Screen()}
                {chooseOpponent_Screen()}
                {chooseDifficulty_Screen()}
            </SafeAreaView>
        </ImageBackground>
        </>

    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width:"100%",
        height: "100%"
    },
})

export default Homescreen;
import {React, useEffect, useState, useRef, useCallback, useContext} from 'react';
import { ImageBackground, StyleSheet, Animated, BackHandler, 
  SafeAreaView, Vibration, View, Dimensions} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

import Home from './Home';
import ChooseCharacter from './ChooseCharacter';
import ChooseOpponent from './ChooseOpponent';
import ChooseDifficulty from './ChooseDifficulty';
import { MusicContext } from '../assets/modules/MusicContext';
import {toggleMusic, playClick} from '../assets/modules/SoundFunctions'

function Homescreen({navigation}) {

    const[isScreen, setIsScreen] = useState({homeScreen: true, chooseCharacter: false, 
      chooseOpponent: false, chooseDifficulty: false}) 
    const[alertText, setAlertText] = useState([""]);
    const[isHpPress, setIsHpPress] = useState({_30: false, _50: false})
    const [name, setName] = useState({mine: '', opp: ''})
    const [noElem, setNoElem] = useState({name: false, oppName: false, char: false, opp: false})
    const [charPress, setCharPress] = useState({_1: false, _2: false, _3: false})
    const passValues = useRef({health:0, difficulty:'', charID: '', oppID: ''});

    const aniScale = useRef(new Animated.Value(0.8)).current;
    const aniOpacity = useRef(new Animated.Value(0)).current;
    
    const {contextObj, setContextObj} = useContext(MusicContext);

    function toggleMusicHandler(){
        toggleMusic(contextObj.ref, contextObj.isMusic);
        setContextObj((obj)=> ({...obj, isMusic: !obj.isMusic}));
        Vibration.vibrate(3);
    }
    
    //reset values when focus
    useFocusEffect(
      useCallback(() => { 
        setIsScreen((obj)=>({...obj, homeScreen: true, chooseCharacter: false, 
            chooseOpponent: false, chooseDifficulty: false}));
          setAlertText(()=>false);
          setIsHpPress((obj)=>({...obj, _30: false, _50: false}));
          setName((obj)=> ({...obj, mine: '', opp: ''}));
          setNoElem((obj)=>({...obj, name: false, opp: false, char: false}));
          setCharPress((obj)=> ({...obj, _1: false, _2: false, _3: false}));
          passValues.current.charID = '';
          passValues.current.oppID = '';
          setContextObj((obj)=> ({...obj, oppPicture: undefined}));
      }, [])
    );

    //ANIMATION when change sreen
    useEffect(()=> { 
        aniScale.setValue(0.8);
        aniOpacity.setValue(0);
        Animated.spring(aniScale, {toValue: 1, useNativeDriver: true}).start();
        Animated.timing(aniOpacity, {toValue: 1, duration: 200,useNativeDriver: true}).start();

    }, [isScreen.homeScreen, isScreen.chooseCharacter, isScreen.chooseOpponent, isScreen.chooseDifficulty])

    //set difficulty and start
    function goEasyLevel(){passValues.current.difficulty = "easy"; startGame();}

    //set difficulty and start
    function goHardLevel(){passValues.current.difficulty = "hard"; startGame();}
  
    //check if hp choosen, stop animations, and navigate to game
    function startGame(){
        playClick(setContextObj);
        if(!isHpPress._50 && !isHpPress._30){
          setAlertText(()=>["CHOOSE HEALTH!"]);
          return;
        }
        stopAnimation();

        navigation.navigate("Game", {difficulty: passValues.current.difficulty, 
          health: passValues.current.health, char: passValues.current.charID, opp: 
          passValues.current.oppID, myname: name.mine, oppname: name.opp
          });
      }
      
      //set hp
      function pressed50(){
        if(!isHpPress._50){
          Vibration.vibrate(3);
        }
        setIsHpPress((obj)=>({...obj, _30: false, _50: true}))
        passValues.current.health = 50;
      }
      
      //set hp
      function pressed30(){
        if(!isHpPress._30){
          Vibration.vibrate(3);
        }
        setIsHpPress((obj)=>({...obj, _30: true, _50: false}))
        passValues.current.health = 30;
      }
      
      //go back from choose character
      function backChooseCharacter(){
        setIsScreen((obj)=>({...obj, chooseCharacter: false, homeScreen: true}));
        setCharPress((obj)=> ({...obj, _1: false, _2: false, _3: false}));
        setNoElem((obj)=> ({...obj, name: false, char: false}));
        setName((obj)=> ({...obj, mine: ''}));
        Vibration.vibrate(6);
        
      }
      
      //go back from choose opponent
      function backChooseOpponent(){
        setIsScreen((obj)=>({...obj, chooseOpponent: false, chooseCharacter: true}));
        setNoElem((obj)=> ({...obj, opp: false, oppName: false}));
        setName((obj)=> ({...obj, opp: ''}));
        setContextObj((obj)=>({...obj, oppPicture: undefined}));
        Vibration.vibrate(6);
      }
      
      //go back from choose difficulty
      function backChooseDifficulty(){
        setIsScreen((obj)=>({...obj, chooseOpponent: true, chooseDifficulty: false}));
        setIsHpPress((obj)=>({...obj, _30: false, _50: false}));
        setAlertText(()=> []);
        Vibration.vibrate(6);
      }

      //set 1 character 
      function firstCharPressed(){
        if(!charPress._1){
          Vibration.vibrate(3);
        }
        setCharPress((obj)=> ({...obj, _1: true, _2: false, _3: false}));
        setNoElem((obj)=> ({...obj, char: false}))
        passValues.current.charID = '1';
      }
      
      //set 2 character 
      function secondCharPressed(){
        if(!charPress._2){
          Vibration.vibrate(3);
        }
        setCharPress((obj)=> ({...obj, _1: false, _2: true, _3: false}));
        setNoElem((obj)=> ({...obj, char: false}))
        passValues.current.charID = '2';
      }
      
      //set 3 character 
      function thirdCharPressed(){
        if(!charPress._3){
          Vibration.vibrate(3);
        }
        setCharPress((obj)=> ({...obj, _1: false, _2: false, _3: true}));
        setNoElem((obj)=> ({...obj, char: false}));
        passValues.current.charID = '3';
      }

      //next screen after choose character
      function confirmChooseCharacter(){
        playClick(setContextObj);
        if(name.mine == '' && !charPress._1 && !charPress._2 && !charPress._3){    
            setNoElem((obj)=> ({...obj, name: true, char: true}));
            return;                
          }
        else if(name.mine == ''){
            setNoElem((obj)=> ({...obj, name: true}));
            return;
          }
        else if(!charPress._1 && !charPress._2 && !charPress._3){           
            setNoElem((obj)=> ({...obj, char: true}));
            return;
          }
          setIsScreen((obj)=>({...obj, chooseCharacter: false, chooseOpponent: true}));
        }

      //next screen after choose opponent
      function confirmChooseOpponent(){
        playClick(setContextObj);
        if(contextObj.oppPicture == undefined && name.opp == ''){
          setNoElem((obj)=> ({...obj, opp: true, oppName: true}));
          return;
        }else if(contextObj.oppPicture == undefined){
          setNoElem((obj)=> ({...obj, opp: true}));
          return;
        }else if(name.opp == ''){
          setNoElem((obj)=> ({...obj, oppName: true}));
          return;
        }
        setIsScreen((obj)=>({...obj, chooseOpponent: false, chooseDifficulty: true}));
      }

      //stop all animations
      function stopAnimation(){
        aniScale.stopAnimation(); 
        aniOpacity.stopAnimation(); 
      }

      function Home_Screen(){
        if(isScreen.homeScreen){
            return(
                <Home aniOpacity={aniOpacity} setIsHomeScreen={(val)=> setIsScreen((obj)=> ({...obj, homeScreen: false}))} 
                setIsChooseCharacter={(val)=> setIsScreen((obj)=> ({...obj, chooseCharacter: true}))}
                navigation={navigation} exit={()=> setTimeout(() => BackHandler.exitApp(), 100)}
                playClick={()=> playClick(setContextObj)} pressedMusic={toggleMusicHandler} isMusic={contextObj.isMusic}/>
            )
        }
      }
  
      function chooseCharacter_Screen(){
        if(isScreen.chooseCharacter){
            return(
                <ChooseCharacter noCharacter={noElem.char} Char1Pressed={charPress._1} 
                firstCharPressed={firstCharPressed} Char2Pressed={charPress._2} secondCharPressed={secondCharPressed} 
                Char3Pressed={charPress._3} thirdCharPressed={thirdCharPressed} noName={noElem.name} myName={name.mine} 
                confirmChooseCharacter={confirmChooseCharacter} setNoName={(val) => setNoElem((obj)=> ({...obj, name: val}))}
                setMyName={(name)=> setName((obj)=> ({...obj, mine: name}))} backChooseCharacter={backChooseCharacter} 
                aniScale={aniScale} aniOpacity={aniOpacity}/>
            )
        }
      }
  
      function chooseOpponent_Screen(){
        if(isScreen.chooseOpponent){
            return(
                <ChooseOpponent noOpponent={noElem.opp} confirmChooseOpponent={confirmChooseOpponent} 
                backChooseOpponent={backChooseOpponent} aniScale={aniScale} aniOpacity={aniOpacity}
                
                noName={noElem.oppName} myName={name.opp} setNoName={(val) => setNoElem((obj)=> ({...obj, oppName: val}))}
                setOppName={(name)=> setName((obj)=> ({...obj, opp: name}))} setNoElem={(val)=> setNoElem((obj)=> ({...obj, opp: val}))}/>
            )
        }
      }
  
      function chooseDifficulty_Screen(){
        if(isScreen.chooseDifficulty){
            return(
                <ChooseDifficulty backChooseDifficulty={backChooseDifficulty} pressed30={pressed30} is30Pressed={isHpPress._30}
                pressed50={pressed50} is50Pressed={isHpPress._50} alertText={alertText} goEasyLevel={goEasyLevel} goHardLevel={goHardLevel}
                aniScale={aniScale} aniOpacity={aniOpacity}/>
            )
        }
      }
      
      return (
        <>
        <StatusBar translucent backgroundColor='transparent' style='light'/>
        <ImageBackground resizeMode='cover' style={styles.background} source={require("../assets/images/planet.jpg")}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
              <View style={{height: '100%', width: Math.min(400, Dimensions.get("screen").width), alignSelf: 'center'}}>
                {Home_Screen()}
                {chooseCharacter_Screen()}
                {chooseOpponent_Screen()}
                {chooseDifficulty_Screen()}
              </View>
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
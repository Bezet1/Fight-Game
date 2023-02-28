import {React, useEffect, useState, useRef, useCallback} from 'react';
import { ImageBackground, StyleSheet, View, Animated, Text, Pressable, BackHandler, SafeAreaView, Image, TextInput} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

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

    
    const aniScale = useRef(new Animated.Value(0.8)).current;
    const aniOpacity = useRef(new Animated.Value(0)).current;
    const damianUP = useRef(new Animated.Value(-2)).current;
    const rudyUP = useRef(new Animated.Value(-5)).current;

    const spinValue =  useRef(new Animated.Value(-1)).current
    
    const spinPrzemo = spinValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-10deg','0deg', '10deg']
    })

    //reset values when opens
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

    //animations
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
            <Animated.View style={[styles.container, {opacity: aniOpacity}]}>
            <View press style={styles.titleContainer}>
                <Text style={[styles.title,{top: 30}]} adjustsFontSizeToFit={true} numberOfLines={1}>Fight</Text>
                <Text style={styles.title} adjustsFontSizeToFit={true} numberOfLines={1}>game</Text>          
            </View>
            <View style={styles.options}>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={() => 
                    {setIsHomeScreen(() => false)
                    setIsChooseCharacter(() => true);
                    }}>
                    <Text style={styles.singleText}>START</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={() => navigation.navigate("HowToPlay")}>
                    <Text style={styles.singleText}>HOW TO PLAY</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={() => console.log("ranking")}>
                    <Text style={styles.singleText}>RANKING</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles.button, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={() => setTimeout(() => BackHandler.exitApp(), 100)}>
                    <Text style={styles.singleText}>EXIT</Text>
                </Pressable>
            </View>
        </Animated.View>)
        }
      }

      function chooseCharacter_Screen(){
        if(isChooseCharacter){
            return(
            <>
            <View style={{flex: 0.2}}>
                <Pressable onPress={backChooseCharacter} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                    <Text style={styles.backText}>BACK</Text>   
                </Pressable>
            </View>
            <Animated.View style={{flex: 1, justifyContent: "center", transform: [{scale: aniScale}], opacity: aniOpacity}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHOOSE YOUR</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHARACTER</Text>
                </View>
                <View style={{flex: 1}}>
                    <View style={[styles.myCharactersContainer, noCharacter && {borderColor: 'red'}]}>
                        <Pressable style={[styles.individualCharacter, Char1Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => firstCharPressed()}
                        >
                            <View style={{flex:3}}>
                                <Image style={{width:'100%', height:'100%'}} source={require("../assets/char1.gif")}></Image>
                            </View>
                            <View style={{flex:1, backgroundColor: "purple", justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white"}}>SOLDIER</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualCharacter, Char2Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => secondCharPressed()}
                        >
                            <View style={{flex:3}}>
                                <Image style={{width:'100%', height:'100%'}} source={require("../assets/char2.gif")}></Image>
                            </View>
                            <View style={{flex:1, backgroundColor: "purple", justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white"}}>GUMBALL</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualCharacter, Char3Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => thirdCharPressed()}
                        >
                            <View style={{flex:3}}>
                            <Image style={{width:'100%', height:'100%'}} source={require("../assets/char3.gif")}></Image>
                            </View>
                            <View style={{flex:1, backgroundColor: "purple", justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white"}}>FLAME</Text>
                            </View>
                        </Pressable>
                    </View>               
                    <View style={{flex: 1, paddingVertical: 50}}>
                        <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
                            <Text style={{color: 'white', fontFamily:'Buttons', textAlign:"center", fontSize:30}} adjustsFontSizeToFit={true} numberOfLines={1}>SET YOUR NAME</Text>
                            <TextInput style={[styles.input, noName && {borderWidth: 3, borderColor:"red"}]} placeholder="YOUR NAME" placeholderTextColor={"#444444"} textAlign={"center"}
                            onChangeText={newText => {setMyName(newText); setNoName(()=> false)}} value={myName} maxLength={15}
                            />
                            <Pressable style={({pressed}) => [styles.buttonChooseDifficulty, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} 
                            onPress={() => 
                                confirmChooseCharacter()
                            }>
                                <Text style={{textAlign:'center', fontSize: 30, fontFamily: 'Buttons', color: 'white'}}>CONFIRM</Text>
                            </Pressable>
                        </View> 
                    </View> 
                </View>
                
            </Animated.View>
            </>
            )
        }
      }

      function chooseOpponent_Screen(){
        if(isChooseOpponent){
            return(
            <>
            <View style={{flex: 0.2}}>
                <Pressable onPress={backChooseOpponent} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                    <Text style={styles.backText}>BACK</Text>   
                </Pressable>
            </View>
            <Animated.View style={{flex: 1, justifyContent: "center", transform: [{scale: aniScale}], opacity: aniOpacity}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHOOSE YOUR</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>OPPONENT</Text>
                </View>
                <View style={{flex: 1, justifyContent:'center'}}>
                    <View style={[styles.myOpponentsContainer, noOpponent && {borderColor: 'red'}]}>
                        <Pressable style={[styles.individualOpponent, opp1Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => firstOppPressed()}>
                            <View style={{flex:1, overflow: 'hidden'}}>
                                <Animated.Image resizeMode={'contain'} style={{width:'100%', height:'100%', transform: [{translateY: damianUP}]}} source={require("../assets/opp1.png")}></Animated.Image>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 20, color: '#20624D'}}>PROXIMITY</Text>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 13}}>LIKES TO TOW</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualOpponent, opp2Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => secondOppPressed()}>
                            <View style={{flex:1, overflow: 'hidden'}}>
                                <Animated.Image resizeMode={'contain'} style={{width:'100%', height:'100%', transform: [{rotate: spinPrzemo}]}} source={require("../assets/opp2.png")}></Animated.Image>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 20, color: '#20624D'}}>PRZEMO</Text>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 13}}>SINGS "LENO PALENO"</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualOpponent, opp3Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => thirdOppPressed()}>
                            <View style={{flex:1, overflow: 'hidden'}}>
                                <Animated.Image resizeMode={'contain'} style={{width:'100%', height:'100%', transform: [{translateX: rudyUP}]}} source={require("../assets/opp3.png")}></Animated.Image>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 20, color: '#20624D'}}>DJRUDY</Text>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 13}}>SAYS "OSTRYYY"</Text>
                            </View>
                        </Pressable>
                    </View>               
                </View>
                <View style={{flex: 1, alignItems:'center' ,justifyContent: 'center'}}>
                        <Pressable style={({pressed}) => [styles.buttonChooseDifficulty, {marginHorizontal: 0, marginVertical: 0}, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} 
                        onPress={() => 
                            confirmChooseOpponent()
                        }>
                            <Text style={{textAlign:'center', fontSize: 30, fontFamily: 'Buttons', color: 'white'}}>CONFIRM</Text>
                        </Pressable>
                </View>
                
            </Animated.View>
            </>
            )
        }
      }

      //diffuculty element
      function chooseDifficulty_Screen(){
        if(isChooseDifficulty){
            return(
            <>
            <Pressable onPress={backChooseDifficulty} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                <Text style={styles.backText}>BACK</Text>   
            </Pressable>
            <Animated.View style={{flex: 1, top: 15, transform: [{scale: aniScale}], opacity: aniOpacity}}>
                <View style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHOOSE</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>DIFFICULTY</Text>
                </View>
                <View style={styles.difficultyContainer}>
                    <View style={styles.difficultyButtonsContainer}>
                        <Text style={styles.healthText}>AMOUNT OF HEALTH:</Text>
                        <View style={styles.healthContainer}>
                            <Pressable onPress={pressed30} style={[styles.buttonHealth, is30Pressed && {backgroundColor: "#175728", borderColor: '#22803b'}]}>
                            <Text style={styles.singleHealthText}>30</Text>
                            </Pressable>
                            <Pressable onPress={pressed50} style={[styles.buttonHealth, is50Pressed && {backgroundColor: "#175728", borderColor: '#22803b'}]}>
                                <Text style={styles.singleHealthText}>50</Text>
                            </Pressable>
                        </View>
                        <View style={{height: 17,}}>
                            <Text style={styles.alertHealth}>{alertText}</Text>
                        </View>
                        <Text style={styles.gameDifficultyText}>GAME DIFFICULTY</Text>
                        <Pressable style={({pressed}) => [styles.buttonDifficulty, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={goEasyLevel}>
                            <Text style={styles.singleText}>EASY</Text>
                        </Pressable>
                        <Pressable style={({pressed}) => [styles.buttonDifficulty, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={goHardLevel}>
                            <Text style={styles.singleText}>HARD</Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
            </>
            )
        }
      }
      
      //when easy level pressed
      function goEasyLevel(){
          if(!is50Pressed && !is30Pressed){
            setAlertText(()=>["CHOOSE HEALTH!"]);
            return;
        }

        aniScale.stopAnimation(); 
        aniOpacity.stopAnimation(); 
        damianUP.stopAnimation(); 
        rudyUP.stopAnimation(); 
        spinValue.stopAnimation(); 

        if(is50Pressed){
            navigation.navigate("Game", {difficulty: "easy", health: 50, char: charID, opp: oppID, myname: myName, oppname: oppName})
        }
        else{
            navigation.navigate("Game", {difficulty: "easy", health: 30, char: charID, opp: oppID, myname: myName, oppname: oppName})
        }
        
      }

      //when hard level pressed
      function goHardLevel(){
        if(!is50Pressed && !is30Pressed){
            setAlertText(()=>["CHOOSE HEALTH!"]);
            return;
        }

        aniScale.stopAnimation(); 
        aniOpacity.stopAnimation(); 
        damianUP.stopAnimation(); 
        rudyUP.stopAnimation(); 
        spinValue.stopAnimation(); 

        if(is50Pressed){
            navigation.navigate("Game", {difficulty: "hard", health: 50, char: charID, opp: oppID, myname: myName, oppname: oppName})
        }
        else{
            navigation.navigate("Game", {difficulty: "hard", health: 30, char: charID, opp: oppID, myname: myName, oppname: oppName})
        }
      }

      //when 50 health pressed
      function pressed50(){
        if(is30Pressed){
            setIs30Pressed(()=>false)
        }
        setIs50Pressed(() => true)

      }

      //when 100 health pressed
      function pressed30(){
        if(is50Pressed){
            setIs50Pressed(()=>false)
        }
        setIs30Pressed(() => true)
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
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    background: {
        flex: 1,
        width:"100%",
        height: "100%"
    },
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        height: 200,
    },
    title:{
        color: "white",
        fontSize: 90,
        fontFamily: "Game",
        textAlign: "center",
    },
    options: {
        alignItems: "center",
        backgroundColor: 'rgba(20, 20, 20, 0.5)',
        borderRadius: 15,
        justifyContent: "space-evenly",
        paddingTop: 30,
        paddingBottom: 30,
    },
    button: {
        backgroundColor: "rgba(70, 70, 120, 0.95)",
        borderRadius: 10,
        width: 230,
        borderWidth: 3,
        borderColor: "rgba(133, 138, 171, 0.7)",
        height: 80,
        elevation: 50,
        marginHorizontal: 35,
        shadowColor: '#000000',
        justifyContent: "center",
        marginVertical: 13,
        
    },
    singleText: {
        fontSize: 25,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons"
    },
    difficultyContainer:{
        alignItems: "center",
        justifyContent: "center",
    },
    difficultyButtonsContainer:{
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 3,
        borderColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,  
        justifyContent: "space-evenly",
        paddingTop: 20,
        paddingBottom: 20,
    },
    buttonDifficulty: {
        backgroundColor: "rgba(70, 70, 120, 0.95)",
        borderRadius: 10,
        padding: 20,
        width: 230,
        borderWidth: 3,
        borderColor: "rgba(133, 138, 171, 0.7)",
        height: 80,
        elevation: 50,
        shadowColor: '#52006A',
        justifyContent: "center",
        margin: 15,
        
    },
    textChooseDifficulty: {
        fontSize: 40,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons",
    },
    healthText: {
        fontSize: 25,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons",
        
    },
    gameDifficultyText:{
        fontSize: 25,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons",
    },
    healthContainer: {
        justifyContent: "space-evenly",
        alignContent: "center",
        flexDirection: "row",
    },
    buttonHealth: {
        backgroundColor: "rgba(70, 70, 120, 0.85)",
        borderRadius: 10,
        width: 100,
        height: 50,
        borderWidth: 3,
        borderColor: "rgba(133, 138, 171, 0.7)",
        elevation: 50,
        shadowColor: '#52006A',
        justifyContent: "center",
        margin: 15,
    },
    singleHealthText: {
        fontSize: 22,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons"
    },
    alertHealth:{
        bottom: 15,
        fontSize: 15,
        textAlign: "center",
        color: "#de0202",
        fontFamily: "Buttons"
    },
    backContainer: {
        marginLeft: 10,
        marginTop: 60,
        width: 75,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignContent: "center",
    },
    backText: {
        color: "white",
        fontSize: 20,
        fontFamily: "Buttons",
        textAlign:"center",
    },
    chooseCharacterContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    myCharactersContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 20,
        margin: 20,
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: "space-evenly",
        borderWidth: 3,
        borderColor: 'rgba(0, 0, 0, 0.7)',
    },
    individualCharacter:{
        height: 100,
        width: 70,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    input: {
        height: 40,
        width: '70%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
      buttonChooseDifficulty: {
        backgroundColor: "rgba(70, 70, 120, 0.95)",
        borderRadius: 10,
        width: 230,
        borderWidth: 3,
        borderColor: "rgba(133, 138, 171, 0.7)",
        height: 80,
        elevation: 50,
        marginHorizontal: 35,
        shadowColor: '#000000',
        justifyContent: "center",
        marginVertical: 50,
    },
    myOpponentsContainer: {
        top: 20,
        flex: 1,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "space-evenly",     
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 3,
        borderColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 5,
    },
    individualOpponent:{
        margin: 5,
        flex:1,
        borderRadius: 1,
        borderWidth: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        flexDirection: 'row',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
})

export default Homescreen;
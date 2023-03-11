import React from 'react';
import {View, Text, Pressable, Image, TextInput, StyleSheet, Animated} from 'react-native';

function ChooseCharacter(props) {

    //input logic
    function inputChange (newText) {
        props.setNoName(false);
        props.setMyName(newText); 
    }

    return (
        <>
        <View style={{flex: 0.2}}>
                <Pressable onPress={props.backChooseCharacter} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                    <Text style={styles.backText}>BACK</Text>   
                </Pressable>
            </View>
            <Animated.View style={{flex: 1, justifyContent: "center", transform: [{scale: props.aniScale}], opacity: props.aniOpacity}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHOOSE YOUR</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHARACTER</Text>
                </View>
                <View style={{flex: 1}}>
                    <View style={[styles.myCharactersContainer, props.noCharacter && {borderColor: 'red'}]}>
                        <Pressable style={[styles.individualCharacter, props.Char1Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => props.firstCharPressed()}
                        >
                            <View style={{flex:3}}>
                                <Image style={{width:'100%', height:'100%'}} source={require("../assets/images/char1.gif")}></Image>
                            </View>
                            <View style={{flex:1, backgroundColor: "purple", justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white"}}>SOLDIER</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualCharacter, props.Char2Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => props.secondCharPressed()}
                        >
                            <View style={{flex:3}}>
                                <Image style={{width:'100%', height:'100%'}} source={require("../assets/images/char2.gif")}></Image>
                            </View>
                            <View style={{flex:1, backgroundColor: "purple", justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white"}}>GUMBALL</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualCharacter, props.Char3Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => props.thirdCharPressed()}
                        >
                            <View style={{flex:3}}>
                            <Image style={{width:'100%', height:'100%'}} source={require("../assets/images/char3.gif")}></Image>
                            </View>
                            <View style={{flex:1, backgroundColor: "purple", justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white"}}>FLAME</Text>
                            </View>
                        </Pressable>
                    </View>               
                    <View style={{flex: 1, paddingVertical: 50}}>
                        <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
                            <Text style={{color: 'white', fontFamily:'Buttons', textAlign:"center", fontSize:30}} adjustsFontSizeToFit={true} 
                            numberOfLines={1}>SET YOUR NAME</Text>
                            <TextInput style={[styles.input, props.noName && {borderWidth: 3, borderColor:"red"}]} placeholder="YOUR NAME" 
                            placeholderTextColor={"#444444"} textAlign={"center"}
                            onChangeText={newText => {inputChange(newText)}} value={props.myName} maxLength={15}
                            />
                            <Pressable style={({pressed}) => [styles.buttonChooseDifficulty, pressed && {transform: [{ scale: 0.9 }], 
                            backgroundColor: "rgba(37, 37, 64, 0.5)",}]} 
                            onPress={() => 
                                props.confirmChooseCharacter()
                            }>
                                <Text style={{textAlign:'center', fontSize: 30, fontFamily: 'Buttons', color: 'white'}}>CONFIRM</Text>
                            </Pressable>
                        </View> 
                    </View> 
                </View>
            </Animated.View>
        </>
    );
}
const styles = StyleSheet.create({
    textChooseDifficulty: {
        fontSize: 40,
        textAlign: "center",
        color: "white",
        fontFamily: "Buttons",
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
})

export default ChooseCharacter;
import React from 'react';
import {View, Text, Pressable, StyleSheet, Animated} from 'react-native';

function ChooseOpponent(props) {
    return (
        <>
        <View style={{flex: 0.2}}>
                <Pressable onPress={props.backChooseOpponent} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                    <Text style={styles.backText}>BACK</Text>   
                </Pressable>
            </View>
            <Animated.View style={{flex: 1, justifyContent: "center", transform: [{scale: props.aniScale}], opacity: props.aniOpacity}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>CHOOSE YOUR</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} numberOfLines={1}>OPPONENT</Text>
                </View>
                <View style={{flex: 1, justifyContent:'center'}}>
                    <View style={[styles.myOpponentsContainer, props.noOpponent && {borderColor: 'red'}]}>
                        <Pressable style={[styles.individualOpponent, props.opp1Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => props.firstOppPressed()}>
                            <View style={{flex:1, overflow: 'hidden'}}>
                                <Animated.Image resizeMode={'contain'} style={{width:'100%', height:'100%', transform: [{translateY: props.damianUP}]}} source={require("../assets/opp1.png")}></Animated.Image>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 20, color: '#20624D'}}>PROXIMITY</Text>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 13}}>LIKES TO TOW</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualOpponent, props.opp2Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => props.secondOppPressed()}>
                            <View style={{flex:1, overflow: 'hidden'}}>
                                <Animated.Image resizeMode={'contain'} style={{width:'100%', height:'100%', transform: [{rotate: props.spinPrzemo}]}} source={require("../assets/opp2.png")}></Animated.Image>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 20, color: '#20624D'}}>PRZEMO</Text>
                                <Text style={{fontFamily:"Buttons", color: "white", fontSize: 13}}>SINGS "LENO PALENO"</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.individualOpponent, props.opp3Pressed && {borderWidth: 3, borderColor: "white"}]}
                        onPress={() => props.thirdOppPressed()}>
                            <View style={{flex:1, overflow: 'hidden'}}>
                                <Animated.Image resizeMode={'contain'} style={{width:'100%', height:'100%', transform: [{translateX: props.rudyUP}]}} source={require("../assets/opp3.png")}></Animated.Image>
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
                            props.confirmChooseOpponent()
                        }>
                            <Text style={{textAlign:'center', fontSize: 30, fontFamily: 'Buttons', color: 'white'}}>CONFIRM</Text>
                        </Pressable>
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


export default ChooseOpponent;
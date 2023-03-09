import {React, useRef, useState} from 'react';
import {View, Text, Pressable, StyleSheet, ImageBackground, Dimensions} from 'react-native';

function Ranking({navigation}) {
    const screenWidth= useRef( Dimensions.get('window').width);
    const [difficulty, setDificulty] = useState({easy: true, hard: false});

    function goBack(){
        navigation.navigate("Homescreen")
    }

    function easyChoose(){
        setDificulty((obj)=> ({...obj, easy: true, hard: false}));
    }
    
    function hardChoose(){
        setDificulty((obj)=> ({...obj, easy: false, hard: true}));
    }


    return (
        <ImageBackground style={styles.background} source={require('../assets/dark2.jpg')}>
            <View style={{flex: 0.15 }}>
                <Pressable onPress={goBack} style={({pressed})=>[styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                    <Text style={styles.backText}>BACK</Text>   
                </Pressable>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{alignContent:'center', flex: 0.12,  justifyContent: 'center'}}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.rankingText}>RANKING</Text>
                </View>
                <View style={[styles.rankingContainer, {width: Math.min(350, screenWidth.current-20)}]}>
                    <View style={styles.difficultyContainer}>
                        <Pressable style={[styles.singleDifficulty, {backgroundColor: 'rgba(255, 255, 255, 0.1)'}, difficulty.easy && {backgroundColor: 'rgba(255, 255, 255, 0.5)'}]}
                        onPress={easyChoose}>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.singleDifficultyText}>EASY</Text>
                        </Pressable>
                        <Pressable style={[styles.singleDifficulty, {backgroundColor: 'rgba(255, 255, 255, 0.1)'}, difficulty.hard && {backgroundColor: 'rgba(255, 255, 255, 0.5)'}]}
                        onPress={hardChoose}>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.singleDifficultyText}>HARD</Text>
                        </Pressable>
                    </View>
                    <View>

                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    background:{
        flex: 1,
    },
    rankingContainer:{
        flex: 1,
        height: '95%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignSelf: 'center',
        margin: 20,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    difficultyContainer:{
        height: 60,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    singleDifficulty:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    singleDifficultyText:{
        color: "white",
        fontSize: 30,
        fontFamily: "Buttons",
        textAlign:"center",
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
    rankingText: {
        color: "white",
        fontSize: 60,
        fontFamily: "Buttons",
        textAlign:"center",
    },
})

export default Ranking;
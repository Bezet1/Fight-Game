import React from 'react';
import {View, Text, Pressable, StyleSheet, Animated} from 'react-native';

function ChooseDifficulty(props) {
    return (
        <>
            <Pressable onPress={props.backChooseDifficulty} style={({pressed})=>
            [styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]}>
                <Text style={styles.backText}>BACK</Text>   
            </Pressable>
            <Animated.View style={{flex: 1, top: 15, transform: [{scale: props.aniScale}], opacity: props.aniOpacity}}>
                <View style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>CHOOSE</Text>
                    <Text style={[styles.textChooseDifficulty, {fontSize: 40}]} adjustsFontSizeToFit={true} 
                    numberOfLines={1}>DIFFICULTY</Text>
                </View>
                <View style={styles.difficultyContainer}>
                    <View style={styles.difficultyButtonsContainer}>
                        <Text style={styles.healthText}>AMOUNT OF HEALTH:</Text>
                        <View style={styles.healthContainer}>
                            <Pressable onPress={()=>props.pressed30()} style={[styles.buttonHealth, 
                                props.is30Pressed && {backgroundColor: "#175728", borderColor: '#22803b'}]}>
                            <Text style={styles.singleHealthText}>30</Text>
                            </Pressable>
                            <Pressable onPress={()=>props.pressed50()} style={[styles.buttonHealth, 
                                props.is50Pressed && {backgroundColor: "#175728", borderColor: '#22803b'}]}>
                                <Text style={styles.singleHealthText}>50</Text>
                            </Pressable>
                        </View>
                        <View style={{height: 17,}}>
                            <Text style={styles.alertHealth}>{props.alertText}</Text>
                        </View>
                        <Text style={styles.gameDifficultyText}>GAME DIFFICULTY</Text>
                        <Pressable style={({pressed}) => [styles.buttonDifficulty, pressed && {transform: [{ scale: 0.9 }], 
                        backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={()=>props.goEasyLevel()}>
                            <Text style={styles.singleText}>EASY</Text>
                        </Pressable>
                        <Pressable style={({pressed}) => [styles.buttonDifficulty, pressed && {transform: [{ scale: 0.9 }], 
                        backgroundColor: "rgba(37, 37, 64, 0.5)",}]} onPress={()=>props.goHardLevel()}>
                            <Text style={styles.singleText}>HARD</Text>
                        </Pressable>
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
    singleText: {
        fontSize: 25,
        textAlign: "center",
        color: "white",
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

})

export default ChooseDifficulty;
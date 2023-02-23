import React from 'react';
import { View, Text, StatusBar, ImageBackground, StyleSheet, Pressable} from 'react-native';

function HowToPlay({navigation}) {
    


    return (
        <>
        <StatusBar translucent backgroundColor='transparent' style='light'/>
        <ImageBackground style={styles.background} source={require("../assets/dark3.jpg")}>
            <Pressable style={({pressed}) => [styles.backContainer, pressed && {transform: [{ scale: 0.9 }]}]} onPress={() => navigation.goBack()}>   
                <Text style={styles.backText}>Back</Text>
            </Pressable>    
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title1}>How does it work?</Text>
                    <Text style={styles.text}>
                        All you have to do is defeat your opponent. 
                        You can only hit or heal. 
                        Each time you act, your opponent hits you with
                        a random value. Keep that in mind!
                    </Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title1}>How to play?</Text>
                    <Text style={styles.text}>
                        Press "HIT" to lower your oppontnt's health. 
                    </Text>
                    <Text style={styles.text2}>
                        Press "HEAL" to recover some health.
                    </Text>
                    
                </View>
            </View>
        </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        top: 70,

    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    background: {
        flex: 1,
        
    },
    title1: {
        textAlign: "center",
        fontSize: 23,
        color:"white"
    },
    
    backContainer: {
        width: 60,
        top: 30,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20,
        
    },
    backText: {
        color: "white",
        fontSize: 22,
    },
    text: {
        textAlign: "center",
        width: 300,
        top: 40,
        color: "white",
        fontSize: 15,
    },
    text2: {
        textAlign: "center",
        width: 300,
        top: 40,
        color: "white",
        fontSize: 15,
        top: 55,
    }
  });

export default HowToPlay;
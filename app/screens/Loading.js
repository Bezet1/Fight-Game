import React from 'react';
import { View, Image, Text, StyleSheet} from 'react-native';

function Loading(props) {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/bezet.png")}/>           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    image: {
        resizeMode: "center",
        width: 200,

    }
})



export default Loading;
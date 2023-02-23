import {React} from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

function Menu(props) {
    return (      
        <View style={styles.menuContainer}>
            <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.9)",}]} onPress={props.goMenu}>
                <Text style={styles.text}>MENU</Text>
            </Pressable>
            <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.9)",}]} onPress={props.restartPressed}>
                <Text style={styles.text}>RESTART</Text>
            </Pressable>
            <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], backgroundColor: "rgba(37, 37, 64, 0.9)",}]} onPress={props.close}>
                <Text style={styles.text}>RETURN</Text>
            </Pressable>
        </View>  
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        backgroundColor: "rgba(255,255,255, 0.7)",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingVertical: 20,
    },
    buttons: {
        backgroundColor: "rgba(70, 70, 120, 1)",
        width: 200,
        height: 70,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "rgb(30,30,30)",
        elevation: 40,
        shadowColor: '#000000',
        marginHorizontal: 40,
        marginVertical: 20
    },
    
    text: {
        fontSize: 20,
        fontWeight: "400",
        fontFamily: "Buttons",
        color: "white"
    },
    menuButton:{  
        marginLeft: 20,
        top: 40,
        height: 50,
        width: 50,    
    }
})

export default Menu;
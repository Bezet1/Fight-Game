import {React} from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

function Menu(props) {

    function menuPressed(){
        props.goMenu();
        props.playClick();
    }

    function restart(){
        props.restartPressed();
        props.playClick();
    }

    function close(){
        props.close();
        props.playClick();
    }

    return (      
        <View style={styles.menuContainer}>
            <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], 
            backgroundColor: "rgba(37, 37, 64, 0.9)",}]} onPress={menuPressed}>
                <Text style={styles.text}>MENU</Text>
            </Pressable>
            <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], 
            backgroundColor: "rgba(37, 37, 64, 0.9)",}]} onPress={restart}>
                <Text style={styles.text}>RESTART</Text>
            </Pressable>
            <Pressable style={({pressed}) => [styles.buttons, pressed && {transform: [{ scale: 0.9 }], 
            backgroundColor: "rgba(37, 37, 64, 0.9)",}]} onPress={close}>
                <Text style={styles.text}>RETURN</Text>
            </Pressable>
        </View>  
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        backgroundColor: "rgba(255,255,255, 0.9)",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingVertical: 20,
        height: 350,
        width: 260
        
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
})

export default Menu;
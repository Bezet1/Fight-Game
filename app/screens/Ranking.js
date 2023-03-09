import {React, useEffect, useRef, useState} from 'react';
import {View, Text, Pressable, StyleSheet, ImageBackground, Dimensions, FlatList} from 'react-native';
import * as SQLite from 'expo-sqlite'

function Ranking({navigation}) {
    const screenWidth= useRef( Dimensions.get('window').width);
    const [difficulty, setDificulty] = useState({easy: true, hard: false});
    const [isRankingLoading, setIsRankingLoading] = useState(true);
    const [rankingEasy, setRankingEasy] = useState([]);
    const [rankingHard, setRankingHard] = useState([]);

    const db = SQLite.openDatabase('database0.db');

    useEffect(() => {
        fetchData();
      }, []);

    function fetchData() {
       
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM rankingEasy',
            [],
            (_, { rows }) => {
              setRankingEasy(rows._array);
            },
            (txObj, error) => {
              // error callback
              console.log('Error:', error);
            }
          );
        });
    
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM rankingHard',
            [],
            (_, { rows }) => {
              setRankingHard(rows._array);
            },
            (txObj, error) => {
              // error callback
              console.log('Error:', error);
            }
          );
        });

        setIsRankingLoading(false);
    }

    
    function showRanking() {
        if(isRankingLoading){
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
        else if (difficulty.easy) {
            return (
              <FlatList
                data={rankingEasy}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.elementsRow}>
                    <View style={styles.elementLeft}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={styles.elementMid}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={styles.elementRight}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                        {item.id}
                      </Text>
                    </View>
                  </View>
                )}
              />
            );
        }
        else if(difficulty.hard){
            return (
                <FlatList
                  data={rankingHard}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View key={item.id} style={styles.elementsRow}>
                      <View style={styles.elementLeft}>
                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.elementMid}>
                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.elementRight}>
                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                          {item.id}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              );
          }
    }   
    
    function goBack(){
        navigation.navigate("Homescreen");
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
                    <View style={styles.titlesContainels}>
                        <Text style={styles.titleText}>Name</Text>
                        <Text style={styles.titleText}>Time</Text>
                        <Text style={styles.titleText}>Score</Text>
                    </View>
                    <View style={styles.elementsContainer}>
                        {showRanking()}
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
    elementsContainer:{
        justifyContent: 'center',
    },
    elementsRow:{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
    },
    elementLeft:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    elementMid:{
        flex: 0.4,
        justifyContent: 'center',
        alignItems:'center',
        
        borderColor: 'rgba(255, 255, 255, 0.5)'
    },
    elementRight:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    elementText:{
        color: "white",
        fontSize: 15,
        fontFamily: "Buttons",
        textAlign:"center",
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
    titlesContainels:{
      height: 50,
      flexDirection: 'row',
      justifyContent: "space-evenly",
      alignItems: 'center',
    },
    titleText:{
        color: "white",
        fontSize: 20,
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
    loadingText: {
        color: "white",
        fontSize: 30,
        fontFamily: "Buttons",
        textAlign:"center",
    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      id: {
        fontWeight: 'bold',
        color: 'white'
    },
    name: {
        color: 'white',
        flex: 1,
      },
})

export default Ranking;
import {React, useEffect, useRef, useState} from 'react';
import {View, Text, Pressable, StyleSheet, ImageBackground, Dimensions, FlatList} from 'react-native';
import * as SQLite from 'expo-sqlite'

function Ranking({navigation}) {
    const screenWidth= useRef( Dimensions.get('window').width);
    const [difficulty, setDificulty] = useState({easy: true, hard: false});
    const [isRankingLoading, setIsRankingLoading] = useState(true);
    const [rankingEasy, setRankingEasy] = useState([]);
    const [rankingHard, setRankingHard] = useState([]);
    const [isEmpty, setIsEmpty] = useState({easy: true, hard: true});

    const db = SQLite.openDatabase('database10.db');

    useEffect(() => {
        fetchData();
      }, []);

    //get database tables to states
    function fetchData() {
       
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM rankingEasy ORDER BY id DESC',
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
            'SELECT * FROM rankingEasy ORDER BY id DESC',
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
      
      function checkIfEmpty(ranking, diffculty){
        if(ranking.length === 0){
          setIsEmpty((obj)=> ({...obj, [diffculty]: true}));
        }
        else{
          setIsEmpty((obj)=> ({...obj, [diffculty]: false}));
        }
      }
      useEffect(()=> {
      checkIfEmpty(rankingEasy, 'easy');
      checkIfEmpty(rankingHard, 'hard');

    }, [rankingEasy, rankingHard])
    
    function showRanking() {
        if(isRankingLoading){
            return (
              <View style={{position: 'absolute', alignSelf: 'center', top: '50%', width: '40%'}}>
                <Text style={styles.noRecords} adjustsFontSizeToFit={true} numberOfLines={1}  >Loading...</Text>
              </View>
            )
        }
        else if (difficulty.easy) {
          if(isEmpty.easy){
            return(
              noRecords()
            )
          }
          else{
            return (
              rankingList(rankingEasy)
                );
              }
        }
        else if(difficulty.hard){
          if(isEmpty.hard){
            return(
              noRecords()
            )
          }
          else{
            return (
                rankingList(rankingHard)
              );
          }
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

    function noRecords() {
      return(
        <View style={{position: 'absolute', alignSelf: 'center', top: '50%', width: '40%'}}>
            <Text style={styles.noRecords} adjustsFontSizeToFit={true} numberOfLines={1}  >No records</Text>
        </View>
      )
    }

    function rankingList(ranking){
      return(
        <FlatList
        data={ranking}
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
                {item.score}
              </Text>
            </View>
            <View style={styles.elementRight}>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.elementText}>
                {item.time}
              </Text>
            </View>
          </View>
        )}
        />
      )
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
                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.titleText}>Name</Text>
                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.titleText}>Score</Text>
                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.titleText}>Time</Text>
                    </View>
                        {showRanking()}
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
    noRecords:{
      color: "rgba(255,255,255, 0.7)",
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
})

export default Ranking;
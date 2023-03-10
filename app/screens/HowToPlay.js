import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect} from 'react';

function HowToPlay(props) {
    const db = SQLite.openDatabase('database10.db');
    const [isLoading, setIsLoading] = useState(false);
    const [names, setNames] = useState([]);
    const [currentName, setCurrentName] = useState(undefined)

    function fetchNames() {
      setIsLoading(true);
  
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM rankingEasy',
          [],
          (_, { rows }) => {
            setNames(rows._array);
          },
          (txObj, error) => {
            // error callback
            console.log('Error:', error);
          }
        );
      });
  
      setIsLoading(false);
    }

    useEffect(() => {
      fetchNames();
    }, []);

    function addName(){
      
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO rankingEasy (name) VALUES (?)',
          [currentName],
          (txObj, resultSet) => {
            // success callback
            console.log('Correct added', resultSet.rowsAffected);
          },
          (txObj, error) => {
            // error callback
            console.log('Error:', error);
          }
        );
      });

      fetchNames();
    }

    function showNames() {
      return names.map(name => (
        <View key={name.id} style={styles.row}>
          <Text style={styles.id}>{name.id}</Text>
          <Text style={styles.name}>{name.name}</Text>
        </View>
      ));
    }

    if(isLoading){
        return(
            <View style={styles.container}>
                <Text>Loading names...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TextInput value={currentName} onChangeText={setCurrentName} placeholder={"name"} />
            <Button title={"add name"} onPress={addName} />
            <View style={{alignItems: 'center', justifyContent: 'center',}}>
            {showNames()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,

    },
    id: {
      fontWeight: 'bold',
      marginRight: 10,
    },
    name: {
      flex: 1,
    },
})

export default HowToPlay;

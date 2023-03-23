import { React, useEffect, useRef, useState } from 'react';
import Homescreen from './app/screens/Homescreen';
import Game from './app/screens/Game'
import EnemyRound from './app/screens/EnemyRound';
import Ranking from './app/screens/Ranking';
import { MusicContext } from './app/assets/modules/MusicContext';
import {loadMusic} from './app/assets/modules/SoundFunctions'
import { Audio } from 'expo-av';
import * as SQLite from 'expo-sqlite';
import { createTable } from './app/assets/modules/sqlFunctions';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

export default function App() {

  const music = useRef(new Audio.Sound());


  const [contextObj, setContextObj] = useState({ref: music.current, isMusic: true, click: null, 
    win: null, loose: null, db: SQLite.openDatabase('database12.db'), oppPicture: undefined, oppPictureType: ""});
  
  //unload sounds
  useEffect(() => {
    return () => {

      if(contextObj.click){
        contextObj.click.unloadAsync();
      }

      if(contextObj.win){
            contextObj.win.unloadAsync();
          }

      if(contextObj.loose){
            contextObj.loose.unloadAsync();
          }
    }  

  }, [contextObj.click, contextObj.win, contextObj.loose]);

  useEffect(() => {

    createTable(contextObj.db, "rankingEasy");
    createTable(contextObj.db, "rankingHard");
    
    loadMusic(contextObj.ref);

    async function prepare() {
        await SplashScreen.preventAutoHideAsync();
    }
    prepare();
    
  }, []);

  //set fonts
  const[fontIsLoaded] = useFonts({
    "Game": require("./app/assets/fonts/Silkscreen-Regular.ttf"),
    "Buttons": require("./app/assets/fonts/SignikaNegative-Bold.ttf")
  });
  
  //check fonts
  if(!fontIsLoaded){
    return undefined;
  } 
  else 
  {
    SplashScreen.hideAsync();
  }

  return (
    <NavigationContainer>
      <MusicContext.Provider value={{contextObj, setContextObj}}>
        <Stack.Navigator>
          <Stack.Screen name="Homescreen" component={Homescreen} options={{headerShown: false}}/>
          <Stack.Screen name="Ranking" component={Ranking} options={{headerShown: false,animation: 'slide_from_left'}}/>
          <Stack.Screen name="Game" component={Game} options={{headerShown: false}}/>
          <Stack.Screen name="EnemyRound" component={EnemyRound} options={{headerShown: false, animation: 'slide_from_bottom'} } />
        </Stack.Navigator>
      </MusicContext.Provider>
    </NavigationContainer>
  );
}

import { useEffect } from 'react';
import Homescreen from './app/screens/Homescreen';
import Game from './app/screens/Game'
import EnemyRound from './app/screens/EnemyRound';
import Ranking from './app/screens/Ranking';
import HowToPlay from './app/screens/HowToPlay';

import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  //set fonts
  const[fontIsLoaded] = useFonts({
    "Game": require("./app/assets/fonts/Silkscreen-Regular.ttf"),
    "Buttons": require("./app/assets/fonts/SignikaNegative-Bold.ttf")
  });
  
  useEffect(() => {
    async function prepare() {
        await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  
  }, []);
  
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
      <Stack.Navigator>
        <Stack.Screen name="Homescreen" component={Homescreen} options={{headerShown: false}}/>
        <Stack.Screen name="Ranking" component={Ranking} options={{headerShown: false}}/>
        <Stack.Screen name="howtoplay" component={HowToPlay} options={{headerShown: false}}/>
        <Stack.Screen name="Game" component={Game} options={{headerShown: false}}/>
        <Stack.Screen name="EnemyRound" component={EnemyRound} options={{headerShown: false, animation: 'slide_from_bottom'} } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

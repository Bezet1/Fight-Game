import { Audio } from 'expo-av';

export async function playClick(setSound) {
  const { sound } = await Audio.Sound.createAsync( require('../sounds/click.mp3')
  );
  setSound((obj)=> ({...obj, click: sound}));
  await sound.playAsync();
}

export async function playWin(setSound) {
  const { sound } = await Audio.Sound.createAsync( require('../sounds/win.mp3'));
  setSound((obj)=> ({...obj, win: sound}));
  await sound.playAsync();
}

export async function playLoose(setSound) {
  const { sound } = await Audio.Sound.createAsync( require('../sounds/loose.mp3'));
  setSound((obj)=> ({...obj, loose: sound}));
  await sound.playAsync();
}

export async function playMusic (music){
      try {
        const result = await music.getStatusAsync();
        if (result.isLoaded) {
          if (result.isPlaying === false) {
            music.playAsync();
          }
        }
      } catch (error) {}
    };
  
export async function pauseMusic(music) {
  try {
    const result = await music.getStatusAsync();
    if (result.isLoaded) {
      if (result.isPlaying === true) {
        music.pauseAsync();
      }
    }
  } catch (error) {}
  };

export async function loadMusic (music) {
  const checkLoading = await music.getStatusAsync();
  if (checkLoading.isLoaded === false) {
    try {
      const result = await music.loadAsync(require('../sounds/menuLoop.mp3'), {}, true);
      if (result.isLoaded === false) {
        console.log('Error in Loading Audio');
      }
      else{
        playMusic(music);
        music.setIsLoopingAsync(true);
      }
    } catch (error) {
        console.log(error);
      }
    } 
};

 export async function toggleMusic(music, isMusic){
  isMusic ? pauseMusic(music) : playMusic(music);
}

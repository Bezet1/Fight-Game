# Fight Game

#### Description:

A mini mobile game centered around fighting has been developed using React Native on the Expo platform, an open-source tool that enables the creation of mobile applications for both iOS and Android operating systems. The game utilizes various libraries such as expo-av, expo-sqlite, react-navigation, expo-font, and expo-splash-screen to enhance its functionalities. To move between screens, the application uses the stack navigator and contains numerous animations implemented using the Animated API. The global background soundtrack is played using the createContext API, which enables the playback to be controlled from different screens. Other sounds are unloaded after each play. The ranking screen of the application uses the expo-sqlite library to create a local database that enables the tracking and visualization of all the records.

The application is organized into different folders. The assets folder contains customized fonts implemented using expo-font, images, and sounds. The modules folder includes movable components implemented using PanResponder, a music context that allows for the use of the global context, and two files containing sound and SQL functions. The app folder, in addition to the assets folder, contains a folder with all the screens. Most of the screens use the navigator, while some of them are modals that appear when certain conditions are met, such as the lose or win screen. The application also includes customized components such as menus and timers.

The game allows the user to choose an avatar for both themselves and their opponent and customize their own name. There are two difficulty levels to choose from: easy and hard. Additionally, players can set the amount of health they wish to start with, with options of 30 or 50. These settings influence the duration of the game.

The game features a ranking system that records each win and ranks players by their best score, calculated as a percentage of their remaining health. Players can choose which ranking to view. The game is accompanied by music, which can be turned on or off. There are also sound effects and vibrations when buttons are pressed.

During gameplay, players can choose to attack their opponent or heal themselves. When players choose to attack, a new screen opens up where they must hit their opponent, who is moving across the screen. Each successful tap decreases their opponent's health. Once the time limit is up, the game returns to the main screen where the health is adjusted, and the opponent's turn starts. Players must avoid lines that move across the screen from top to bottom and from left to right by maneuvering through gaps. Failing to do so results in damage. Once the time limit is up, the game resumes.

When the opponent has attacked and decreased some of the player's health, the player can heal themselves. This is similar to attacking, but now the player must be quick. A med kit appears on the screen after a random time, and players must tap it before it disappears. If they manage to tap it twice in a row or more, they receive additional points for health.

While playing the game, players can open a menu that allows them to return to the home screen, restart the game, or go back. The game continues until one player's health reaches zero, at which point a win or lose screen appears, depending on who won. If the player wins, their new record is added to the ranking system. The record includes their name, score, and duration of the game.

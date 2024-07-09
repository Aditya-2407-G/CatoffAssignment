
# Assignment

 A React Native application developed with Expo and Appwrite.

## Features

- Authentication using appwrite auth
- Game Management:
- Add Games, View Games, Your Created Games, Your Challenges 
- Pedometer to track steps 

## APK LINK

- https://drive.google.com/drive/folders/1u9ZpZwagOsBf65LUsFbhXIv-xyMw9sq1?usp=drive_link


## Usage/Examples

- Register or Log in: Create an account or log in to access the app.
- View the current challenges going on
- Join a challenge of you choice
- navigate to the challenge using the join challenge button 
- Create a new challenge of you choice

## Architecture

- Login and Signup using Appwrite 
- Logged in user can change their password
- View Games - View all the games created by the users and a user can select a game and join that game
- Add Game - User can add a game giving information like - name of game, type of game, description, Image and date of start and finish
- Your Created Games - user can see the games that he has created
- Your Challenges - User can see the games that he is a part of
- Pedometer game - User starts a pedometer tracker when he starts a challenge 


## Installation

1. Clone the repository:

```bash
  git clone https://github.com/Aditya-2407-G/CatoffAssignment.git
  cd CatoffAssignment
```
2. Install dependencies:

```bash
 npm install
```
3. Setup Appwrite env

- Make a .env file in root directory

- From appwrite get all these
  
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PLATFORM=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_STORAGE_ID=
EXPO_PUBLIC_APPWRITE_GAME_COLLECTION_ID=



   

5. Start the application:

```bash
 npm start
```

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCurrentUser, joinGame } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Loader } from '@/components/Loader'
import { InfoItem } from '@/components/InfoItem';

const GameDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { game } = route.params;

  const [joining, setJoining] = useState(false);
  const [currentGame, setCurrentGame] = useState(game);

  const handleJoinGame = async () => {
    setJoining(true);
    try {
      const currentAccount = await getCurrentUser();
      const userId = currentAccount?.userDocument.$id;
      const updatedGame = await joinGame(game.$id, userId);
      Alert.alert("Success", "Game joined successfully.");
      console.log("updateGame", updatedGame);
      
      // Update the currentGame state with the new data
      setCurrentGame((prevGame: { participants: any; }) => ({
        ...prevGame,
        participants: [...prevGame.participants, userId]
      }));
    } catch (error) {
      console.log("error joining game", error);
      Alert.alert("Hey!", "You already joined the game.");
    } finally {
      setJoining(false);
    }
  };

  if(joining) {
    return <Loader isLoading={true}/>
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity
          className="flex-row items-center p-2"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text className="text-lg text-blue-500 ml-1">Back to Games</Text>
        </TouchableOpacity>
        
        <View className="flex-1 bg-white rounded-2xl m-4 p-4 shadow-md">
          {currentGame.image && (
            <Image
              source={{ uri: currentGame.image || 'https://via.placeholder.com/300' }}
              className="w-full h-48 rounded-lg mb-6"
            />
          )}
          <Text className="text-3xl font-bold mb-2 text-gray-800">{currentGame.title}</Text>
          <Text className="text-base mb-5 text-gray-600 leading-6">{currentGame.description}</Text>
          
          <View className="mb-5">
            <InfoItem icon="game-controller" label="Type" value={currentGame.type} />
            <InfoItem icon="calendar" label="Start" value={new Date(currentGame.startDate).toLocaleDateString()} />
            <InfoItem icon="calendar" label="End" value={new Date(currentGame.endDate).toLocaleDateString()} />
            <InfoItem icon="people" label="Players" value={currentGame.participants.length.toString()} />
          </View>
          
          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-lg items-center mt-2"
            onPress={handleJoinGame}
          >
            <Text className="text-white text-lg font-bold">Join Game</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameDetailsScreen;
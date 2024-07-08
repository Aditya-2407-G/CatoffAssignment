import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { getGames } from '@/lib/appwrite';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Loader } from '@/components/Loader';

interface Game {
  $id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  participants: string[];
  userDetails: string;
  image: string;
}

const GameFeedScreen = () => {
  const navigation = useNavigation();
  const [gamesByType, setGamesByType] = useState<Record<string, Game[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      const fetchedGames = await getGames(0, 50);
      const groupedGames = fetchedGames.documents.reduce((acc, game) => {
        if (!acc[game.type]) acc[game.type] = [];
        //@ts-ignore
        acc[game.type].push(game);
        return acc;
      }, {} as Record<string, Game[]>);
      setGamesByType(groupedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const renderGameTypeItem = useCallback(({ item: type }: { item: string }) => (
    <TouchableOpacity
      className="flex-1 m-1 p-5 bg-white rounded-xl items-center justify-center shadow-md"
      onPress={() => setSelectedType(type)}
    >
      <Text className="text-lg font-bold text-center text-gray-800">{type}</Text>
      <Text className="text-sm text-gray-600 mt-1">{gamesByType[type].length} games</Text>
    </TouchableOpacity>
  ), [gamesByType]);


  const renderGameItem = useCallback((item: Game) => (
    <View className="w-full bg-white rounded-3xl shadow-md overflow-hidden">
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/300' }}
        className="w-full h-48 object-contain"
      />
      <View className="p-10">
        <Text className="text-2xl font-bold mb-5 text-gray-800">{item.title}</Text>
        <Text className="text-base text-gray-600 mb-1">
          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
        </Text>
        <Text className="text-base text-gray-600 mb-3">
          <Ionicons name="people" size={16} color="#666" /> {item.participants.length} players
        </Text>
        <Button 
          mode="contained" 
          //@ts-ignore
          onPress={() => navigation.navigate('GameDetailScreen', { game: item })}
          className="mt-2"
        >
          View Details
        </Button>
      </View>
    </View>
  ), [navigation]);

  if (loading) {
     return <Loader isLoading={true} />;
  }

  if (selectedType) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={() => setSelectedType(null)}
        >
          <Ionicons name="arrow-back" size={24} color="#0000ff" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-center my-10 text-gray-800">{selectedType} </Text>
        
        <Swiper
          loop={false}
          showsPagination={true}
          paginationStyle={{ bottom: 10 }}
        >

          {gamesByType[selectedType].map((game) => renderGameItem(game))}

        </Swiper>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold text-center my-5 text-gray-800">Game Types</Text>
      <FlatList
        data={Object.keys(gamesByType)}
        renderItem={renderGameTypeItem}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

export default GameFeedScreen;
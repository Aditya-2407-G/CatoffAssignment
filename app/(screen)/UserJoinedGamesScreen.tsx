import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, SafeAreaView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { userCreatedGames, userJoinedGames } from '@/lib/appwrite';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '@/context/GlobalContextProvider';
import { Loader } from '@/components/Loader';

const UserJoinedGamesScreen = () => {
    const { user } = useGlobalContext();
    const [userGames, setUserGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserGames = async () => {
            try {
                const userId = user.userDocument.$id;
                const res = userJoinedGames(userId);
                const gameData = (await res).documents;
                setUserGames(gameData);
            } catch (error) {
                Alert.alert("Error fetching user-created games:");
            } finally {
                setLoading(false);
            }
        };
        fetchUserGames();
    }, []);

    const renderGameItem = ({ item }: any) => (
        <View className="m-2 p-5 bg-white rounded-lg shadow-md">
            <Text className="text-xl font-bold mb-2">{item.title}</Text>
            <Text className="text-sm text-gray-600 mb-1">Start: {new Date(item.startDate).toLocaleDateString()}</Text>
            <Text className="text-sm text-gray-600 mb-1">End: {new Date(item.endDate).toLocaleDateString()}</Text>
            <Text className="text-sm text-gray-600 mb-2">Players: {item.participants.length}</Text>
            <Image source={{ uri: item.image } || 'https://via.placeholder.com/300'} className="w-full h-52 rounded-lg mb-2 object-contain" />
{/* @ts-ignore */}
            <Button mode="contained" onPress={() => navigation.navigate('ChallengeDetail', { game: item })}>
                View Challenge
            </Button>
        </View>
    );

    if (loading) {
        return <Loader isLoading={true} />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-2">
            <Text className="text-2xl font-bold text-center my-5">Your Joined Challenges - {userGames.length}</Text>
            <FlatList
                data={userGames}
                renderItem={renderGameItem}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text className="text-center text-lg text-gray-500 mt-5">You haven't created any games yet.</Text>}
            />
        </SafeAreaView>
    );
};

export default UserJoinedGamesScreen;

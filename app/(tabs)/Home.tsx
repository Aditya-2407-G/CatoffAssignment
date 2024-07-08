import CustomButton from "@/components/CustomButton";
import { getCurrentUser } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Account } from "react-native-appwrite";

const Home = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchAccountData = async () => {
      const user = await getCurrentUser();
      if (user) {
        setName(user.currentAccount.name);

      }
    };

    fetchAccountData();
  }, []);

  const handleAddGame = () => {
    router.push("CreateGameScreen");
  };
  const handleGameFeed = () => {
    router.push("GameFeedScreen");
  }
  const handelViewCreatedGames = () => {
    router.push("UserCreatedGamesScreen");
  }
  const handleJoinedGames = () => {
    router.push("UserJoinedGamesScreen");
  }

  return (
    <SafeAreaView className="bg-primary h-full  flex justify-center p-4">
      <Text className="text-white text-2xl font-bold mb-5 text-center">
        Hello, {name}!
      </Text>

      <View className="mt-20">
        <CustomButton
          title="ViewGames"
          handlePress= {handleGameFeed}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />
        <CustomButton
          title="ADD GAME"
          handlePress= {handleAddGame}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />
        <CustomButton
          title="Your Created Games"
          handlePress= {handelViewCreatedGames}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />
        <CustomButton
          title="Your Challenges"
          handlePress= {handleJoinedGames}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />

      </View>
    </SafeAreaView>
  );
};

export default Home;

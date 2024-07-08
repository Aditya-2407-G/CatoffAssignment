import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ScreenLayout = () => {
    return (
        <>
            <StatusBar backgroundColor="#161622" style="light" />

            <Stack>

                <Stack.Screen
                    name="CreateGameScreen"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="GameDetailScreen"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="UserCreatedGamesScreen"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="GameFeedScreen"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="UserJoinedGamesScreen"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ChallengeDetail"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    );
};

export default ScreenLayout;

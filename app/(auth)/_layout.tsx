import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const AuthLayout = () => {
    
    return (
        <>
        <StatusBar backgroundColor="#161622" style="light" />

          <Stack>
            <Stack.Screen
              name="Signin"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Signup"
              options={{
                headerShown: false,
              }}
            />
          </Stack>


        </>
      );
}

export default AuthLayout
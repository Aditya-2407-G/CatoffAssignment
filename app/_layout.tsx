import { Stack } from "expo-router";
import GlobalContextProvider from "../context/GlobalContextProvider";

export default function RootLayout() {
  return (
    <GlobalContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="(screen)" options={{headerShown: false}} />
      </Stack>
    </GlobalContextProvider>
  );
}

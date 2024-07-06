import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalContextProvider"
import { HelloWave } from "@/components/HelloWave";

export default function Index() {

  const {isLoading, isLogged} = useGlobalContext();

  if(!isLoading && isLogged){
    return <Redirect href="/Home" />
  }
  return (
    <SafeAreaView className=" bg-primary h-full">
        <ScrollView contentContainerStyle= {{height: '100%'}}>

            <StatusBar backgroundColor="#161622" style="light" />


                <View className="flex items-center justify-center min-h-[85vh]">
            <HelloWave />
                    <Text className=" text-center text-white font-bold text-3xl p-10 mb-20">Test Assignent </Text>
                    <CustomButton title="Sign In" handlePress={() => router.push("/Signin")} containerStyles="w-full mb-10" textStyles={undefined} isLoading={undefined} />
                    <CustomButton title="Sign Up" handlePress={() => router.push("/Signup")} containerStyles="w-full" textStyles={undefined} isLoading={undefined} />
                </View>
                


        </ScrollView>
    </SafeAreaView>
  );
}

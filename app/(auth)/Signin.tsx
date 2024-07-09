import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { Signin, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalContextProvider";

const SignIn = () => {
  
  const { setUser, setIsLogged} = useGlobalContext();
  
  const [isSubmitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const submit = async () => {

    if(!form.email || !form.password){
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setSubmitting(true);
    
    try {

      await Signin(form.email, form.password);

      const result = await getCurrentUser();

      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "Logged in successfully");
      router.replace("/Home")
      
    } catch (error: any) {
      Alert.alert(error.message);
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center  min-h-[85vh] px-4 py-6">
          <Text className="text-3xl text-center font-semibold text-white mt-10 mb-5">
            Test Assignment
          </Text>
          <Text className="text-sm text-center font-semibold text-white mt-10 mb-5">
          email: user3@gmail.com
          </Text>
          <Text className="text-sm text-center font-semibold text-white">
          password: Testuser3
          </Text>
          <Text className="text-sm text-center font-semibold text-white">OR signup!</Text>

          <FormField
            title="Email"
            value={form.email}
            placeholder="Email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-8"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles={undefined}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/Signup"
              className="text-lg font-psemibold text-pink-300"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

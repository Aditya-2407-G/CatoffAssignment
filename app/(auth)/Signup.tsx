import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import {createUser} from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalContextProvider";



const Signup = () => {


  const {setUser, setIsLogged} = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);


  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });




  const submit = async () => {

    if(!form.username || !form.email || !form.password){
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setSubmitting(true);
    
    try {

      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      console.log(result);
      
      router.replace("/Home")
      
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView>
        <View className="w-full justify-center  min-h-[85vh] px-4 py-6">
          <Text className="text-3xl font-semibold text-white mt-10 mb-5 text-center">
            Medibit Awaits
          </Text>
          <Text className="text-3xl font-semibold text-white mb-5 text-center">Let's Get Started!</Text>

          <FormField
            title="Username"
            value={form.username}
            placeholder="Username"
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"

          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles={undefined}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/Signin"
              className="text-lg font-psemibold text-pink-300"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

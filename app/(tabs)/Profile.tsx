import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Button,
    Modal,
    PaperProvider,
    Portal,
    TextInput,
} from "react-native-paper";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { changePassword, getCurrentUser, siguOut } from "@/lib/appwrite";
import { router } from "expo-router";

const Profile = () => {

    const { user, setUser, setIsLogged } = useGlobalContext();
    const [visible, setVisible] = useState(false);
    const [oldpassword, setOldPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");



    const showModel = () => setVisible(true);
    const hideModel = () => {
        setVisible(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }


    const logout = async () => {
        await siguOut();
        setUser(null);
        setIsLogged(false);
        router.replace("/Signin");
    };

    const handlePasswordChange = async () => {
        if (!oldpassword || !newpassword || !confirmpassword) {
            alert("Please fill all fields");
            return;
        }
        if (newpassword !== confirmpassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await changePassword(newpassword, oldpassword);
            Alert.alert("Success", "Password changed successfully");
            hideModel();

        } catch (error) {
            Alert.alert("Error", "Password don't match!");
        }
    };


    useEffect(() => {
        getCurrentUser().then((res) => {
            setName(res?.currentAccount.name!);
            setEmail(res?.currentAccount.email!);

            if(res?.userDocument && res.userDocument.avatar) {
                setImage(res.userDocument.avatar);
            }
        })
    })

    return (
        <PaperProvider>
            <SafeAreaView className="flex-1 bg-primary p-4 ">

                <Text className="text-white text-center text-3xl font-bold mb-8">
                    Your Profile
                </Text>

                <View className="mt-10">

                    <View className="bg-gray-800 rounded-lg p-6 mb-8">

                        <Image
                            source={{ uri: image }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                alignSelf: "center",
                            }}
                        />
                        <Text className="text-white text-center text-xl font-bold mb-2">
                            {name}
                        </Text>
                        <Text className="text-gray-400 text-center text-lg">
                            {email}
                        </Text>
                    </View>


                    <Button
                        icon="account-edit"
                        mode="contained-tonal"
                        onPress={showModel}
                        className="mb-8 mt-10 p-2"
                        labelStyle={{ fontSize: 16 }}                        
                    >
                        Change Password
                    </Button>

                    <Button
                        icon="logout"
                        mode="contained-tonal"
                        onPress={logout}
                        className="p-2"
                    >
                        <Text>Logout</Text>
                    </Button>
                </View>

                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModel}
                        contentContainerStyle={{
                            backgroundColor: "#1E1E1E",
                            height: "70%",
                            width: "80%",
                            borderRadius: 20,
                            alignSelf: "center",
                        }}
                    >
                        <Text className="text-white text-2xl font-bold mb-10 text-center">
                            Change Password
                        </Text>
                        <View className="space-y-7 px-4">
                            <TextInput
                                placeholder="Current Password"
                                secureTextEntry
                                value={oldpassword}
                                onChangeText={setOldPassword}
                                className="bg-gray-800 rounded-lg "
                                textColor="white"
                                placeholderTextColor="#9CA3AF"
                            />
                            <TextInput
                                placeholder="New Password"
                                secureTextEntry
                                value={newpassword}
                                textColor="white"
                                onChangeText={setNewPassword}
                                className="bg-gray-800 text-white rounded-lg"
                                placeholderTextColor="#9CA3AF"
                            />
                            <TextInput
                                placeholder="Confirm Password"
                                secureTextEntry
                                value={confirmpassword}
                                textColor="white"
                                onChangeText={setConfirmPassword}
                                className="bg-gray-800 text-white rounded-lg"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handlePasswordChange}
                            className="bg-blue-500 py-2  rounded-lg m-10 active:bg-blue-600"
                        >
                            <Text className="text-white text-center text-lg font-bold">
                                Update Password
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={hideModel} className="mt-4">
                            <Text className="text-gray-400 text-center text-base">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </Modal>
                </Portal>
            </SafeAreaView>
        </PaperProvider>
    );
};

export default Profile;

import React, { useState } from "react";
import { View, Alert, TextInput, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "react-native-date-picker";
import { createGame, getCurrentUser, getGames } from "@/lib/appwrite";
import { pickImage } from "@/components/ImagePicker";
import { ImagePickerAsset } from "expo-image-picker";
import { Loader } from "@/components/Loader";
const CreateGameScreen = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [image, setImage] = useState<ImagePickerAsset | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleCreateGame = async () => {
        setLoading(true);

        try {
            if (!startDate || !endDate) {
                Alert.alert("Error", "Please select both start and end dates.");
                return;
            }

            const curUser = await getCurrentUser();
            const userID = curUser?.userDocument.$id

            const newGame = await createGame({
                title,
                description,
                type,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                participants: [userID],
                userDetails: userID,
                image: image
            });

            console.log(newGame);

            Alert.alert("Success", "Game created successfully.");
        } catch (error) {
            console.error("Error creating game:", error);
            Alert.alert("Error", "Failed to create game. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    const showStartDatePicker = () => setStartDatePickerVisible(true);
    const hideStartDatePicker = () => setStartDatePickerVisible(false);
    const showEndDatePicker = () => setEndDatePickerVisible(true);
    const hideEndDatePicker = () => setEndDatePickerVisible(false);

    const handleConfirmStartDate = (date: Date) => {
        setStartDate(date);
        hideStartDatePicker();
    };

    const handleConfirmEndDate = (date: Date) => {
        setEndDate(date);
        hideEndDatePicker();
    };

    if(loading) {
        return <Loader isLoading={true} />
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                <Text className="text-2xl font-bold mb-6">Challenge Details</Text>
                
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-1">Challenge Name</Text>
                    <TextInput
                        placeholder="Enter name"
                        value={title}
                        onChangeText={setTitle}
                        className="p-2 border border-gray-300 rounded"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-1">Challenge Type</Text>
                    <TextInput
                        placeholder="Select type"
                        value={type}
                        onChangeText={setType}
                        className="p-2 border border-gray-300 rounded"
                    />
                </View>

                <View className="flex-row justify-between mb-4">
                    <View className="w-[48%]">
                        <Text className="text-sm text-gray-600 mb-1">Start Date</Text>
                        <TouchableOpacity
                            onPress={showStartDatePicker}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <Text>{startDate ? startDate.toDateString() : "Select date"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-[48%]">
                        <Text className="text-sm text-gray-600 mb-1">End Date</Text>
                        <TouchableOpacity
                            onPress={showEndDatePicker}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <Text>{endDate ? endDate.toDateString() : "Select date"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-1">Description</Text>
                    <TextInput
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        className="p-2 border border-gray-300 rounded"
                    />
                </View>

                <Button 
                    onPress={async () => { setImage(await pickImage()) }}
                    mode="outlined" 
                    className="mb-4"
                >
                    Pick Image
                </Button>

                {image && (
                    <Image
                        source={{ uri: image?.uri }}
                        style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 16 }}
                        className="object-contain"
                    />
                )}
                

                <Button
                    icon="plus"
                    mode="contained"
                    onPress={handleCreateGame}
                    className="mt-5 p-2 bg-blue-500"
                >
                    Create Challenge
                </Button>


                <DatePicker
                    modal
                    open={startDatePickerVisible}
                    date={startDate || new Date()}
                    onConfirm={handleConfirmStartDate}
                    onCancel={hideStartDatePicker}
                />

                <DatePicker
                    modal
                    open={endDatePickerVisible}
                    date={endDate || new Date()}
                    onConfirm={handleConfirmEndDate}
                    onCancel={hideEndDatePicker}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateGameScreen;

import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const InfoItem = ({ icon, label, value }) => (
    <View className="flex-row items-center mb-3">
      <Ionicons name={icon} size={24} color="#007AFF" className="mr-2" />
      <View>
        <Text className="text-sm text-gray-500">{label}</Text>
        <Text className="text-base text-gray-700 font-medium">{value}</Text>
      </View>
    </View>
  );
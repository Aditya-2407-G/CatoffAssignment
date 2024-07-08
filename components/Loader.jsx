import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

export const Loader = ({ isLoading }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center w-full h-full bg-primary/90 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={"large"}
      />
    </View>
  );
};


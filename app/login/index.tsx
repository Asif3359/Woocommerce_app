// app/login/index.tsx
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Carousel slide data with different background images
const slides = [
  {
    id: "1",
    title: "Welcome to MyApp",
    description:
      "Discover amazing features and connect with people around the world",
    icon: "rocket",
    backgroundImage: require("@/assets/welcome/welcome_1.jpg"),
  },
  {
    id: "2",
    title: "Stay Connected",
    description:
      "Never miss important updates and stay in touch with your community",
    icon: "chatbubbles",
    backgroundImage: require("@/assets/welcome/welcome_2.jpg"),
  },
  {
    id: "3",
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security",
    icon: "shield-checkmark",
    backgroundImage: require("@/assets/welcome/welcome_3.jpg"),
  },
];

export default function Login() {
  const { signInAsGuest } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleLogin = () => {
    router.replace("/login/login");
  };

  const handleSkip = async () => {
    await signInAsGuest();
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={{ width: screenWidth }} className="flex-1">
      <ImageBackground
        source={item.backgroundImage}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-1 bg-black/40 px-8 justify-center items-center">
          {/* Icon */}
          <View className="flex-row w-24 h-24 bg-white/20 rounded-3xl justify-center items-center mb-8 border border-white/30">
            <Ionicons name={item.icon as any} size={48} color="white" />
          </View>

          {/* Title */}
          <Text className="text-4xl font-bold text-white text-center mb-4">
            {item.title}
          </Text>

          {/* Description */}
          <Text className="text-lg text-white/90 text-center leading-7">
            {item.description}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );

  const renderDotIndicator = () => {
    return (
      <View className="absolute bottom-60 left-0 right-0 flex-row justify-center items-center">
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: dotWidth,
                opacity,
              }}
              className="h-2 bg-white rounded-full mx-1"
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Dot Indicator */}
      {renderDotIndicator()}

      {/* Buttons Section */}
      <View className="absolute bottom-0 left-0 right-0 gap-4 pb-12 px-6">
        <TouchableOpacity
          className="bg-white py-5 rounded-2xl items-center shadow-lg shadow-black/50 active:bg-gray-100 active:scale-95"
          onPress={handleLogin}
        >
          <Text className="text-blue-600 text-lg font-semibold">
            Sign In to Your Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-5 rounded-2xl items-center border-2 border-white/50 active:bg-white/10 active:scale-95"
          onPress={handleSkip}
        >
          <Text className="text-white text-base font-medium">
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

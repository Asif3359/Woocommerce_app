import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

// Categories data
const CATEGORIES_DATA: CategoryItem[] = [
  { id: "1", name: "Electronics", icon: "phone-portrait", color: "#FF6B8B" },
  { id: "2", name: "Fashion", icon: "shirt", color: "#7E6BC9" },
  { id: "3", name: "Home", icon: "home", color: "#4A90E2" },
  { id: "4", name: "Sports", icon: "basketball", color: "#50C878" },
  { id: "5", name: "Books", icon: "book", color: "#FFA500" },
  { id: "6", name: "Beauty", icon: "flower", color: "#FF69B4" },
  { id: "7", name: "Toys", icon: "game-controller", color: "#9370DB" },
  { id: "8", name: "Food", icon: "fast-food", color: "#20B2AA" },
  { id: "9", name: "Automotive", icon: "car-sport", color: "#FF4500" },
  { id: "10", name: "Garden", icon: "leaf", color: "#32CD32" },
  { id: "11", name: "Music", icon: "musical-notes", color: "#8A2BE2" },
  { id: "12", name: "Pet Supplies", icon: "paw", color: "#D2691E" },
  { id: "13", name: "Office", icon: "briefcase", color: "#4682B4" },
  { id: "14", name: "Baby", icon: "heart", color: "#FFB6C1" },
  { id: "15", name: "Health", icon: "fitness", color: "#00CED1" },
  { id: "16", name: "Grocery", icon: "cart", color: "#FF8C00" },
];

export default function CategoriesScreen() {
  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <View className="w-1/3 mb-5 px-2">
      {/* Card Container */}
      <TouchableOpacity
        className="bg-white rounded-2xl px-4 py-6 w-full items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
        onPress={() => {
          // Navigate to category details or products
          console.log(`Selected category: ${item.name}`);
        }}
        activeOpacity={0.7}
      >
        {/* Icon Container */}
        <View
          className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
          style={{ backgroundColor: item.color }}
        >
          <Ionicons name={item.icon} size={28} color="white" />
        </View>

        {/* Category Name */}
        <Text
          className="text-xs text-center text-gray-800 font-semibold"
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header with Background */}
        <View className="bg-white px-5 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3"
              >
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">
                  All Categories
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Browse by category
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center ml-2">
              <Ionicons name="filter" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Decorative Background Elements */}
        <View
          className="absolute top-20 right-0 w-40 h-40 bg-blue-100 rounded-full opacity-20"
          style={{ transform: [{ scale: 1.5 }] }}
        />
        <View
          className="absolute bottom-20 left-0 w-40 h-40 bg-purple-100 rounded-full opacity-20"
          style={{ transform: [{ scale: 1.5 }] }}
        />

        {/* Categories Grid */}
        <View className=" flex-1 bg-gray-50">
          <FlatList
            data={CATEGORIES_DATA}
            renderItem={renderCategoryItem}
            keyExtractor={(item: CategoryItem) => item.id}
            numColumns={3}
            contentContainerStyle={{
              padding: 16,
              paddingTop: 12,
              paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

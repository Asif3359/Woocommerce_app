import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const base_api = "http://10.0.2.2:3000/api";
const categories_end_point = "/products/category";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${base_api}${categories_end_point}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const categoriesData = await response.json();

      // Transform API data to match CategoryItem interface
      const transformedCategories: CategoryItem[] = categoriesData.map(
        (category: any) => ({
          id: category.id || category._id,
          name: category.name,
          icon: category.icon as keyof typeof Ionicons.glyphMap,
          color: category.color,
        })
      );

      setCategories(transformedCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
      console.error("Error loading categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
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
        onPress={() => router.push(`/categories/${item.name}`)}
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

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">Loading categories...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
                  {categories.length > 0 ? `${categories.length} categories` : "Browse by category"}
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

        {/* Categories Grid or Error Message */}
        <View className="flex-1 bg-gray-50">
          {error && categories.length === 0 ? (
            <View className="flex-1 justify-center items-center px-8">
              <Text className="text-lg text-red-500 mb-4 text-center">
                Error: {error}
              </Text>
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-full"
                onPress={loadCategories}
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={categories}
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
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

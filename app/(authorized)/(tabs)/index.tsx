import { useAuth } from "@/providers/AuthProvider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
interface DiscountItem {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

// Mock data with proper typing
const DISCOUNT_DATA: DiscountItem[] = [
  {
    id: "1",
    title: "20% OFF",
    subtitle: "On your first purchase",
    backgroundImage:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800",
  },
  {
    id: "2",
    title: "Free Shipping",
    subtitle: "On orders over $50",
    backgroundImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
  },
  {
    id: "3",
    title: "Buy 1 Get 1",
    subtitle: "Limited time offer",
    backgroundImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
  },
];

const CATEGORIES_DATA: CategoryItem[] = [
  { id: "1", name: "Electronics", icon: "phone-portrait", color: "#FF6B8B" },
  { id: "2", name: "Fashion", icon: "shirt", color: "#7E6BC9" },
  { id: "3", name: "Home", icon: "home", color: "#4A90E2" },
  { id: "4", name: "Sports", icon: "basketball", color: "#50C878" },
  { id: "5", name: "Books", icon: "book", color: "#FFA500" },
  { id: "6", name: "Beauty", icon: "flower", color: "#FF69B4" },
  { id: "7", name: "Toys", icon: "game-controller", color: "#9370DB" },
  { id: "8", name: "Food", icon: "fast-food", color: "#20B2AA" },
];

const FEATURED_PRODUCTS: ProductItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: "$99.99",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
  },
  {
    id: "3",
    name: "Camera Lens",
    price: "$299.99",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300",
  },
  {
    id: "4",
    name: "Gaming Mouse",
    price: "$49.99",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300",
  },
  {
    id: "5",
    name: "Laptop",
    price: "$899.99",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
  },
  {
    id: "6",
    name: "Sunglasses",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300",
  },
  {
    id: "7",
    name: "Running Shoes",
    price: "$129.99",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
  },
  {
    id: "8",
    name: "Backpack",
    price: "$59.99",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
  },
  {
    id: "9",
    name: "Coffee Maker",
    price: "$149.99",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300",
  },
  {
    id: "10",
    name: "Desk Lamp",
    price: "$39.99",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300",
  },
  {
    id: "11",
    name: "Bluetooth Speaker",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300",
  },
  {
    id: "12",
    name: "Yoga Mat",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300",
  },
  {
    id: "13",
    name: "Water Bottle",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300",
  },
  {
    id: "14",
    name: "Phone Case",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300",
  },
  {
    id: "15",
    name: "Keyboard",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300",
  },
  {
    id: "16",
    name: "Monitor",
    price: "$399.99",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300",
  },
];

export default function Home() {
  const { signOut, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] =
    useState<ProductItem[]>(FEATURED_PRODUCTS);

  // Fixed render functions with proper typing
  const renderDiscountItem = ({ item }: { item: DiscountItem }) => (
    <View className="mx-4 rounded-2xl overflow-hidden h-60 w-96">
      <Image
        source={{ uri: item.backgroundImage }}
        className="w-full h-full absolute"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/50 p-6 justify-center">
        <Text className="text-white text-3xl font-bold">{item.title}</Text>
        <Text className="text-white text-lg mt-2">{item.subtitle}</Text>
        <TouchableOpacity className="bg-white px-6 py-3 rounded-full mt-4 self-start">
          <Text className="font-semibold text-gray-900">Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <View className="items-center mr-4 w-20">
      <TouchableOpacity
        className="w-16 h-16 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: item.color }}
      >
        <Ionicons name={item.icon} size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-xs text-center text-gray-700" numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <View className="bg-white rounded-xl p-3 mr-4 shadow-sm border border-gray-100 w-40">
      <Image
        source={{ uri: item.image }}
        className="w-full h-32 rounded-lg mb-3"
        resizeMode="cover"
      />
      <Text
        className="font-medium text-gray-900 mb-1 text-sm"
        numberOfLines={2}
      >
        {item.name}
      </Text>
      <Text className="font-bold text-gray-900">{item.price}</Text>
    </View>
  );

  const renderProductGridItem = ({ item }: { item: ProductItem }) => (
    <View className="w-1/2 mb-3 px-1">
      <TouchableOpacity
        className="bg-white rounded-xl relative"
        activeOpacity={0.7}
        onPress={() => router.push(`/products/${item.id}`)}
      >
        {/* Discount Badge */}
        <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full z-10">
          <Text className="text-white text-xs font-bold">20% OFF</Text>
        </View>

        {/* Wishlist Icon */}
        <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full items-center justify-center z-10 shadow-sm">
          <Ionicons name="heart-outline" size={16} color="#666" />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          source={{ uri: item.image }}
          className="w-full h-32 rounded-t-xl"
          resizeMode="cover"
        />

        {/* Product Info */}
        <View className="p-3">
          <Text
            className="font-medium text-gray-900 mb-1 text-sm"
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="font-bold text-gray-900 text-base">
              {item.price}
            </Text>
            <TouchableOpacity className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name="cart-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header with Search */}
          <View className="px-6 pb-2 pt-2">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  Discover
                </Text>
                <Text className="text-gray-600">Find amazing products</Text>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="notifications-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                placeholder="Search products..."
                className="flex-1 ml-2 text-gray-900"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Discount Banner */}
          <View className="mt-2">
            <FlatList
              data={DISCOUNT_DATA}
              renderItem={renderDiscountItem}
              keyExtractor={(item: DiscountItem) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 6 }}
            />
          </View>

          {/* Categories Section */}
          <View className="mt-8">
            <View className="flex-row justify-between items-center px-4 mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Categories
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-2 bg-gray-100 rounded-full p-2"
                onPress={() => router.push("/categories")}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES_DATA}
              renderItem={renderCategoryItem}
              keyExtractor={(item: CategoryItem) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          {/* All Products - Grid Layout */}
          {/* All Products - Grid Layout with FlatList */}
          <View className="mt-8 px-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900 ">
                All Products
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-2 bg-gray-100 rounded-full p-2"
                onPress={() => router.push("/products")}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredProducts}
              renderItem={renderProductGridItem}
              keyExtractor={(item: ProductItem) => item.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 12 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

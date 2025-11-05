import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
interface ProductItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

// Extended product list
const ALL_PRODUCTS: ProductItem[] = [
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

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductItem[]>(ALL_PRODUCTS);

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
        {/* Header */}
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
                  All Products
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  {products.length} items available
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center ml-2">
              <Ionicons name="filter" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mt-4">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              placeholder="Search products..."
              className="flex-1 ml-2 text-gray-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Decorative Background Elements */}
        <View
          className="absolute top-32 right-0 w-40 h-40 bg-blue-100 rounded-full opacity-20"
          style={{ transform: [{ scale: 1.5 }] }}
        />
        <View
          className="absolute bottom-20 left-0 w-40 h-40 bg-purple-100 rounded-full opacity-20"
          style={{ transform: [{ scale: 1.5 }] }}
        />

        {/* Products Grid */}
        <View className="flex-1 bg-gray-50">
          <FlatList
            data={products}
            renderItem={renderProductGridItem}
            keyExtractor={(item: ProductItem) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 8 }}
            contentContainerStyle={{
              gap: 8,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
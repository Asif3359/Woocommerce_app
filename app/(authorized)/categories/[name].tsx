import { API_BASE_URL } from "@/config/api.config";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  originalPrice?: string;
  rating?: number;
  inStock?: boolean;
}

interface CategoryProductsResponse {
  category: string;
  products: any[];
  count: number;
}


export default function CategoryProductsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/products/category/${name}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data: CategoryProductsResponse = await response.json();

      // Transform API data to match ProductItem interface
      const transformedProducts: ProductItem[] = data.products.map(
        (product: any) => ({
          id: product._id || product.id,
          name: product.name,
          price: `$${product.price}`,
          image: product.image,
          originalPrice: product.originalPrice
            ? `$${product.originalPrice}`
            : undefined,
          rating: product.rating,
          inStock: product.inStock,
        })
      );

      setProducts(transformedProducts);
      setCategoryName(data.category);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error loading category products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      loadCategoryProducts();
    }
  }, [name]);

  const renderProductGridItem = ({ item }: { item: ProductItem }) => {
    // Calculate discount percentage if original price exists
    const calculateDiscount = () => {
      if (!item.originalPrice) return null;

      const original = parseFloat(item.originalPrice.replace("$", ""));
      const current = parseFloat(item.price.replace("$", ""));

      // Only show discount if original price is higher than current price
      if (original > current) {
        const discountPercentage = Math.round(
          ((original - current) / original) * 100
        );
        return discountPercentage;
      }
      return null;
    };

    const discount = calculateDiscount();

    return (
      <View className="w-1/2 mb-3 px-1">
        <TouchableOpacity
          className="bg-white rounded-xl relative"
          activeOpacity={0.7}
          onPress={() => router.push(`/products/${item.id}`)}
        >
          {/* Discount Badge - Only show if there's a valid discount */}
          {discount && discount > 0 && (
            <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full z-10">
              <Text className="text-white text-xs font-bold">
                {discount}% OFF
              </Text>
            </View>
          )}

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
              <View>
                <Text className="font-bold text-gray-900 text-base">
                  {item.price}
                </Text>
                {item.originalPrice && discount && discount > 0 && (
                  <Text className="text-xs text-gray-500 line-through">
                    {item.originalPrice}
                  </Text>
                )}
              </View>
              <TouchableOpacity className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="cart-outline" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">
            Loading {name} products...
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
                  {categoryName || name}
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

        {/* Products Grid or Error Message */}
        <View className="flex-1 bg-gray-50">
          {error && products.length === 0 ? (
            <View className="flex-1 justify-center items-center px-8">
              <Text className="text-lg text-red-500 mb-4 text-center">
                Error: {error}
              </Text>
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-full"
                onPress={loadCategoryProducts}
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 ? (
            <View className="flex-1 justify-center items-center px-8">
              <Ionicons name="basket-outline" size={64} color="#ccc" />
              <Text className="text-lg text-gray-500 mt-4 text-center">
                No products found in {categoryName || name}
              </Text>
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-full mt-4"
                onPress={() => router.back()}
              >
                <Text className="text-white font-semibold">Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
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
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


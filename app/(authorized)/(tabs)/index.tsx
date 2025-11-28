import { API_BASE_URL } from "@/config/api.config";
import { useCart } from "@/hooks/useCart";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import { ProductDetails } from "../products/[id]";

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
  originalPrice?: string;
  rating?: number;
  inStock?: boolean;
  quantity?: Quantity;
}

interface Quantity {
  amount: number;
  unit: string;
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


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = getAuth().currentUser;
  const { addToCart, isInCart, getProductQuantity, updateQuantity } = useCart(
    currentUser?.email || ""
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const productsData = await response.json();

      // Transform API data to match your ProductItem interface
      const transformedProducts: ProductItem[] = productsData.map(
        (product: any) => ({
          id: product._id || product.id,
          name: product.name,
          price: `$${product.price}`,
          image: product.image,
          // Add other fields if needed
          originalPrice: product.originalPrice
            ? `$${product.originalPrice}`
            : undefined,
          rating: product.rating,
          inStock: product.inStock,
          quantity: {
            amount: product.quantity?.amount || 0,
            unit: product.quantity?.unit || "",
          },
        })
      );

      setFeaturedProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error loading products:", err);

      // Fallback to static data if API fails
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/category`);

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
      console.error("Error loading categories:", err);
      // Keep empty array if API fails
      setCategories([]);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

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
        onPress={() => router.push(`/categories/${item.name}`)}
      >
        <Ionicons name={item.icon} size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-xs text-center text-gray-700" numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );

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

    const handleAddToCart = (
      productId: string,
      product: ProductDetails,
      quantity: number
    ) => {
      const success = addToCart(product, quantity);
      if (success) {
        // Show success message or feedback
        console.log(`Added ${quantity} ${product.name} to cart`);
      }
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
            {item.quantity && (
              <Text className="text-xs text-gray-500 mb-2">
                {item.quantity.amount} {item.quantity.unit}
              </Text>
            )}
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center gap-2">
                <Text className="font-bold text-gray-900 text-base">
                  {item.price}
                </Text>
                {item.originalPrice && discount && discount > 0 && (
                  <Text className="text-xs text-gray-500 line-through">
                    {item.originalPrice}
                  </Text>
                )}
              </View>
              <View className="flex-row items-center gap-2">
                {isInCart(item.id) ? (
                  <View className="flex-row items-center bg-gray-100 rounded-lg">
                    <TouchableOpacity
                      onPress={() => {
                        const currentCartQty = getProductQuantity(item.id);
                        updateQuantity(item.id, currentCartQty - 1);
                      }}
                      className="p-2"
                    >
                      <Ionicons name="remove" size={18} color="#4B5563" />
                    </TouchableOpacity>

                    <Text className="px-4 py-1 font-semibold text-gray-800">
                      {getProductQuantity(item.id)}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        const currentCartQty = getProductQuantity(item.id);
                        updateQuantity(item.id, currentCartQty + 1);
                      }}
                      className="p-2"
                    >
                      <Ionicons name="add" size={18} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      handleAddToCart(item.id, item as ProductDetails, 1)
                    }
                    className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                  >
                    <Ionicons name="cart-outline" size={16} color="green" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
              data={categories}
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
            {error && featuredProducts.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">Error: {error}</Text>
                <TouchableOpacity
                  className="bg-blue-500 px-6 py-3 rounded-full"
                  onPress={loadProducts}
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : loading ? (
              <Text className="text-lg text-gray-600">Loading products...</Text>
            ) : (
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
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

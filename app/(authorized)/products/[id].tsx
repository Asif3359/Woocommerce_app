import { useCart } from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
interface Quantity {
  amount: number;
  unit: string;

}
interface ProductDetails {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  features: string[];
  quantity: Quantity;
}

const base_api = "http://10.0.2.2:3000/api";

export default function ProductDetailsScreen() {
  const currentUser = getAuth().currentUser;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isInCart, getProductQuantity } = useCart(
    currentUser?.email || ""
  );

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${base_api}/products/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const productData = await response.json();

      // Transform API data to match ProductDetails interface
      const transformedProduct: ProductDetails = {
        id: productData._id || productData.id,
        name: productData.name,
        price: `$${productData.price}`,
        originalPrice: productData.originalPrice
          ? `$${productData.originalPrice}`
          : undefined,
        image: productData.image,
        description: productData.description || "No description available.",
        rating: productData.rating || 0,
        reviews: productData.reviews || 0,
        inStock: productData.inStock ?? true,
        category: productData.category || "General",
        features:
          Array.isArray(productData.features) && productData.features.length > 0
            ? productData.features
            : ["No features listed"],
        quantity: {
          amount: productData.quantity?.amount || 0,
          unit: productData.quantity?.unit || '',
        },
      };

      setProduct(transformedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
      console.error("Error loading product details:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProductDetails();
    }
  }, [id]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color="#FFA500"
        />
      );
    }
    return stars;
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice) return null;

    const original = parseFloat(product.originalPrice.replace("$", ""));
    const current = parseFloat(product.price.replace("$", ""));

    // Only show discount if original price is higher than current price
    if (original > current) {
      const discountPercentage = Math.round(
        ((original - current) / original) * 100
      );
      return discountPercentage;
    }
    return null;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const success = addToCart(product, quantity);
    if (success) {
      // Show success message or feedback
      console.log(`Added ${quantity} ${product.name} to cart`);
      // Optionally reset quantity
      // setQuantity(1);
    }
  };

  const productInCart = isInCart(product?.id || "");
  const currentQuantity = getProductQuantity(product?.id || "");

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">
            Loading product details...
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (error && !product) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 bg-white shadow-sm">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">
              Product Details
            </Text>
            <View className="w-10" />
          </View>
          <View className="flex-1 justify-center items-center px-8">
            <Text className="text-lg text-red-500 mb-4 text-center">
              Error: {error}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-full"
              onPress={loadProductDetails}
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!product) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">Product not found</Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-full mt-4"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const discount = calculateDiscount();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 bg-white shadow-sm">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            Product Details
          </Text>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#FF6B8B" : "#333"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Product Image */}
          <View className="relative">
            <Image
              source={{ uri: product.image }}
              className="w-full h-96"
              resizeMode="cover"
            />
            {discount && discount > 0 && (
              <View className="absolute top-4 left-4 bg-red-500 px-3 py-2 rounded-full">
                <Text className="text-white text-sm font-bold">
                  {discount}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* Product Info */}
          <View className="px-5 py-6">
            {/* Category Badge */}
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600 text-xs font-semibold">
                  {product.category}
                </Text>
              </View>
              {product.inStock && (
                <View className="bg-green-100 px-3 py-1 rounded-full ml-2">
                  <Text className="text-green-600 text-xs font-semibold">
                    In Stock
                  </Text>
                </View>
              )}
            </View>

            {/* Product Name */}
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-4">
              <View className="flex-row mr-2">
                {renderStars(Math.floor(product.rating))}
              </View>
              <Text className="text-gray-600 text-sm">
                {product.rating} ({product.reviews} reviews)
              </Text>
            </View>

            {/* Price */}
            <View className="flex-row items-center mb-6">
              <Text className="text-3xl font-bold text-gray-900">
                {product.price}
              </Text>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-2">
                Description
              </Text>
              <Text className="text-gray-600 leading-6">
                {product.description}
              </Text>
            </View>

            {/* Product Quantity Info */}
            {product.quantity && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Package Size
                </Text>
                <View className="flex-row items-center">
                  <View className="bg-purple-100 px-4 py-3 rounded-lg border border-purple-200 flex-row items-center">
                    <Ionicons name="cube-outline" size={20} color="#9333EA" />
                    <Text className="text-purple-700 font-bold text-lg ml-2">
                      {product.quantity.amount} {product.quantity.unit}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Features */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Key Features
              </Text>
              {product.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  <Text className="text-gray-700 flex-1">{feature}</Text>
                </View>
              ))}
            </View>

            {/* Quantity Selector */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Quantity
              </Text>
              {productInCart ? (
                <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-blue-700 font-semibold">
                      Already in cart ({currentQuantity} {currentQuantity === 1 ? 'item' : 'items'})
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push('/(authorized)/(tabs)/Cart')}
                      className="bg-blue-600 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-semibold text-sm">View Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center"
                  >
                    <Ionicons name="remove" size={20} color="#333" />
                  </TouchableOpacity>
                  <Text className="text-xl font-bold text-gray-900 mx-6">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center"
                  >
                    <Ionicons name="add" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View className="px-5 py-4 bg-white border-t border-gray-200">
          <View className="flex-row gap-3">
            {productInCart ? (
              <TouchableOpacity
                onPress={() => router.push('/(authorized)/(tabs)/Cart')}
                className="flex-1 bg-green-500 rounded-xl items-center justify-center h-14 flex-row"
              >
                <Ionicons name="cart" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Go to Cart</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleAddToCart}
                  className="w-14 h-14 bg-gray-100 rounded-xl items-center justify-center"
                >
                  <Ionicons name="cart-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl items-center justify-center h-14">
                  <Text className="text-white font-bold text-lg">Buy Now</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export { ProductDetails };

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
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
}

const base_api = "http://10.0.2.2:3000/api";

// Mock product details data (fallback only)
const PRODUCT_DETAILS: { [key: string]: ProductDetails } = {
  "1": {
    id: "1",
    name: "Wireless Headphones",
    price: "$99.99",
    originalPrice: "$129.99",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description: "Premium wireless headphones with active noise cancellation, superior sound quality, and long-lasting battery life. Perfect for music lovers and professionals.",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    category: "Electronics",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Comfortable over-ear design",
      "Built-in microphone"
    ]
  },
  "2": {
    id: "2",
    name: "Smart Watch",
    price: "$199.99",
    originalPrice: "$249.99",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    description: "Advanced smartwatch with fitness tracking, heart rate monitoring, and smartphone notifications. Stay connected and healthy.",
    rating: 4.7,
    reviews: 256,
    inStock: true,
    category: "Electronics",
    features: [
      "Heart rate monitor",
      "GPS tracking",
      "Water resistant",
      "7-day battery life",
      "Fitness tracking"
    ]
  },
  "3": {
    id: "3",
    name: "Camera Lens",
    price: "$299.99",
    originalPrice: "$399.99",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800",
    description: "Professional camera lens with superior optics and fast autofocus. Capture stunning photos with exceptional clarity.",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    category: "Electronics",
    features: [
      "50mm focal length",
      "Fast f/1.8 aperture",
      "Multi-layer coating",
      "Silent autofocus motor",
      "Weather sealed"
    ]
  },
  "4": {
    id: "4",
    name: "Gaming Mouse",
    price: "$49.99",
    originalPrice: "$69.99",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
    description: "High-performance gaming mouse with customizable RGB lighting, programmable buttons, and precision tracking for competitive gaming.",
    rating: 4.6,
    reviews: 342,
    inStock: true,
    category: "Electronics",
    features: [
      "16,000 DPI sensor",
      "RGB lighting",
      "8 programmable buttons",
      "Ergonomic design",
      "Lightweight construction"
    ]
  },
  "5": {
    id: "5",
    name: "Laptop",
    price: "$899.99",
    originalPrice: "$1099.99",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    description: "Powerful laptop with fast processor, ample storage, and stunning display. Perfect for work, creativity, and entertainment.",
    rating: 4.7,
    reviews: 178,
    inStock: true,
    category: "Electronics",
    features: [
      "Intel Core i7 processor",
      "16GB RAM",
      "512GB SSD",
      "15.6-inch Full HD display",
      "Long battery life"
    ]
  },
  "6": {
    id: "6",
    name: "Sunglasses",
    price: "$79.99",
    originalPrice: "$99.99",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    description: "Stylish sunglasses with UV protection and polarized lenses. Perfect for outdoor activities and everyday wear.",
    rating: 4.4,
    reviews: 95,
    inStock: true,
    category: "Fashion",
    features: [
      "100% UV protection",
      "Polarized lenses",
      "Lightweight frame",
      "Scratch-resistant coating",
      "Includes carrying case"
    ]
  },
  "7": {
    id: "7",
    name: "Running Shoes",
    price: "$129.99",
    originalPrice: "$159.99",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    description: "Comfortable running shoes with excellent cushioning and support. Designed for optimal performance and durability.",
    rating: 4.8,
    reviews: 421,
    inStock: true,
    category: "Sports",
    features: [
      "Breathable mesh upper",
      "Responsive cushioning",
      "Durable rubber outsole",
      "Lightweight design",
      "Arch support"
    ]
  },
  "8": {
    id: "8",
    name: "Backpack",
    price: "$59.99",
    originalPrice: "$79.99",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    description: "Versatile backpack with multiple compartments and padded laptop sleeve. Perfect for work, school, or travel.",
    rating: 4.5,
    reviews: 234,
    inStock: true,
    category: "Fashion",
    features: [
      "Laptop compartment (fits 15-inch)",
      "Water-resistant material",
      "Multiple pockets",
      "Padded shoulder straps",
      "USB charging port"
    ]
  },
  "9": {
    id: "9",
    name: "Coffee Maker",
    price: "$149.99",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800",
    description: "Programmable coffee maker with thermal carafe. Brew perfect coffee every morning with customizable settings.",
    rating: 4.6,
    reviews: 167,
    inStock: true,
    category: "Home",
    features: [
      "12-cup capacity",
      "Programmable timer",
      "Thermal carafe",
      "Auto shut-off",
      "Brew strength control"
    ]
  },
  "10": {
    id: "10",
    name: "Desk Lamp",
    price: "$39.99",
    originalPrice: "$54.99",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    description: "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for reading, working, or studying.",
    rating: 4.5,
    reviews: 312,
    inStock: true,
    category: "Home",
    features: [
      "LED technology",
      "Adjustable brightness",
      "Color temperature control",
      "USB charging port",
      "Touch controls"
    ]
  },
  "11": {
    id: "11",
    name: "Bluetooth Speaker",
    price: "$79.99",
    originalPrice: "$99.99",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    description: "Portable Bluetooth speaker with powerful sound and long battery life. Water-resistant design for outdoor adventures.",
    rating: 4.7,
    reviews: 289,
    inStock: true,
    category: "Electronics",
    features: [
      "360-degree sound",
      "20-hour battery life",
      "Water-resistant (IPX7)",
      "Bluetooth 5.0",
      "Built-in microphone"
    ]
  },
  "12": {
    id: "12",
    name: "Yoga Mat",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    description: "Non-slip yoga mat with extra cushioning for comfort. Perfect for yoga, pilates, and floor exercises.",
    rating: 4.6,
    reviews: 456,
    inStock: true,
    category: "Sports",
    features: [
      "Non-slip surface",
      "6mm thickness",
      "Eco-friendly material",
      "Lightweight and portable",
      "Includes carrying strap"
    ]
  },
  "13": {
    id: "13",
    name: "Water Bottle",
    price: "$24.99",
    originalPrice: "$34.99",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.",
    rating: 4.8,
    reviews: 523,
    inStock: true,
    category: "Sports",
    features: [
      "Double-wall insulation",
      "24oz capacity",
      "BPA-free",
      "Leak-proof lid",
      "Wide mouth opening"
    ]
  },
  "14": {
    id: "14",
    name: "Phone Case",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
    description: "Protective phone case with military-grade drop protection. Slim design with raised edges to protect screen and camera.",
    rating: 4.5,
    reviews: 678,
    inStock: true,
    category: "Electronics",
    features: [
      "Military-grade protection",
      "Slim profile",
      "Raised bezels",
      "Wireless charging compatible",
      "Anti-slip grip"
    ]
  },
  "15": {
    id: "15",
    name: "Keyboard",
    price: "$89.99",
    originalPrice: "$119.99",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    description: "Mechanical keyboard with RGB backlighting and customizable keys. Perfect for gaming and typing with tactile feedback.",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    category: "Electronics",
    features: [
      "Mechanical switches",
      "RGB backlighting",
      "Programmable keys",
      "Anti-ghosting",
      "Detachable USB cable"
    ]
  },
  "16": {
    id: "16",
    name: "Monitor",
    price: "$399.99",
    originalPrice: "$499.99",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    description: "27-inch 4K monitor with stunning color accuracy and fast response time. Perfect for gaming, design, and productivity.",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    category: "Electronics",
    features: [
      "27-inch 4K display",
      "IPS panel",
      "1ms response time",
      "144Hz refresh rate",
      "HDR support"
    ]
  },
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        features: Array.isArray(productData.features) && productData.features.length > 0
          ? productData.features
          : ["No features listed"],
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
    
    const original = parseFloat(product.originalPrice.replace('$', ''));
    const current = parseFloat(product.price.replace('$', ''));
    
    // Only show discount if original price is higher than current price
    if (original > current) {
      const discountPercentage = Math.round(((original - current) / original) * 100);
      return discountPercentage;
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">Loading product details...</Text>
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
            <Text className="text-lg font-bold text-gray-900">Product Details</Text>
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
          <Text className="text-lg font-bold text-gray-900">Product Details</Text>
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
                <Text className="text-white text-sm font-bold">{discount}% OFF</Text>
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
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View className="px-5 py-4 bg-white border-t border-gray-200">
          <View className="flex-row gap-3">
            <TouchableOpacity className="w-14 h-14 bg-gray-100 rounded-xl items-center justify-center">
              <Ionicons name="cart-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl items-center justify-center h-14">
              <Text className="text-white font-bold text-lg">Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


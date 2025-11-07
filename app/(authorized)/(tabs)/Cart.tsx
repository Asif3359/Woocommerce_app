import { useCart } from '@/hooks/useCart';
import { Cart as CartModel } from '@/models/Cart';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import React, { memo } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Cart Item Component
interface CartItemProps {
  item: CartModel;
  onIncrement: (productId: string, currentQuantity: number) => void;
  onDecrement: (productId: string, currentQuantity: number) => void;
  onRemove: (productId: string, productName: string) => void;
}

const CartItem = memo(({ item, onIncrement, onDecrement, onRemove }: CartItemProps) => {
  const itemPrice = parseFloat(item.price.replace('$', '')) || 0;
  const itemTotal = itemPrice * item.quantity;

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
      <View className="flex-row">
        {/* Product Image */}
        <TouchableOpacity
          onPress={() => router.push(`/(authorized)/products/${item.productId}`)}
          className="mr-4"
        >
          <Image
            source={{ uri: item.image }}
            className="w-24 h-24 rounded-lg bg-gray-100"
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Product Details */}
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => router.push(`/(authorized)/products/${item.productId}`)}
          >
            <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>

          {item.category && (
            <Text className="text-xs text-gray-500 mb-1">{item.category}</Text>
          )}

          {item.quantityAmount && item.quantityUnit && (
            <View className="flex-row items-center mb-2">
              <View className="bg-purple-50 px-2 py-1 rounded">
                <Text className="text-purple-700 text-xs font-semibold">
                  {item.quantityAmount} {item.quantityUnit} per pack
                </Text>
              </View>
            </View>
          )}

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-blue-600">
                ${itemTotal.toFixed(2)}
              </Text>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center bg-gray-100 rounded-lg">
              <TouchableOpacity
                onPress={() => onDecrement(item.productId, item.quantity)}
                className="p-2"
              >
                <Ionicons name="remove" size={18} color="#4B5563" />
              </TouchableOpacity>
              
              <Text className="px-4 py-1 font-semibold text-gray-800">
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                onPress={() => onIncrement(item.productId, item.quantity)}
                className="p-2"
              >
                <Ionicons name="add" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => onRemove(item.productId, item.name)}
        className="absolute top-2 right-2 p-2"
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
});

CartItem.displayName = 'CartItem';

function Cart() {
  const currentUser = getAuth().currentUser;
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart(currentUser?.email || '');

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${productName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Proceed to checkout with ${totalItems} item(s) for $${totalPrice.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            // TODO: Navigate to checkout screen
            Alert.alert('Success', 'Checkout functionality coming soon!');
          },
        },
      ]
    );
  };

  const incrementQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white px-4 py-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
          </View>

          {/* Empty State */}
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center mb-6">
              <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</Text>
            <Text className="text-gray-500 text-center mb-8">
              Looks like you haven't added any items to your cart yet.
            </Text>
            <TouchableOpacity
              className="bg-blue-600 px-8 py-4 rounded-lg"
              onPress={() => router.push("/(authorized)/products")}
            >
              <Text className="text-white font-semibold text-base">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClearCart}
              className="px-4 py-2 bg-red-50 rounded-lg"
            >
              <Text className="text-red-600 font-semibold text-sm">Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cart Items */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 160 }}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              onRemove={handleRemoveItem}
            />
          )}
        />

        {/* Bottom Summary & Checkout */}
        <View className="bg-white px-4 py-4 border-t border-gray-200">
          {/* Order Summary */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Subtotal ({totalItems} items)</Text>
              <Text className="font-semibold text-gray-800">
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-semibold text-green-600">Free</Text>
            </View>
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-gray-800">Total</Text>
                <Text className="text-xl font-bold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-blue-600 py-4 rounded-lg items-center shadow-sm"
          >
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-base mr-2">Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          {/* Continue Shopping */}
          <TouchableOpacity
            onPress={() => router.push("/(authorized)/products")}
            className="py-3 items-center mt-2"
          >
            <Text className="text-blue-600 font-semibold">Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Cart;
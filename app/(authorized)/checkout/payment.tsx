import { useCart } from '@/hooks/useCart';
import { orderApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const totalAmount = parseFloat((params.totalAmount as string) || '0');
  const totalItems = parseInt((params.totalItems as string) || '0');
  const cartItems = params.cartItems ? JSON.parse(params.cartItems as string) : [];
  const shippingAddress = params.shippingAddress ? JSON.parse(params.shippingAddress as string) : null;

  const currentUser = getAuth().currentUser;
  const { clearCart } = useCart(currentUser?.email || '');

  const [selectedPayment, setSelectedPayment] = useState<'stripe' | 'cash_on_delivery' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stripe minimum amount check (₹50 or $0.50)
  const STRIPE_MINIMUM_AMOUNT = 50;
  const isAmountBelowStripeMinimum = totalAmount < STRIPE_MINIMUM_AMOUNT;

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      Alert.alert('Payment Method Required', 'Please select a payment method to continue.');
      return;
    }

    if (!shippingAddress) {
      Alert.alert('Error', 'Shipping address is missing.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order items
      const items = cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Create order
      const order = await orderApi.createOrder({
        user: currentUser?.uid || '',
        userEmail: currentUser?.email || '',
        items,
        shippingAddress,
        paymentMethod: selectedPayment,
      });

      // Clear cart after successful order
      clearCart();

      // Navigate based on payment method
      if (selectedPayment === 'stripe') {
        // For Stripe, navigate to payment screen
        router.replace({
          pathname: '/(authorized)/checkout/stripe-payment',
          params: {
            orderId: order._id,
            amount: order.totalAmount.toString(),
          },
        });
      } else {
        // For Cash on Delivery, go directly to success screen
        router.replace({
          pathname: '/(authorized)/checkout/success',
          params: {
            orderId: order._id,
          },
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert(
        'Order Failed',
        error instanceof Error ? error.message : 'Failed to place order. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 p-2"
              disabled={isProcessing}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-gray-800">Payment</Text>
              <Text className="text-sm text-gray-500 mt-1">Select Payment Method</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">Order Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Items</Text>
              <Text className="font-semibold text-gray-800">{totalItems}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="font-semibold text-gray-800">${totalAmount.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-semibold text-green-600">Free</Text>
            </View>
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-gray-800">Total</Text>
                <Text className="text-xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Shipping Address Display */}
          {shippingAddress && (
            <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-bold text-gray-800">Shipping Address</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-blue-600 text-sm font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-700 leading-5">
                {shippingAddress.street}
                {'\n'}
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                {'\n'}
                {shippingAddress.country}
              </Text>
            </View>
          )}

          {/* Payment Methods */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">Payment Method</Text>

            {/* Stripe Payment */}
            <TouchableOpacity
              onPress={() => !isAmountBelowStripeMinimum && setSelectedPayment('stripe')}
              disabled={isProcessing || isAmountBelowStripeMinimum}
              className={`border-2 rounded-lg p-4 mb-3 ${
                isAmountBelowStripeMinimum
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : selectedPayment === 'stripe'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                    selectedPayment === 'stripe'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === 'stripe' && (
                    <View className="w-2 h-2 bg-white rounded-full" />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Ionicons name="card-outline" size={20} color={isAmountBelowStripeMinimum ? "#9CA3AF" : "#2563EB"} />
                    <Text className={`text-base font-semibold ml-2 ${
                      isAmountBelowStripeMinimum ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      Card Payment (Stripe)
                    </Text>
                  </View>
                  {isAmountBelowStripeMinimum ? (
                    <Text className="text-xs text-red-500 mt-1">
                      ⚠️ Minimum order ₹{STRIPE_MINIMUM_AMOUNT} required for card payment
                    </Text>
                  ) : (
                    <Text className="text-xs text-gray-500 mt-1">
                      Pay securely with credit/debit card
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Cash on Delivery */}
            <TouchableOpacity
              onPress={() => setSelectedPayment('cash_on_delivery')}
              disabled={isProcessing}
              className={`border-2 rounded-lg p-4 ${
                selectedPayment === 'cash_on_delivery'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                    selectedPayment === 'cash_on_delivery'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === 'cash_on_delivery' && (
                    <View className="w-2 h-2 bg-white rounded-full" />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Ionicons name="cash-outline" size={20} color="#059669" />
                    <Text className="text-base font-semibold text-gray-800 ml-2">
                      Cash on Delivery
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    Pay when you receive your order
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View className="bg-white px-4 py-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={!selectedPayment || isProcessing}
            className={`py-4 rounded-lg items-center shadow-sm ${
              !selectedPayment || isProcessing ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          >
            {isProcessing ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" />
                <Text className="text-white font-bold text-base ml-2">Processing...</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-base mr-2">Place Order</Text>
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


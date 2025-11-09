import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          {/* Success Icon */}
          <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>

          {/* Success Message */}
          <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Order Placed Successfully!
          </Text>
          <Text className="text-gray-500 text-center mb-2">
            Your order has been placed and is being processed.
          </Text>

          {orderId && (
            <View className="bg-gray-100 px-4 py-2 rounded-lg mb-8">
              <Text className="text-sm text-gray-600">Order ID</Text>
              <Text className="text-base font-semibold text-gray-800">{orderId}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <TouchableOpacity
            className="bg-blue-600 px-8 py-4 rounded-lg mb-3 w-full"
            onPress={() => router.push('/(authorized)/orders')}
          >
            <Text className="text-white font-semibold text-base text-center">
              View My Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border-2 border-blue-600 px-8 py-4 rounded-lg w-full"
            onPress={() => router.push('/(authorized)/products')}
          >
            <Text className="text-blue-600 font-semibold text-base text-center">
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


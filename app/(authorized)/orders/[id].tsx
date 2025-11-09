import { Order, orderApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'text-green-600';
    case 'unpaid':
      return 'text-orange-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedOrder = await orderApi.getOrderById(orderId);
        setOrder(fetchedOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-500 mt-4">Loading order details...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 justify-center items-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Failed to Load Order
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              {error || 'Order not found'}
            </Text>
            <TouchableOpacity
              className="bg-blue-600 px-8 py-3 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const statusColor = getStatusColor(order.status);
  const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">Order Details</Text>
              <Text className="text-sm text-gray-500 mt-1">
                #{order._id.slice(-8).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Card */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">Order Status</Text>
              <View className={`px-3 py-1 rounded-full ${statusColor.split(' ')[0]}`}>
                <Text className={`text-sm font-semibold capitalize ${statusColor.split(' ')[1]}`}>
                  {order.status}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-600">Placed on {orderDate}</Text>
          </View>

          {/* Items */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Order Items</Text>
            {order.items.map((item, index) => (
              <View
                key={index}
                className={`flex-row py-3 ${index !== order.items.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-lg bg-gray-100 mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
                    {item.name}
                  </Text>
                  {item.amount && item.unit && (
                    <Text className="text-xs text-gray-500 mb-1">
                      {item.amount} {item.unit} per pack
                    </Text>
                  )}
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-600">Qty: {item.quantity}</Text>
                    <Text className="text-base font-bold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Shipping Address */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">Shipping Address</Text>
            <View className="flex-row">
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <Text className="flex-1 ml-2 text-gray-700 leading-5">
                {order.shippingAddress.street}
                {'\n'}
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
                {'\n'}
                {order.shippingAddress.country || 'India'}
              </Text>
            </View>
          </View>

          {/* Payment Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">Payment Information</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Payment Method</Text>
              <Text className="font-semibold text-gray-800 capitalize">
                {order.paymentMethod.replace('_', ' ')}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Payment Status</Text>
              <Text className={`font-semibold capitalize ${paymentStatusColor}`}>
                {order.paymentStatus}
              </Text>
            </View>
            <View className="border-t border-gray-200 pt-3 mt-3">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold text-gray-800">
                  ${order.totalAmount.toFixed(2)}
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
                    ${order.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {order.paymentStatus === 'unpaid' && order.paymentMethod === 'stripe' && (
          <View className="bg-white px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(authorized)/checkout/stripe-payment',
                  params: {
                    orderId: order._id,
                    amount: order.totalAmount.toString(),
                  },
                })
              }
              className="bg-blue-600 py-4 rounded-lg items-center shadow-sm"
            >
              <Text className="text-white font-bold text-base">Complete Payment</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


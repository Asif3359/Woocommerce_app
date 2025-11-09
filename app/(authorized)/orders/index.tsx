import { useAuth } from '@/providers/AuthProvider';
import { Order, orderApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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

interface OrderItemProps {
  order: Order;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const statusColor = getStatusColor(order.status);
  const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(authorized)/orders/${order._id}`)}
      className="bg-white rounded-xl p-4 shadow-sm mb-3"
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-xs text-gray-500 mb-1">Order ID</Text>
          <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
            #{order._id.slice(-8).toUpperCase()}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${statusColor.split(' ')[0]}`}>
          <Text className={`text-xs font-semibold capitalize ${statusColor.split(' ')[1]}`}>
            {order.status}
          </Text>
        </View>
      </View>

      {/* Order Details */}
      <View className="border-t border-gray-100 pt-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Date</Text>
          <Text className="text-sm font-medium text-gray-800">{orderDate}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Items</Text>
          <Text className="text-sm font-medium text-gray-800">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Payment</Text>
          <Text className={`text-sm font-semibold capitalize ${paymentStatusColor}`}>
            {order.paymentStatus}
          </Text>
        </View>
        <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
          <Text className="text-base font-bold text-gray-800">Total</Text>
          <Text className="text-lg font-bold text-blue-600">
            ${order.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* View Details Arrow */}
      <View className="absolute right-4 bottom-4">
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

export default function OrdersScreen() {
  const { isGuest } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (!isRefresh) setIsLoading(true);
      setError(null);

      const fetchedOrders = await orderApi.getMyOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchOrders(true);
  }, []);

  useEffect(() => {
    // Only fetch orders if user is not a guest
    if (!isGuest) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [isGuest]);

  // Guest User State - Show login prompt
  if (isGuest) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white px-4 py-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
          </View>
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-32 h-32 bg-blue-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="lock-closed-outline" size={64} color="#2563EB" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
              Login Required
            </Text>
            <Text className="text-gray-600 text-center mb-2 leading-6">
              You're currently browsing as a guest. To view your order history, please log in with the email address you used when placing your orders.
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-8 italic">
              Use the email from your order's shipping address
            </Text>
            <View className="w-full px-4">
              <TouchableOpacity
                className="bg-blue-600 px-8 py-4 rounded-lg mb-3"
                onPress={() => router.push('/login/login')}
              >
                <Text className="text-white font-semibold text-base text-center">
                  Login to View Orders
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-100 px-8 py-4 rounded-lg"
                onPress={() => router.back()}
              >
                <Text className="text-gray-700 font-semibold text-base text-center">
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white px-4 py-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
          </View>
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-500 mt-4">Loading orders...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white px-4 py-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
          </View>
          <View className="flex-1 justify-center items-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Failed to Load Orders
            </Text>
            <Text className="text-gray-500 text-center mb-6">{error}</Text>
            <TouchableOpacity
              className="bg-blue-600 px-8 py-3 rounded-lg"
              onPress={() => fetchOrders()}
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Empty State
  if (orders.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white px-4 py-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
          </View>
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center mb-6">
              <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</Text>
            <Text className="text-gray-500 text-center mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </Text>
            <TouchableOpacity
              className="bg-blue-600 px-8 py-4 rounded-lg"
              onPress={() => router.push('/(authorized)/products')}
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
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </Text>
            </View>
          </View>

        </View>

        {/* Orders List */}
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => <OrderItem order={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#2563EB']}
            />
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


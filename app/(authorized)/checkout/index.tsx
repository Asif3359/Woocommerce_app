import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const currentuser = getAuth().currentUser;
  const params = useLocalSearchParams();
  const totalAmount = parseFloat((params.totalAmount as string) || '0');
  const totalItems = parseInt((params.totalItems as string) || '0');
  const cartItems = params.cartItems ? JSON.parse(params.cartItems as string) : [];

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    email: currentuser?.email || '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{4}$/.test(shippingAddress.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code (4 digits)';
    }
    if (!shippingAddress.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(shippingAddress.phone.replace(/[\s\-]/g, ''))) {
      newErrors.phone = 'Invalid phone number (10-15 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (!validateForm()) {
      Alert.alert('Invalid Input', 'Please fill in all required fields correctly.');
      return;
    }

    // Navigate to payment screen with shipping address and cart items
    router.push({
      pathname: '/(authorized)/checkout/payment',
      params: {
        totalAmount: totalAmount.toString(),
        totalItems: totalItems.toString(),
        cartItems: JSON.stringify(cartItems),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="bg-white px-4 py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="mr-3 p-2"
              >
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <View>
                <Text className="text-2xl font-bold text-gray-800">Checkout</Text>
                <Text className="text-sm text-gray-500 mt-1">Shipping Address</Text>
              </View>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Order Summary Card */}
            <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-2">Order Summary</Text>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600">Items</Text>
                <Text className="font-semibold text-gray-800">{totalItems}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Amount</Text>
                <Text className="font-bold text-blue-600">${totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            {/* Shipping Address Form */}
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-4">Shipping Address</Text>

              {/* Street Address */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Street Address *
                </Text>
                <TextInput
                  className={`bg-gray-50 border ${errors.street ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800`}
                  placeholder="Enter your street address"
                  value={shippingAddress.street}
                  onChangeText={(text) => {
                    setShippingAddress({ ...shippingAddress, street: text });
                    if (errors.street) setErrors({ ...errors, street: '' });
                  }}
                />
                {errors.street && (
                  <Text className="text-red-500 text-xs mt-1">{errors.street}</Text>
                )}
              </View>

              {/* City */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">City *</Text>
                <TextInput
                  className={`bg-gray-50 border ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800`}
                  placeholder="Enter your city"
                  value={shippingAddress.city}
                  onChangeText={(text) => {
                    setShippingAddress({ ...shippingAddress, city: text });
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                />
                {errors.city && (
                  <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>
                )}
              </View>

              {/* State and ZIP Code */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">State *</Text>
                  <TextInput
                    className={`bg-gray-50 border ${errors.state ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="State"
                    value={shippingAddress.state}
                    onChangeText={(text) => {
                      setShippingAddress({ ...shippingAddress, state: text });
                      if (errors.state) setErrors({ ...errors, state: '' });
                    }}
                  />
                  {errors.state && (
                    <Text className="text-red-500 text-xs mt-1">{errors.state}</Text>
                  )}
                </View>

                <View className="flex-1 ml-2">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">ZIP Code *</Text>
                  <TextInput
                    className={`bg-gray-50 border ${errors.zipCode ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="1206"
                    value={shippingAddress.zipCode}
                    keyboardType="numeric"
                    maxLength={4}
                    onChangeText={(text) => {
                      setShippingAddress({ ...shippingAddress, zipCode: text });
                      if (errors.zipCode) setErrors({ ...errors, zipCode: '' });
                    }}
                  />
                  {errors.zipCode && (
                    <Text className="text-red-500 text-xs mt-1">{errors.zipCode}</Text>
                  )}
                </View>
              </View>

              {/* Country */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Country</Text>
                <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                  <Text className="text-gray-600">{shippingAddress.country}</Text>
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </Text>
                <TextInput
                  className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800`}
                  placeholder="your.email@example.com"
                  value={shippingAddress.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setShippingAddress({ ...shippingAddress, email: text });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                />
                {errors.email && (
                  <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                )}
                <Text className="text-xs text-gray-500 mt-1">
                  We'll send order updates to this email
                </Text>
              </View>

              {/* Phone */}
              <View className="mb-2">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </Text>
                <TextInput
                  className={`bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800`}
                  placeholder="01712345678"
                  value={shippingAddress.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => {
                    setShippingAddress({ ...shippingAddress, phone: text });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                />
                {errors.phone && (
                  <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Continue Button */}
          <View className="bg-white px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleContinueToPayment}
              className="bg-blue-600 py-4 rounded-lg items-center shadow-sm"
            >
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-base mr-2">
                  Continue to Payment
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


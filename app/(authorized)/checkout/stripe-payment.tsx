import { paymentApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Check if running in development mode (no Stripe keys)
const isDevelopmentMode = !process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('YOUR_STRIPE');

export default function StripePaymentScreen() {
  const params = useLocalSearchParams();
  const orderId = (params.orderId as string) || '';
  const amount = parseFloat((params.amount as string) || '0');

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize payment sheet when component mounts
  useEffect(() => {
    if (isDevelopmentMode) {
      // Skip Stripe initialization in dev mode
      console.log('⚙️ Running in development mode - Stripe disabled');
      setIsReady(true);
    } else {
      // Initialize real Stripe payment
      initializePaymentSheet();
    }
  }, []);

  const initializePaymentSheet = async () => {
    try {
      setIsProcessing(true);
      console.log('🔄 Initializing Stripe payment for order:', orderId);
      
      // Create payment intent on backend
      const { clientSecret, paymentIntentId } = await paymentApi.createPaymentIntent(orderId);
      console.log('✅ Payment intent created:', paymentIntentId);

      // Initialize the Stripe payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'WooCommerce App',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: 'Customer',
        },
        allowsDelayedPaymentMethods: true,
        returnURL: 'woocommerceapp://checkout/success', // For redirects
      });

      if (error) {
        console.error('❌ Error initializing payment sheet:', error);
        Alert.alert('Initialization Error', error.message);
        return;
      }

      console.log('✅ Payment sheet initialized successfully');
      setIsReady(true);
    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      Alert.alert(
        'Payment Initialization Failed',
        error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.'
      );
      // Go back on error
      setTimeout(() => router.back(), 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!isReady) {
      Alert.alert('Please Wait', 'Payment is still being initialized...');
      return;
    }

    setIsProcessing(true);

    try {
      // DEVELOPMENT MODE: Simulate payment without Stripe
      if (isDevelopmentMode) {
        Alert.alert(
          '⚙️ Development Mode',
          'Stripe keys not configured. Simulate successful payment?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setIsProcessing(false),
            },
            {
              text: 'Simulate Success',
              onPress: async () => {
                console.log('🧪 Simulating payment success...');
                await new Promise((resolve) => setTimeout(resolve, 2000));
                
                router.replace({
                  pathname: '/(authorized)/checkout/success',
                  params: { orderId },
                });
              },
            },
          ]
        );
        return;
      }

      // PRODUCTION MODE: Real Stripe payment
      console.log('💳 Presenting Stripe payment sheet...');
      const { error } = await presentPaymentSheet();

      if (error) {
        // Payment failed or user cancelled
        if (error.code === 'Canceled') {
          console.log('❌ User cancelled payment');
          setIsProcessing(false);
          return;
        }
        
        console.error('❌ Payment error:', error);
        Alert.alert('Payment Failed', error.message);
        setIsProcessing(false);
        return;
      }

      // Payment succeeded!
      console.log('✅ Payment successful!');
      
      // Verify payment with backend
      try {
        await paymentApi.verifyPayment(orderId);
        console.log('✅ Payment verified with backend');
        
        // Navigate to success screen
        router.replace({
          pathname: '/(authorized)/checkout/success',
          params: { orderId },
        });
      } catch (verifyError) {
        console.error('⚠️ Verification failed:', verifyError);
        // Payment went through but verification failed
        Alert.alert(
          'Payment Successful',
          'Your payment was processed, but verification failed. Please check your orders.',
          [
            {
              text: 'View Orders',
              onPress: () => router.replace('/(authorized)/orders'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      Alert.alert(
        'Payment Error',
        error instanceof Error ? error.message : 'An unexpected error occurred'
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
              <Text className="text-sm text-gray-500 mt-1">Complete your payment</Text>
            </View>
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          {/* Payment Icon */}
          <View className="w-32 h-32 bg-blue-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="card" size={64} color="#2563EB" />
          </View>

          {/* Amount */}
          <Text className="text-gray-600 mb-2">Amount to Pay</Text>
          <Text className="text-4xl font-bold text-blue-600 mb-8">
            ${amount.toFixed(2)}
          </Text>

          {/* Info Box */}
          <View className={`${isDevelopmentMode ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-8 w-full`}>
            <View className="flex-row">
              <Ionicons 
                name={isDevelopmentMode ? "information-circle" : "shield-checkmark"} 
                size={24} 
                color={isDevelopmentMode ? "#D97706" : "#2563EB"} 
              />
              <View className="flex-1 ml-3">
                <Text className={`text-sm font-semibold ${isDevelopmentMode ? 'text-yellow-800' : 'text-blue-800'} mb-1`}>
                  {isDevelopmentMode ? '⚙️ Development Mode' : '🔒 Secure Payment'}
                </Text>
                <Text className={`text-xs ${isDevelopmentMode ? 'text-yellow-700' : 'text-blue-700'}`}>
                  {isDevelopmentMode 
                    ? 'Stripe not configured. Payment will be simulated. Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env'
                    : 'Your payment is processed securely through Stripe. Card details are never stored on our servers.'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Button */}
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isProcessing || (!isDevelopmentMode && !isReady)}
            className={`w-full py-4 rounded-lg items-center ${
              isProcessing || (!isDevelopmentMode && !isReady) ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          >
            {isProcessing ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  {isReady ? 'Processing...' : 'Initializing...'}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="card" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Pay ${amount.toFixed(2)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isProcessing}
            className="mt-4"
          >
            <Text className="text-gray-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


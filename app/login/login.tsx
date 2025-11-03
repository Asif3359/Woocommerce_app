import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { signInWithEmail, signInWithGoogle, signInAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");
    await signInWithEmail(email, password, setError, setIsLoading);
  };

  const handleGuestLogin = async () => {
    await signInAsGuest();
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    await signInWithGoogle(setError, setIsGoogleLoading);
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset feature coming soon!");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View className="items-center pt-8 pb-6">
              <View className="w-20 h-20 bg-green-500 rounded-2xl justify-center items-center mb-4 shadow-lg shadow-green-500/30">
                <Ionicons name="cart" size={32} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                FreshCart
              </Text>
              <Text className="text-lg text-gray-600">
                Your Grocery Shopping Partner
              </Text>
            </View>

            {/* Login Form */}
            <View className="flex-1 px-6 pt-8">
              <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Welcome Back
              </Text>

              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-3">Email</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-3">Password</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error Message */}
              {error ? (
                <View className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                className="self-end mb-8"
              >
                <Text className="text-green-600 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-green-500 py-4 rounded-2xl items-center shadow-lg shadow-green-500/30 ${
                  isLoading
                    ? "opacity-70"
                    : "active:bg-green-600 active:scale-95"
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <View className="flex-row items-center">
                  {isLoading && (
                    <Ionicons
                      name="refresh"
                      size={20}
                      color="white"
                      className="mr-2"
                    />
                  )}
                  <Text className="text-white text-lg font-semibold">
                    {isLoading ? "Signing In..." : "Sign In to Your Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500 font-medium">OR</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Social Login Options */}
              <View className="flex-row justify-between mb-8">
                <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-2xl items-center mr-2 border border-blue-100 active:bg-blue-100">
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className={`flex-1 bg-red-50 py-3 rounded-2xl items-center mx-2 border border-red-100 ${
                    isGoogleLoading ? "opacity-70" : "active:bg-red-100"
                  }`}
                >
                  {isGoogleLoading ? (
                    <Ionicons name="refresh" size={20} color="#DB4437" />
                  ) : (
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-black py-3 rounded-2xl items-center ml-2 active:bg-gray-800">
                  <Ionicons name="logo-apple" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Guest Login */}
              <TouchableOpacity
                className="py-4 rounded-2xl items-center border-2 border-gray-300 active:bg-gray-50 active:scale-95"
                onPress={handleGuestLogin}
              >
                <Text className="text-gray-700 text-base font-medium">
                  Continue as Guest
                </Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View className="flex-row justify-center mt-8 mb-4">
                <Text className="text-gray-600">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/login/signup");
                  }}
                >
                  <Text className="text-green-600 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

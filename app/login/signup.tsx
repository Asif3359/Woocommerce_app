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

export default function Signup() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      Alert.alert("Error", "Please accept the Terms & Conditions");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    await signUpWithEmail(fullName, email, password, setError, setIsLoading);
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError("");
    await signInWithGoogle(setError, setIsGoogleLoading);
  };

  const handleLoginRedirect = () => {
    router.back();
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
            <View className="items-center pt-6 pb-2">
              <View className="w-16 h-16 bg-green-500 rounded-2xl justify-center items-center mb-4 shadow-lg shadow-green-500/30">
                <Ionicons name="person-add" size={28} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </Text>
              <Text className="text-lg text-gray-600 text-center px-8">
                Join FreshCart for the best grocery shopping experience
              </Text>
            </View>

            {/* Signup Form */}
            <View className="flex-1 px-6 pt-4">
              {/* Full Name Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Full Name
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.fullName}
                    onChangeText={(value) =>
                      handleInputChange("fullName", value)
                    }
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Email Address
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(value) =>
                      handleInputChange("password", value)
                    }
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
                <Text className="text-xs text-gray-500 mt-1 ml-1">
                  Must be at least 6 characters
                </Text>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Confirm Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                      handleInputChange("confirmPassword", value)
                    }
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
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

              {/* Terms & Conditions */}
              <TouchableOpacity
                className="flex-row items-center mb-4"
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 justify-center items-center ${
                    acceptTerms
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-gray-700 flex-1">
                  I agree to the{" "}
                  <Text className="text-green-600 font-semibold">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text className="text-green-600 font-semibold">
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Signup Button */}
              <TouchableOpacity
                className={`bg-green-500 py-4 rounded-2xl items-center shadow-lg shadow-green-500/30 mb-4 ${
                  isLoading
                    ? "opacity-70"
                    : "active:bg-green-600 active:scale-95"
                }`}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <View className="flex-row items-center">
                  {isLoading && (
                    <Ionicons
                      name="refresh"
                      size={20}
                      color="white"
                      className="mr-2 animate-spin"
                    />
                  )}
                  <Text className="text-white text-lg font-semibold">
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500 font-medium">OR</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Social Signup Options */}
              <View className="flex-row justify-between mb-6">
                <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-2xl items-center mr-2 border border-blue-100 active:bg-blue-100">
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGoogleSignup}
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

              {/* Login Redirect */}
              <View className="flex-row justify-center mb-8">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={handleLoginRedirect}>
                  <Text className="text-green-600 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// app/(authorized)/(tabs)/index.tsx
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { signOut, token } = useAuth();

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      {/* Header */}
      <View className="bg-white px-6 py-8 rounded-b-3xl shadow-sm">
        <View className="items-center">
          <View className="w-16 h-16 bg-green-500 rounded-2xl justify-center items-center mb-4">
            <Ionicons name="checkmark" size={28} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            You're successfully signed in
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 mt-8">
        {/* Token Info Card */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="key" size={20} color="#6b7280" />
            <Text className="text-gray-600 font-medium ml-2">
              Session Token
            </Text>
          </View>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-xs text-gray-800 font-mono" numberOfLines={1}>
              {token?.current || "No token available"}
            </Text>
          </View>
          <Text className="text-xs text-gray-500 mt-2">
            This token maintains your secure session
          </Text>
        </View>

        {/* Stats or Additional Info */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-500">0</Text>
              <Text className="text-sm text-gray-600">Items</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500">0</Text>
              <Text className="text-sm text-gray-600">Tasks</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-500">0</Text>
              <Text className="text-sm text-gray-600">Messages</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View className="px-6 pb-8 pt-4">
        <TouchableOpacity
          className="bg-red-500 py-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-red-500/30 active:bg-red-600 active:scale-95"
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 text-sm mt-4">
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
}

// app/login/index.tsx
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { signIn } = useAuth();

  const handleLogin = () => {
    signIn("user_auth_token_here");
  };

  const handleSkip = () => {
    signIn("demo_token");
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white pt-20 px-6">
      {/* Header */}
      <View className="items-center mb-16">
        <View className="w-20 h-20 bg-blue-500 rounded-2xl justify-center items-center mb-6">
          <Ionicons name="cube" size={32} color="white" />
        </View>
        <Text className="text-4xl font-bold text-gray-900 mb-3">
          Welcome Back
        </Text>
        <Text className="text-lg text-gray-600 text-center leading-7 max-w-xs">
          Sign in to continue your journey with us
        </Text>
      </View>

      {/* Illustration/Image Section */}
      <View className="flex-1 justify-center items-center">
        <View className="w-64 h-64 bg-blue-100 rounded-3xl justify-center items-center border-2 border-dashed border-blue-200">
          <Ionicons name="people" size={64} color="#3b82f6" />
          <Text className="text-blue-500 text-sm mt-4 font-medium">
            Your App Illustration
          </Text>
        </View>
      </View>

      {/* Buttons Section */}
      <View className="gap-4 pb-8">
        <TouchableOpacity
          className="bg-blue-500 py-5 rounded-2xl items-center shadow-lg shadow-blue-500/30 active:bg-blue-600 active:scale-95"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-semibold">
            Sign In to Your Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-5 rounded-2xl items-center border-2 border-gray-200 active:bg-gray-50 active:scale-95"
          onPress={handleSkip}
        >
          <Text className="text-gray-600 text-base font-medium">
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

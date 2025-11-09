import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action?: () => void;
}

function profile() {
  const currentUser = getAuth().currentUser;
  const { signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      id: "1",
      title: "About me",
      icon: "person-outline",
      color: "#50C878",
    },
    {
      id: "2",
      title: "My Orders",
      icon: "cube-outline",
      color: "#50C878",
    },
    {
      id: "3",
      title: "My Favorites",
      icon: "heart-outline",
      color: "#50C878",
    },
    {
      id: "4",
      title: "My Address",
      icon: "location-outline",
      color: "#50C878",
    },
    {
      id: "5",
      title: "Credit Cards",
      icon: "card-outline",
      color: "#50C878",
    },
    {
      id: "6",
      title: "Transactions",
      icon: "cash-outline",
      color: "#50C878",
    },
    {
      id: "7",
      title: "Notifications",
      icon: "notifications-outline",
      color: "#50C878",
    },
    {
      id: "8",
      title: "Sign out",
      icon: "log-out-outline",
      color: "#50C878",
      action: signOut,
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.title === "Sign out") {
      // Show confirmation alert before signing out
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: () => {
              if (item.action) {
                item.action();
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else if (item.title === "My Orders") {
      router.push("/(authorized)/orders");
    } else if (item.action) {
      item.action();
    } else {
      console.log(`Navigate to ${item.title}`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View className="bg-white pt-8 pb-8 items-center">
            {/* Profile Image with Verification Badge */}
            <View className="relative mb-4">
              <Image
                source={{
                  uri: currentUser?.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                }}
                className="w-28 h-28 rounded-full"
              />
              {/* Verification Badge */}
              <View className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full items-center justify-center border-4 border-white">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>

            {/* User Info */}
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {currentUser?.displayName || "Guest User"}
            </Text>
            <Text className="text-gray-500 text-sm">
              {currentUser?.email || "guest@example.com"}
            </Text>
          </View>

          {/* Menu Items */}
          <View className="flex-1 bg-gray-50 pt-4 px-4">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleMenuPress(item)}
                className="flex-row items-center px-6 py-4 bg-white mb-2 rounded-xl"
                activeOpacity={0.7}
              >
                {/* Icon */}
                <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4">
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>

                {/* Title */}
                <Text className="flex-1 text-base text-gray-900 font-medium">
                  {item.title}
                </Text>

                {/* Right Arrow */}
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default profile;

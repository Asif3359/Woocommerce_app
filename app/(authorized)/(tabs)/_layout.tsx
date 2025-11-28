import { Image, StatusBar } from "react-native";

import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";

export default function TabsLayout() {
  const user = getAuth().currentUser;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#22c55e",
          tabBarInactiveTintColor: "#000000",
          headerShown: false,
          headerTitleAlign: "center",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) =>
              user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                />
              ) : (
                <Ionicons name="person" size={size} color={color} />
              ),
          }}
        />
      </Tabs>
    </>
  );
}

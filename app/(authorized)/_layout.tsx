// app/(authorized)/_layout.tsx
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthorizedLayout() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  if (!token?.current) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="categories/index" />
      <Stack.Screen name="products/index" />
    </Stack>
  );
}

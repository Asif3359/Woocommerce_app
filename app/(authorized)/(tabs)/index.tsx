// app/(authorized)/(tabs)/index.tsx
import { useAuth } from "@/providers/AuthProvider";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { signOut, token } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.subtitle}>You are successfully logged in.</Text>

      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>Current Token:</Text>
        <Text style={styles.tokenValue} numberOfLines={1}>
          {token?.current || "No token"}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  tokenContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  tokenLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

// npm install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
// npm install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11

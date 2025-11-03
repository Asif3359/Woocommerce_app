// app/login/index.tsx
import { useAuth } from "@/providers/AuthProvider";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { signIn } = useAuth();

  const handleLogin = () => {
    // Simulate login - replace with your actual login logic
    signIn("user_auth_token_here");
  };

  const handleSkip = () => {
    // For demo purposes, allow skipping login
    signIn("demo_token");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to My App</Text>
        <Text style={styles.subtitle}>
          Your amazing app description goes here
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {/* Replace with your actual image */}
        <View style={styles.placeholderImage}>
          <Text style={styles.imageText}>App Logo/Image</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#999",
    fontSize: 14,
  },
  buttonsContainer: {
    gap: 12,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  skipButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

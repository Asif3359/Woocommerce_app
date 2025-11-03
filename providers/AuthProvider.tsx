// providers/AuthProvider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AuthContextType {
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  token: React.MutableRefObject<string | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const tokenRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@user_token");
        tokenRef.current = token;

        // Auto-navigate if token exists
        if (token) {
          router.replace("/(authorized)" as any);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (newToken: string) => {
    try {
      await AsyncStorage.setItem("@user_token", newToken);
      tokenRef.current = newToken;
      router.replace("/(authorized)" as any);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@user_token");
      tokenRef.current = null;
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const authContext: AuthContextType = {
    signIn,
    signOut,
    token: tokenRef,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

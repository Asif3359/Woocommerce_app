// providers/AuthProvider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
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
  signInWithEmail: (
    email: string,
    password: string,
    setError?: (error: string) => void,
    setIsLoading?: (loading: boolean) => void
  ) => Promise<void>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
    setError?: (error: string) => void,
    setIsLoading?: (loading: boolean) => void
  ) => Promise<void>;
  signInWithGoogle: (
    setError?: (error: string) => void,
    setIsLoading?: (loading: boolean) => void
  ) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (
    displayName: string,
    setError?: (error: string) => void,
    setSuccess?: (msg: string) => void,
    setIsLoading?: (loading: boolean) => void
  ) => Promise<void>;
  token: React.MutableRefObject<string | null>;
  isLoading: boolean;
  isGuest: boolean;
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
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@user_token");
        const guestMode = await AsyncStorage.getItem("@guest_mode");
        tokenRef.current = token;
        setIsGuest(guestMode === "true");

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

  const signInWithEmail = async (
    email: string,
    password: string,
    setError?: (error: string) => void,
    setIsLoadingParam?: (loading: boolean) => void
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      
      await AsyncStorage.setItem("@user_token", token);
      await AsyncStorage.setItem("@guest_mode", "false");
      tokenRef.current = token;
      setIsGuest(false);

      console.log("User signed in with email!");
      router.replace("/(authorized)/(tabs)" as any);
    } catch (error: any) {
      const errorMessage = 
        error.code === "auth/invalid-credential" ? "Invalid email or password" :
        error.code === "auth/user-not-found" ? "User not found" :
        error.code === "auth/wrong-password" ? "Invalid password" :
        "Login failed. Please try again.";
      
      setError && setError(errorMessage);
      console.error("Sign in error:", error);
    } finally {
      setIsLoadingParam && setIsLoadingParam(false);
    }
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
    setError?: (error: string) => void,
    setIsLoadingParam?: (loading: boolean) => void
  ) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      console.log("✅ User created:", user.email);
      console.log("👤 Name set to:", name);
      
      // Redirect to login page after successful signup
      router.replace("/login/login" as any);
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "That email address is already in use!"
          : error.code === "auth/invalid-email"
          ? "That email address is invalid!"
          : error.code === "auth/weak-password"
          ? "Password is too weak. Use at least 6 characters."
          : error.message;

      setError && setError(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setIsLoadingParam && setIsLoadingParam(false);
    }
  };

  const signInWithGoogle = async (
    setError?: (error: string) => void,
    setIsLoadingParam?: (loading: boolean) => void
  ) => {
    try {
      // 1. Check if Play Services are available
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. Sign in the user
      const userInfo = await GoogleSignin.signIn();

      // 3. Get the ID token from the userInfo
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error("No ID token received from Google Sign-In");
      }

      // 4. Create a Firebase credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // 5. Sign-in the user with the credential
      const userCredential = await signInWithCredential(
        getAuth(),
        googleCredential
      );
      const token = await userCredential.user.getIdToken();

      await AsyncStorage.setItem("@user_token", token);
      await AsyncStorage.setItem("@guest_mode", "false");
      tokenRef.current = token;
      setIsGuest(false);

      console.log("Signed in with Google!");
      console.log("User:", userInfo.data?.user?.name);

      router.replace("/(authorized)/(tabs)" as any);
    } catch (error: any) {
      setError && setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoadingParam && setIsLoadingParam(false);
    }
  };

  const signInAsGuest = async () => {
    try {
      const guestToken = `guest_${Date.now()}`;
      await AsyncStorage.setItem("@user_token", guestToken);
      await AsyncStorage.setItem("@guest_mode", "true");
      tokenRef.current = guestToken;
      setIsGuest(true);

      console.log("Signed in as guest");
      router.replace("/(authorized)/(tabs)" as any);
    } catch (error) {
      console.error("Error signing in as guest:", error);
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Firebase if not guest
      if (!isGuest) {
        await firebaseSignOut(getAuth());
      }

      await AsyncStorage.removeItem("@user_token");
      await AsyncStorage.removeItem("@guest_mode");
      tokenRef.current = null;
      setIsGuest(false);

      console.log("User signed out!");
      router.replace("/login/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateUserProfile = async (
    newDisplayName: string,
    setError?: (error: string) => void,
    setSuccess?: (msg: string) => void,
    setIsLoadingParam?: (loading: boolean) => void
  ) => {
    try {
      setIsLoadingParam && setIsLoadingParam(true);
      
      if (isGuest) {
        throw new Error("Cannot update profile in guest mode");
      }

      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("No user currently logged in");
      }
      
      await updateProfile(user, { displayName: newDisplayName });
      setSuccess && setSuccess("Profile updated successfully");
      console.log("Profile updated");
    } catch (err: any) {
      setError && setError(err.message || "Something went wrong");
      console.error("Profile update failed", err);
    } finally {
      setIsLoadingParam && setIsLoadingParam(false);
    }
  };

  const authContext: AuthContextType = {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAsGuest,
    signOut,
    updateUserProfile,
    token: tokenRef,
    isLoading,
    isGuest,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

// app/_layout.tsx
import AuthProvider from "@/providers/AuthProvider";
import RealmProvider from "@/providers/RealmProvider";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import "../global.css";

GoogleSignin.configure({
  webClientId:
    "523423077490-5phrp0rb0lr012i82bcnf39urtk04eet.apps.googleusercontent.com",
  offlineAccess: false,
});

export default function RootLayout() {
  return (
    <RealmProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </RealmProvider>
  );
}

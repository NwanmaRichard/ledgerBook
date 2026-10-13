import { useAuth } from "@clerk/expo";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { currencyLabel } from "@/constants/currencies";
import { useAccountSettings } from "@/store/settings-store";
import { spacing } from "@/theme";

export default function SettingsScreen() {
  const { userId, signOut } = useAuth();
  const account = useAccountSettings(userId);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);
    setSignOutError("");

    try {
      await signOut();
    } catch {
      setSignOutError("Check your connection and try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <AppHeader />
      <View className="flex-1 px-6 pt-6">
        <Text className="h2 text-foreground">Settings</Text>
        <View className="card mt-6">
          <Text className="body-sm text-muted">Business</Text>
          <Text className="h4 mt-1 text-foreground">{account?.businessName}</Text>
          <Text className="body mt-3 text-muted">
            {account ? currencyLabel(account.currencyCode) : ""}
          </Text>
          <Text className="body-sm mt-3 text-muted">Colours follow your phone’s light or dark setting.</Text>
        </View>
        <View className="mt-auto items-center pb-2">
          {signOutError ? (
            <Text className="body-sm mb-2 text-center text-critical" accessibilityLiveRegion="polite">
              {signOutError}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            accessibilityState={{ disabled: signingOut, busy: signingOut }}
            disabled={signingOut}
            onPress={() => {
              void handleSignOut();
            }}
            style={({ pressed }) => [styles.signOut, pressed || signingOut ? styles.pressed : null]}
          >
            <Text className="h4 text-accent">Sign out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  signOut: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
});

import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { MoneyText } from "@/components/money-text";
import { useAccountSettings } from "@/store/settings-store";

export default function HomeScreen() {
  const { userId } = useAuth();
  const account = useAccountSettings(userId);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <AppHeader />
      <View className="px-6 pt-6">
        <Text className="h2 text-foreground">{account?.businessName}</Text>
        <Text className="body-sm mt-8 text-muted">Outstanding</Text>
        <MoneyText
          amountMinor={0}
          currencyCode={account?.currencyCode ?? "NGN"}
          className="h1 mt-1 text-foreground"
        />
        <Text className="body mt-2 text-muted">
          This is what customers still owe you. It stays at zero until you record credit.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add your first customer"
          onPress={() => router.push("/customer/new")}
          className="mt-8 min-h-12 items-center justify-center rounded-2xl bg-emerald px-4"
          style={({ pressed }) => [styles.curve, pressed ? styles.pressed : null]}
        >
          <Text className="h4 text-on-accent">Add your first customer</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  curve: {
    borderCurve: "continuous",
  },
  pressed: {
    opacity: 0.7,
  },
});

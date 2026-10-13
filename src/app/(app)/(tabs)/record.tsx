import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";

export default function RecordScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <AppHeader />
      <View className="flex-1 justify-center px-6">
        <Text className="h2 text-foreground">Record a transaction</Text>
        <Text className="body mt-2 text-muted">
          Add a customer first. Then you can record credit you gave them, or a repayment you
          received.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a customer"
          onPress={() => router.push("/customer/new")}
          className="mt-8 min-h-12 items-center justify-center rounded-2xl bg-emerald px-4"
          style={({ pressed }) => [styles.curve, pressed ? styles.pressed : null]}
        >
          <Text className="h4 text-on-accent">Add a customer</Text>
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

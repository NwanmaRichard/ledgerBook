import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { CustomersEmptyArt } from "@/components/customers-empty-art";
import { useLedgerClient } from "@/hooks/use-ledger-client";
import { listCustomers } from "@/lib/customers-api";
import type { Customer } from "@/types/customer";
import { semantic, spacing } from "@/theme";

export default function CustomersScreen() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;
  const { client, configError } = useLedgerClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    if (!client) {
      setCustomers([]);
      setLoading(!configError);
      setLoadError(configError);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      setCustomers(await listCustomers(client));
    } catch {
      setLoadError("Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [client, configError]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const visible = customers.filter((customer) => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return true;
    }

    return (
      customer.name.toLowerCase().includes(needle) ||
      (customer.phone ?? "").toLowerCase().includes(needle)
    );
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={[styles.page, customers.length > 0 ? styles.listPage : null]}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-[440px] px-6">
          {loading ? <Text className="body text-center text-muted">Loading customers</Text> : null}
          {loadError ? (
            <View className="items-center gap-3">
              <Text className="body text-center text-critical">{loadError}</Text>
              {client ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Try again"
                  onPress={() => {
                    void load();
                  }}
                  style={({ pressed }) => [styles.retry, pressed ? styles.pressed : null]}
                >
                  <Text className="h4 text-accent">Try again</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {!loading && !loadError && customers.length === 0 ? (
            <View className="items-center">
              <CustomersEmptyArt />
              <Text className="h2 mt-2 text-center text-foreground">No customers yet</Text>
              <Text className="body mt-2 text-center text-muted">
                Add your first customer to start tracking what they owe you.
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add your first customer"
                onPress={() => router.push("/customer/new")}
                className="mt-6 min-h-12 flex-row items-center justify-center gap-2 rounded-full bg-emerald px-6"
                style={({ pressed }) => [styles.curve, pressed ? styles.pressed : null]}
              >
                <Text className="h3 text-on-accent">+</Text>
                <Text className="h4 text-on-accent">Add your first customer</Text>
              </Pressable>
            </View>
          ) : null}
          {!loading && !loadError && customers.length > 0 ? (
            <View className="gap-4">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search customers"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Search customers"
                autoCapitalize="none"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                className="body-lg rounded-2xl border border-border bg-background px-4 text-foreground"
                style={styles.field}
              />
              <View className="flex-row items-center justify-between">
                <Text className="h3 text-foreground">Customers</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add a customer"
                  onPress={() => router.push("/customer/new")}
                  style={({ pressed }) => [styles.retry, pressed ? styles.pressed : null]}
                >
                  <Text className="h4 text-accent">Add</Text>
                </Pressable>
              </View>
              {visible.length === 0 ? (
                <Text className="body text-muted">No customers match that search.</Text>
              ) : (
                visible.map((customer) => (
                  <View key={customer.id} className="min-h-12 justify-center border-b border-border py-3">
                    <Text className="h4 text-foreground">{customer.name}</Text>
                    <Text className="body-sm text-muted">
                      {customer.phone ? customer.phone : "No phone"}
                    </Text>
                  </View>
                ))
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  page: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: spacing.xl,
  },
  listPage: {
    justifyContent: "flex-start",
    paddingTop: spacing.md,
  },
  field: {
    minHeight: spacing.touch,
    borderCurve: "continuous",
  },
  curve: {
    borderCurve: "continuous",
  },
  retry: {
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

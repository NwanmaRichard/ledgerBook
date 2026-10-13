import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { currencies, defaultCurrencyCode, type CurrencyCode } from "@/constants/currencies";
import { businessNameError, normalizeBusinessName } from "@/lib/business-name";
import { useSettingsStore } from "@/store/settings-store";
import { semantic, spacing } from "@/theme";

export default function SetupScreen() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;
  const { userId } = useAuth();
  const saveBusinessSetup = useSettingsStore((state) => state.saveBusinessSetup);
  const saving = useRef(false);

  const [businessName, setBusinessName] = useState("");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(defaultCurrencyCode);
  const [nameError, setNameError] = useState("");

  function handleNameChange(value: string) {
    setBusinessName(value);
    if (nameError) {
      setNameError("");
    }
  }

  function saveSetup() {
    if (saving.current || !userId) {
      return;
    }

    const nextError = businessNameError(businessName);
    setNameError(nextError);
    if (nextError) {
      return;
    }

    saving.current = true;
    Keyboard.dismiss();
    saveBusinessSetup(userId, {
      businessName: normalizeBusinessName(businessName),
      currencyCode,
    });
    router.replace("/");
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
          style={styles.safe}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.page}
          >
            <View className="mx-auto w-full max-w-[440px] gap-8 px-6 pt-4">
              <View className="gap-3">
                <Text className="h3" accessibilityRole="header">
                  <Text className="text-heading">Ledger</Text>
                  <Text className="text-accent">Book</Text>
                </Text>
                <View>
                  <Text className="h1 text-foreground">Name your</Text>
                  <Text className="h1 text-accent">business</Text>
                </View>
                <Text className="body-lg text-muted">
                  This name appears on reminders. You can set it on this phone without a connection.
                  Customer records still need the internet.
                </Text>
              </View>

              <View className="gap-2">
                <Text className="body-sm text-muted">Business name</Text>
                <TextInput
                  value={businessName}
                  onChangeText={handleNameChange}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="organization"
                  returnKeyType="done"
                  onSubmitEditing={saveSetup}
                  placeholder="Ada's Tailoring"
                  placeholderTextColor={colors.muted}
                  accessibilityLabel="Business name"
                  maxLength={60}
                  underlineColorAndroid="transparent"
                  className="body-lg rounded-2xl border border-border bg-background px-4 text-foreground"
                  style={styles.field}
                />
                {nameError ? (
                  <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                    {nameError}
                  </Text>
                ) : null}
              </View>

              <View className="gap-3" accessibilityRole="radiogroup">
                <Text className="body-sm text-muted">Currency</Text>
                {currencies.map((currency) => {
                  const selected = currency.code === currencyCode;
                  return (
                    <Pressable
                      key={currency.code}
                      accessibilityRole="radio"
                      accessibilityLabel={`${currency.name}, ${currency.code}`}
                      accessibilityState={{ selected }}
                      onPress={() => setCurrencyCode(currency.code)}
                      className={`min-h-12 flex-row items-center justify-between rounded-2xl border px-4 ${
                        selected ? "border-accent bg-accent-soft" : "border-border bg-background"
                      }`}
                      style={({ pressed }) => [styles.curve, pressed ? styles.pressed : null]}
                    >
                      <Text className="body-lg flex-1 text-foreground">{currency.name}</Text>
                      <Text className={`h4 ${selected ? "text-accent" : "text-muted"}`}>
                        {currency.code}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save business setup"
                onPress={saveSetup}
                className="min-h-12 items-center justify-center rounded-2xl bg-emerald px-4"
                style={({ pressed }) => [styles.curve, pressed ? styles.pressed : null]}
              >
                <Text className="h4 text-on-accent">Continue</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  page: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  field: {
    minHeight: spacing.touch,
    borderCurve: "continuous",
  },
  curve: {
    borderCurve: "continuous",
  },
  pressed: {
    opacity: 0.7,
  },
});

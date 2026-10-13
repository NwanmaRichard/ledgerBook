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

import { useLedgerClient } from "@/hooks/use-ledger-client";
import { customerNameError } from "@/lib/customer";
import { createCustomer, customerSaveMessage } from "@/lib/customers-api";
import { createId } from "@/lib/id";
import { customerPhoneError } from "@/lib/phone";
import { semantic, spacing } from "@/theme";

export default function NewCustomerScreen() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const customerId = useRef(createId());
  const { client, configError } = useLedgerClient();

  async function saveCustomer() {
    const nextNameError = customerNameError(name);
    const nextPhoneError = customerPhoneError(phone);
    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    setSaveError("");

    if (nextNameError || nextPhoneError || saving) {
      return;
    }

    Keyboard.dismiss();

    if (!client) {
      return;
    }

    setSaving(true);
    try {
      await createCustomer(client, {
        id: customerId.current,
        name,
        phone,
      });
      router.replace("/customers");
    } catch (error) {
      const record =
        typeof error === "object" && error !== null
          ? (error as { message?: string; code?: string })
          : {};
      setSaveError(customerSaveMessage(record));
    } finally {
      setSaving(false);
    }
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
            <View className="mx-auto w-full max-w-[440px] gap-8 px-6 pt-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to customers"
                onPress={() => router.back()}
                style={({ pressed }) => [styles.back, pressed ? styles.pressed : null]}
              >
                <Text className="h4 text-accent">Back</Text>
              </Pressable>

              <View className="gap-3">
                <Text className="h1 text-foreground">Add a customer</Text>
                <Text className="body-lg text-muted">
                  A name is enough. Add a phone number only if you want to send a reminder later.
                </Text>
              </View>

              <View className="gap-2">
                <Text className="body-sm text-muted">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (nameError) {
                      setNameError("");
                    }
                    if (saveError) {
                      setSaveError("");
                    }
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="name"
                  returnKeyType="next"
                  placeholder="Ada Okafor"
                  placeholderTextColor={colors.muted}
                  accessibilityLabel="Customer name"
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

              <View className="gap-2">
                <Text className="body-sm text-muted">Phone, optional</Text>
                <TextInput
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    if (phoneError) {
                      setPhoneError("");
                    }
                    if (saveError) {
                      setSaveError("");
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  inputMode="tel"
                  returnKeyType="done"
                  onSubmitEditing={saveCustomer}
                  placeholder="0801 234 5678"
                  placeholderTextColor={colors.muted}
                  accessibilityLabel="Phone number, optional"
                  maxLength={20}
                  underlineColorAndroid="transparent"
                  className="body-lg rounded-2xl border border-border bg-background px-4 text-foreground"
                  style={styles.field}
                />
                {phoneError ? (
                  <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                    {phoneError}
                  </Text>
                ) : null}
              </View>

              {configError ? (
                <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                  {configError} Nothing was saved.
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save customer"
                accessibilityState={{ disabled: saving, busy: saving }}
                disabled={saving}
                onPress={() => {
                  void saveCustomer();
                }}
                className="min-h-12 items-center justify-center rounded-2xl bg-emerald px-4"
                style={({ pressed }) => [styles.curve, pressed || saving ? styles.pressed : null]}
              >
                <Text className="h4 text-on-accent">{saving ? "Saving" : "Save customer"}</Text>
              </Pressable>
              {saveError ? (
                <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                  {saveError}
                </Text>
              ) : null}
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
  back: {
    minHeight: spacing.touch,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingRight: spacing.md,
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

import { VariableContextProvider } from "nativewind";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { motion, semantic, semanticToVariables, shadows, spacing } from "@/theme";

const CODE_LENGTH = 6;

type VerificationCodeModalProps = {
  email: string;
  errorMessage: string;
  busy: boolean;
  codeReset: number;
  onClose: () => void;
  onComplete: (code: string) => void;
  onResend: () => void;
};

export function VerificationCodeModal({
  email,
  errorMessage,
  busy,
  codeReset,
  onClose,
  onComplete,
  onResend,
}: VerificationCodeModalProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;
  const inputRef = useRef<TextInput>(null);
  const submitted = useRef(false);
  const pendingCode = useRef("");
  const onCompleteRef = useRef(onComplete);
  const seenReset = useRef(codeReset);
  const [code, setCode] = useState("");

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, motion.base);

    return () => clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (seenReset.current === codeReset) {
      return;
    }

    seenReset.current = codeReset;
    submitted.current = false;
    pendingCode.current = "";
    setCode("");
    inputRef.current?.focus();
  }, [codeReset]);

  useEffect(() => {
    if (busy || submitted.current || pendingCode.current.length < CODE_LENGTH) {
      return;
    }

    const next = pendingCode.current;
    pendingCode.current = "";
    submitted.current = true;
    onCompleteRef.current(next);
  }, [busy]);

  function handleChange(value: string) {
    const next = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(next);

    if (next.length < CODE_LENGTH) {
      submitted.current = false;
      pendingCode.current = "";
      return;
    }

    if (submitted.current) {
      return;
    }

    if (busy) {
      pendingCode.current = next;
      return;
    }

    submitted.current = true;
    pendingCode.current = "";
    onComplete(next);
  }

  const activeIndex = Math.min(code.length, CODE_LENGTH - 1);

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <VariableContextProvider value={semanticToVariables(colors)}>
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
          style={styles.avoid}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close verification"
            onPress={onClose}
            style={styles.backdrop}
          />
          <View
            className="rounded-t-3xl bg-background px-6 pt-3"
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, spacing.md) },
            ]}
          >
            <View className="mb-2 h-1.5 w-10 self-center rounded-full bg-border" />
            <View className="flex-row items-start justify-between gap-3">
              <Text className="h3 flex-1 text-foreground">Check your email</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                style={({ pressed }) => [styles.close, pressed ? styles.pressed : null]}
              >
                <Text className="h4 text-accent">Close</Text>
              </Pressable>
            </View>
            <Text className="body mt-2 text-muted" selectable>
              You&apos;ve received an email at {email}. Enter the 6-digit verification code.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send a new code"
              accessibilityState={{ disabled: busy, busy }}
              disabled={busy}
              onPress={onResend}
              style={({ pressed }) => [styles.resend, pressed || busy ? styles.pressed : null]}
            >
              <Text className="h4 text-accent">Send a new code</Text>
            </Pressable>
  
            <View className="relative mt-5">
              <View className="flex-row gap-2" pointerEvents="none">
                {Array.from({ length: CODE_LENGTH }, (_, index) => {
                  const digit = code[index] ?? "";
                  const isActive = index === activeIndex && code.length < CODE_LENGTH;
                  return (
                    <View
                      key={index}
                      className={`h-14 flex-1 items-center justify-center rounded-xl border bg-surface ${
                        isActive ? "border-2 border-accent" : "border-border"
                      }`}
                      style={styles.box}
                    >
                      <Text className="h3 text-foreground" style={styles.digit}>
                        {digit}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={CODE_LENGTH}
                caretHidden
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                importantForAutofill="yes"
                accessibilityLabel="6-digit verification code"
                accessibilityHint="Uses the number pad. The code is checked after the sixth digit."
                editable={!busy}
                style={styles.input}
              />
            </View>
            {errorMessage ? (
              <Text className="body-sm mt-3 text-critical" accessibilityLiveRegion="polite">
                {errorMessage}
              </Text>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </VariableContextProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  avoid: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(15, 20, 25, 0.45)",
  },
  sheet: {
    borderCurve: "continuous",
    boxShadow: shadows.overlay,
  },
  resend: {
    minHeight: spacing.touch,
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: spacing.sm,
  },
  close: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  box: {
    borderCurve: "continuous",
  },
  digit: {
    fontVariant: ["tabular-nums"],
  },
  input: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    color: "transparent",
    backgroundColor: "transparent",
  },
});

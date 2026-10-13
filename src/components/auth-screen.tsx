import { Link } from "expo-router";
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

import { useClerkAuthForm } from "@/hooks/use-clerk-auth-form";
import { semantic, spacing } from "@/theme";

import { VerificationCodeModal } from "./verification-code-modal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the password length required by this Clerk instance.
const MIN_PASSWORD_LENGTH = 15;

type AuthMode = "sign-up" | "sign-in";

const copy = {
  "sign-up": {
    lead: "Create your",
    accent: "account",
    body: "Keep a clear record of who owes you, and send a polite reminder when it is time to pay.",
    action: "Create account",
    footer: "Already have an account?",
    footerAction: "Sign in",
    footerHref: "/sign-in" as const,
  },
  "sign-in": {
    lead: "Welcome",
    accent: "back",
    body: "Sign in with your email to open the ledger for your customers.",
    action: "Sign in",
    footer: "New to LedgerBook?",
    footerAction: "Create an account",
    footerHref: "/sign-up" as const,
  },
} as const;

type AuthScreenProps = {
  mode: AuthMode;
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;
  const screen = copy[mode];
  const isSignUp = mode === "sign-up";

  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const auth = useClerkAuthForm(mode);
  const shownEmailError = emailError || auth.clerkEmailError;
  const shownPasswordError = passwordError || auth.clerkPasswordError;

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
    auth.clearClerkErrors();
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (passwordError) {
      setPasswordError("");
    }
    auth.clearClerkErrors();
  }

  function submitEmail() {
    const nextEmail = email.trim();
    const emailOk = EMAIL_PATTERN.test(nextEmail);
    const passwordOk = !isSignUp || password.length >= MIN_PASSWORD_LENGTH;

    setEmailError(emailOk ? "" : "Enter a valid email address.");
    setPasswordError(
      passwordOk ? "" : `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
    auth.clearClerkErrors();

    if (!emailOk || !passwordOk || auth.busy) {
      return;
    }

    Keyboard.dismiss();
    void auth.startWithEmail(nextEmail, password);
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
                  <Text className="h1 text-foreground">{screen.lead}</Text>
                  <Text className="h1 text-accent">{screen.accent}</Text>
                </View>
                <Text className="body-lg text-muted">{screen.body}</Text>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="body-sm text-muted">Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={handleEmailChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    inputMode="email"
                    returnKeyType={isSignUp ? "next" : "done"}
                    onSubmitEditing={isSignUp ? () => passwordRef.current?.focus() : submitEmail}
                    placeholder="you@shop.com"
                    placeholderTextColor={colors.muted}
                    accessibilityLabel="Email"
                    underlineColorAndroid="transparent"
                    className="body-lg rounded-2xl border border-border bg-background px-4 text-foreground"
                    style={styles.field}
                  />
                  {shownEmailError ? (
                    <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                      {shownEmailError}
                    </Text>
                  ) : null}
                </View>

                {isSignUp ? (
                  <View className="gap-2">
                    <Text className="body-sm text-muted">Password</Text>
                    <View className="flex-row items-center rounded-2xl border border-border bg-background" style={styles.curve}>
                      <TextInput
                        ref={passwordRef}
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!passwordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password-new"
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={submitEmail}
                        placeholder="At least 15 characters"
                        placeholderTextColor={colors.muted}
                        accessibilityLabel="Password"
                        underlineColorAndroid="transparent"
                        className="body-lg flex-1 px-4 text-foreground"
                        style={styles.passwordField}
                      />
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
                        onPress={() => setPasswordVisible((current) => !current)}
                        style={({ pressed }) => [styles.reveal, pressed ? styles.pressed : null]}
                      >
                        <Text className="h4 text-accent">{passwordVisible ? "Hide" : "Show"}</Text>
                      </Pressable>
                    </View>
                    {shownPasswordError ? (
                      <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                        {shownPasswordError}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={screen.action}
                  accessibilityState={{ disabled: auth.busy, busy: auth.busy }}
                  disabled={auth.busy}
                  onPress={submitEmail}
                  className="min-h-12 items-center justify-center rounded-2xl bg-emerald px-4"
                  style={({ pressed }) => [
                    styles.curve,
                    pressed || auth.busy ? styles.pressed : null,
                  ]}
                >
                  <Text className="h4 text-on-accent">{screen.action}</Text>
                </Pressable>
                {auth.formError ? (
                  <Text className="body-sm text-critical" accessibilityLiveRegion="polite">
                    {auth.formError}
                  </Text>
                ) : null}
                <View nativeID="clerk-captcha" />
              </View>

              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="divider flex-1" />
                  <Text className="body-sm text-muted">or continue with</Text>
                  <View className="divider flex-1" />
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Google"
                  accessibilityState={{ disabled: auth.busy, busy: auth.busy }}
                  disabled={auth.busy}
                  onPress={() => {
                    void auth.continueWithProvider("Google");
                  }}
                  className="min-h-12 items-center justify-center rounded-2xl border border-border bg-background px-4"
                  style={({ pressed }) => [
                    styles.curve,
                    pressed || auth.busy ? styles.pressed : null,
                  ]}
                >
                  <Text className="h4 text-foreground">Continue with Google</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Apple"
                  accessibilityState={{ disabled: auth.busy, busy: auth.busy }}
                  disabled={auth.busy}
                  onPress={() => {
                    void auth.continueWithProvider("Apple");
                  }}
                  className="min-h-12 items-center justify-center rounded-2xl border border-border bg-background px-4"
                  style={({ pressed }) => [
                    styles.curve,
                    pressed || auth.busy ? styles.pressed : null,
                  ]}
                >
                  <Text className="h4 text-foreground">Continue with Apple</Text>
                </Pressable>

                {auth.socialNotice ? (
                  <Text className="body-sm text-center text-muted" accessibilityLiveRegion="polite">
                    {auth.socialNotice}
                  </Text>
                ) : null}
              </View>

              <View className="flex-row flex-wrap items-center justify-center">
                <Text className="body text-muted">{screen.footer} </Text>
                <Link href={screen.footerHref} asChild>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={screen.footerAction}
                    style={({ pressed }) => [styles.footerLink, pressed ? styles.pressed : null]}
                  >
                    <Text className="h4 text-accent">{screen.footerAction}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {auth.verificationOpen ? (
        <VerificationCodeModal
          email={auth.verifiedEmail}
          errorMessage={auth.codeError}
          busy={auth.busy}
          codeReset={auth.codeReset}
          onClose={auth.closeVerification}
          onComplete={(code) => {
            void auth.verifyCode(code);
          }}
          onResend={() => {
            void auth.resendCode();
          }}
        />
      ) : null}
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
  passwordField: {
    minHeight: spacing.touch,
  },
  curve: {
    borderCurve: "continuous",
  },
  reveal: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  footerLink: {
    minHeight: spacing.touch,
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});

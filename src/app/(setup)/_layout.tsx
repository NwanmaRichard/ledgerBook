import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

import { useAccountSettings, useSettingsStore } from "@/store/settings-store";

export default function SetupLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const hydrated = useSettingsStore((state) => state.hydrated);
  const account = useAccountSettings(userId);

  if (!isLoaded || !hydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  if (account) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

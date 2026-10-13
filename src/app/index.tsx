import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

import { useAccountSettings, useSettingsStore } from "@/store/settings-store";

export default function Index() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const hydrated = useSettingsStore((state) => state.hydrated);
  const hasSeenOnboarding = useSettingsStore((state) => state.hasSeenOnboarding);
  const account = useAccountSettings(userId);

  if (!isLoaded || !hydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={hasSeenOnboarding ? "/sign-in" : "/onboarding"} />;
  }

  if (!account) {
    return <Redirect href="/setup" />;
  }

  return <Redirect href="/customers" />;
}

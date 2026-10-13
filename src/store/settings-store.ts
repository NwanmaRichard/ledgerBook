import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import { type CurrencyCode } from "@/constants/currencies";

const serverStorage: StateStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

function settingsStorage(): StateStorage {
  // AsyncStorage's web build touches `window`. Expo's server render has none.
  if (Platform.OS === "web" && typeof window === "undefined") {
    return serverStorage;
  }

  return AsyncStorage;
}

export type AccountSettings = {
  businessName: string;
  currencyCode: CurrencyCode;
};

type PersistedSettings = {
  hasSeenOnboarding: boolean;
  accounts: Record<string, AccountSettings>;
};

type SettingsState = PersistedSettings & {
  hydrated: boolean;
  markOnboardingSeen: () => void;
  saveBusinessSetup: (userId: string, settings: AccountSettings) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hydrated: false,
      hasSeenOnboarding: false,
      accounts: {},
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
      saveBusinessSetup: (userId, settings) =>
        set((state) => ({
          accounts: {
            ...state.accounts,
            [userId]: {
              businessName: settings.businessName,
              currencyCode: settings.currencyCode,
            },
          },
        })),
    }),
    {
      name: "ledgerbook-settings",
      storage: createJSONStorage(settingsStorage),
      partialize: (state): PersistedSettings => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
        accounts: state.accounts,
      }),
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ hydrated: true });
      },
    },
  ),
);

export function useAccountSettings(userId: string | null | undefined) {
  return useSettingsStore((state) => (userId ? state.accounts[userId] : undefined));
}

import { Slot } from "expo-router";
import { View } from "react-native";

import { AppTabBar } from "@/components/app-tab-bar";

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-background">
      <View className="min-h-0 flex-1">
        <Slot />
      </View>
      <AppTabBar />
    </View>
  );
}

import { Text, View } from "react-native";

import { shadows } from "@/theme";

function PersonMark() {
  return (
    <View className="items-center">
      <View className="h-3.5 w-3.5 rounded-full bg-emerald" />
      <View className="mt-0.5 h-2 w-5 rounded-t-full bg-emerald" />
    </View>
  );
}

export function CustomersEmptyArt() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-52 w-full items-center justify-center"
    >
      <View
        className="absolute bg-accent-soft"
        style={{
          width: 210,
          height: 150,
          borderRadius: 999,
          transform: [{ scaleX: 1.15 }, { rotate: "-8deg" }],
        }}
      />
      <View
        className="w-40 rounded-3xl border border-border bg-background px-4 pb-5 pt-4"
        style={{ borderCurve: "continuous", boxShadow: shadows.overlay }}
      >
        <View className="flex-row justify-center gap-4">
          <PersonMark />
          <PersonMark />
        </View>
        <View className="mt-4 gap-2">
          <View className="h-2 w-full rounded-full bg-accent-soft" />
          <View className="h-2 w-4/5 rounded-full bg-accent-soft" />
          <View className="h-2 w-3/5 rounded-full bg-accent-soft" />
        </View>
      </View>
      <View
        className="absolute bottom-6 right-[22%] h-12 w-12 items-center justify-center rounded-full bg-emerald"
        style={{ boxShadow: shadows.raised }}
      >
        <Text className="h2 text-on-accent">+</Text>
      </View>
    </View>
  );
}

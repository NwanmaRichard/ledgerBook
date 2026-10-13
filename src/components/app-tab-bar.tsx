import { SymbolView } from "expo-symbols";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { semantic, spacing } from "@/theme";

const tabs = [
  {
    href: "/home",
    label: "Home",
    ios: "house.fill",
    android: "home",
  },
  {
    href: "/customers",
    label: "Customers",
    ios: "person.2.fill",
    android: "group",
  },
  {
    href: "/record",
    label: "Record",
    ios: "plus.circle.fill",
    android: "add_circle",
  },
  {
    href: "/settings",
    label: "Settings",
    ios: "gearshape.fill",
    android: "settings",
  },
] as const;

export function AppTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;

  return (
    <View
      className="flex-row border-t border-border bg-background"
      style={{ paddingBottom: Math.max(insets.bottom, spacing.sm) }}
    >
      {tabs.map((tab) => {
        const selected = pathname === tab.href;
        const tint = selected ? colors.accent : colors.muted;

        return (
          <Pressable
            key={tab.href}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) {
                router.navigate(tab.href);
              }
            }}
            className="flex-1 items-center justify-center"
            style={({ pressed }) => [styles.tab, pressed ? styles.pressed : null]}
          >
            <SymbolView
              name={{ ios: tab.ios, android: tab.android, web: tab.android }}
              tintColor={tint}
              size={24}
            />
            <Text className={`caption mt-1 ${selected ? "text-accent" : "text-muted"}`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    minHeight: spacing.touch + 16,
    paddingTop: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});

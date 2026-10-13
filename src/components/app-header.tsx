import { Image } from "expo-image";
import { View } from "react-native";

import { images } from "@/constants/images";

export function AppHeader() {
  return (
    <View className="px-6 pb-2 pt-2">
      <Image
        source={images.logo}
        contentFit="contain"
        accessibilityLabel="LedgerBook"
        style={{ width: 148, height: 36 }}
      />
    </View>
  );
}

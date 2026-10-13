import { Text } from "react-native";

import { type CurrencyCode } from "@/constants/currencies";
import { formatMoney } from "@/lib/money";

type MoneyTextProps = {
  amountMinor: number;
  currencyCode: CurrencyCode;
  className?: string;
};

export function MoneyText({ amountMinor, currencyCode, className }: MoneyTextProps) {
  return <Text className={className}>{formatMoney(amountMinor, currencyCode)}</Text>;
}

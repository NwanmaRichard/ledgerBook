export const currencies = [
  { code: "NGN", name: "Nigerian naira" },
  { code: "GHS", name: "Ghanaian cedi" },
  { code: "KES", name: "Kenyan shilling" },
  { code: "USD", name: "US dollar" },
  { code: "GBP", name: "British pound" },
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];

export const defaultCurrencyCode: CurrencyCode = "NGN";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return currencies.some((currency) => currency.code === value);
}

export function currencyLabel(code: CurrencyCode) {
  const match = currencies.find((currency) => currency.code === code);
  return match ? `${match.name} (${match.code})` : code;
}

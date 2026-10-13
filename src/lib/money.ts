import type { CurrencyCode } from "../constants/currencies";

const symbols: Record<CurrencyCode, string> = {
  NGN: "₦",
  GHS: "GH₵",
  KES: "KSh",
  USD: "$",
  GBP: "£",
};

function currencySymbol(currencyCode: CurrencyCode) {
  return symbols[currencyCode];
}

const GROUPING = new Intl.NumberFormat("en-NG");

export type MoneyParseResult =
  | { ok: true; amountMinor: number }
  | { ok: false; error: string };

/**
 * Formats an integer amount in minor units (kobo for naira).
 * Whole amounts omit the decimal part. Amounts with kobo keep two digits.
 */
export function formatMoney(amountMinor: number, currencyCode: CurrencyCode) {
  if (!Number.isSafeInteger(amountMinor)) {
    throw new Error("Money amounts must be safe integers in minor units.");
  }

  const negative = amountMinor < 0;
  const absolute = Math.abs(amountMinor);
  const major = Math.trunc(absolute / 100);
  const minor = absolute % 100;
  const grouped = GROUPING.format(major);
  const decimals = minor === 0 ? "" : `.${String(minor).padStart(2, "0")}`;
  const sign = negative ? "-" : "";

  return `${sign}${currencySymbol(currencyCode)}${grouped}${decimals}`;
}

/**
 * Parses a typed amount into integer minor units.
 * "1,500" is 150000 kobo. "10.5" is 1050 kobo. More than two decimal places is rejected.
 */
export function parseMoneyInput(value: string): MoneyParseResult {
  const cleaned = value.trim().replace(/[₦$£,\s]/g, "").replace(/GH₵/g, "").replace(/KSh/g, "");

  if (!cleaned) {
    return { ok: false, error: "Enter an amount." };
  }

  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) {
    return { ok: false, error: "Enter an amount like 1500 or 1500.50." };
  }

  const [whole = "0", fraction = ""] = cleaned.split(".");
  const major = Number(whole);
  const minor = Number((fraction + "00").slice(0, 2));

  if (!Number.isSafeInteger(major) || major > Number.MAX_SAFE_INTEGER / 100) {
    return { ok: false, error: "That amount is too large." };
  }

  return { ok: true, amountMinor: major * 100 + minor };
}

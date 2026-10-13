import assert from "node:assert/strict";
import test from "node:test";

import { formatMoney, parseMoneyInput } from "./money.ts";

test("formatMoney groups whole naira and hides zero kobo", () => {
  assert.equal(formatMoney(125_000_000, "NGN"), "₦1,250,000");
  assert.equal(formatMoney(0, "NGN"), "₦0");
});

test("formatMoney keeps kobo and a leading minus", () => {
  assert.equal(formatMoney(1050, "NGN"), "₦10.50");
  assert.equal(formatMoney(-250, "USD"), "-$2.50");
});

test("parseMoneyInput reads grouped and decimal amounts as integer kobo", () => {
  assert.deepEqual(parseMoneyInput("1,500"), { ok: true, amountMinor: 150_000 });
  assert.deepEqual(parseMoneyInput("10.5"), { ok: true, amountMinor: 1050 });
  assert.deepEqual(parseMoneyInput("₦10.50"), { ok: true, amountMinor: 1050 });
});

test("parseMoneyInput rejects empty, extra decimals, and words", () => {
  assert.equal(parseMoneyInput("  ").ok, false);
  assert.equal(parseMoneyInput("10.505").ok, false);
  assert.equal(parseMoneyInput("ten").ok, false);
});

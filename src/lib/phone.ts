/** Blank is allowed. A filled number needs 10 to 15 digits. */
export function customerPhoneError(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return "Enter a phone number with 10 to 15 digits, or leave it blank.";
  }

  return "";
}

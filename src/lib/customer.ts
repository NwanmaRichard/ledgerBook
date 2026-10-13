const MIN_LENGTH = 2;
const MAX_LENGTH = 60;

export function normalizeCustomerName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function customerNameError(value: string) {
  const name = normalizeCustomerName(value);

  if (name.length < MIN_LENGTH) {
    return "Enter the customer's name.";
  }

  if (name.length > MAX_LENGTH) {
    return "Use 60 characters or fewer.";
  }

  return "";
}

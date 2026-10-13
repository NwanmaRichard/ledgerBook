const MIN_LENGTH = 2;
const MAX_LENGTH = 60;

export function normalizeBusinessName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function businessNameError(value: string) {
  const name = normalizeBusinessName(value);

  if (name.length < MIN_LENGTH) {
    return "Enter your business name.";
  }

  if (name.length > MAX_LENGTH) {
    return "Use 60 characters or fewer.";
  }

  return "";
}

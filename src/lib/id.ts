type RandomSource = {
  randomUUID?: () => string;
};

function bytesToUuid(bytes: Uint8Array) {
  const next = new Uint8Array(bytes);
  next[6] = (next[6] & 0x0f) | 0x40;
  next[8] = (next[8] & 0x3f) | 0x80;
  const hex = Array.from(next, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function randomBytes() {
  const bytes = new Uint8Array(16);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

function readCrypto(): RandomSource | undefined {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi || typeof cryptoApi.randomUUID !== "function") {
    return undefined;
  }

  return {
    randomUUID: () => cryptoApi.randomUUID(),
  };
}

/**
 * Stable customer id. Hermes does not provide a `crypto` global, and reading
 * that name throws, so this only touches `globalThis.crypto` when it exists.
 */
export function createId(source?: RandomSource): string {
  const random = source === undefined ? readCrypto() : source;
  if (typeof random?.randomUUID === "function") {
    return random.randomUUID();
  }

  return bytesToUuid(randomBytes());
}

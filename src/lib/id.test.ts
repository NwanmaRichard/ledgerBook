import assert from "node:assert/strict";
import test from "node:test";

import { createId } from "./id.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("createId uses crypto.randomUUID when the runtime provides it", () => {
  assert.match(createId(), UUID_PATTERN);
});

test("createId still returns a uuid when the crypto global is absent", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: undefined,
  });

  try {
    const id = createId();
    assert.match(id, UUID_PATTERN);
  } finally {
    if (descriptor) {
      Object.defineProperty(globalThis, "crypto", descriptor);
    }
  }
});

import { useAuth } from "@clerk/expo";
import { useMemo, useRef } from "react";

import { createLedgerClient, ledgerConfigError } from "@/lib/supabase";

export function useLedgerClient() {
  const { getToken } = useAuth();
  const configError = ledgerConfigError();
  const getTokenRef = useRef(getToken);
  // Keep this hook's token reader current before effects run. Supabase calls it
  // only when a request starts, so the ref is not read while rendering.
  // eslint-disable-next-line react-hooks/refs -- latest token must be stored before effects
  getTokenRef.current = getToken;

  const client = useMemo(() => {
    if (configError) {
      return null;
    }

    // eslint-disable-next-line react-hooks/refs -- callback runs on request, not during render
    return createLedgerClient(() => getTokenRef.current());
  }, [configError]);

  return { client, configError };
}

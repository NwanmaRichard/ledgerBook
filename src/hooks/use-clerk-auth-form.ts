import { useSignIn, useSignUp } from "@clerk/expo";
import { useSSO } from "@clerk/expo/experimental";
import { router } from "expo-router";
import { useRef, useState } from "react";

type AuthMode = "sign-in" | "sign-up";
type SocialProvider = "Google" | "Apple";

const CONNECTION_MESSAGE = "Check your connection and try again.";

function messageFromUnknown(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const record = error as { longMessage?: unknown; message?: unknown };
  const longMessage = typeof record.longMessage === "string" ? record.longMessage : "";
  const message = typeof record.message === "string" ? record.message : "";
  const readable = longMessage || message;

  if (!readable) {
    return fallback;
  }

  if (/network|failed to fetch|internet|offline/i.test(readable)) {
    return CONNECTION_MESSAGE;
  }

  return readable;
}

function isPasswordError(code: string) {
  return code.includes("password");
}

function isEmailError(code: string) {
  return code.includes("email") || code.includes("identifier");
}

/**
 * Connects the existing email, password, code, and social controls to Clerk.
 * Sign-in uses an email code because that screen collects an email, then a code.
 * Sign-up collects a password first, then verifies the email.
 */
export function useClerkAuthForm(mode: AuthMode) {
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const verificationOpenRef = useRef(false);
  const requestLock = useRef(false);

  const [clerkEmailError, setClerkEmailError] = useState("");
  const [clerkPasswordError, setClerkPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [socialNotice, setSocialNotice] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeReset, setCodeReset] = useState(0);
  const [pending, setPending] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const busy =
    pending || signInStatus === "fetching" || signUpStatus === "fetching";

  function openVerification(email: string) {
    verificationOpenRef.current = true;
    setCodeError("");
    setVerifiedEmail(email);
    setVerificationOpen(true);
  }

  function clearClerkErrors() {
    setClerkEmailError("");
    setClerkPasswordError("");
    setFormError("");
    setSocialNotice("");
  }

  function report(message: string) {
    if (verificationOpenRef.current) {
      setCodeError(message);
      setCodeReset((current) => current + 1);
      return;
    }

    setFormError(message);
  }

  function assignClerkError(error: { code?: string; longMessage?: string; message?: string }) {
    const message = messageFromUnknown(error, "Check your details and try again.");
    const code = error.code ?? "";

    if (isPasswordError(code)) {
      setClerkPasswordError(message);
      return;
    }

    if (isEmailError(code)) {
      setClerkEmailError(message);
      return;
    }

    setFormError(message);
  }

  function navigateHome({
    session,
    decorateUrl,
  }: {
    session: { currentTask?: unknown };
    decorateUrl: (url: string) => string;
  }) {
    if (session.currentTask) {
      report("Your account needs one more step before LedgerBook can open.");
      return;
    }

    const destination = decorateUrl("/");
    if (destination.startsWith("http")) {
      if (typeof window !== "undefined") {
        window.location.href = destination;
      }
      return;
    }

    router.replace("/");
  }

  async function finishSignIn() {
    if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
      const emailFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (!emailFactor) {
        report("This account needs another verification step. Use email to continue.");
        return;
      }

      const { error } = await signIn.mfa.sendEmailCode();
      if (error) {
        report(messageFromUnknown(error, "We could not send a verification code. Try again."));
        return;
      }

      setCodeReset((current) => current + 1);
      openVerification(signIn.identifier ?? verifiedEmail);
      return;
    }

    if (signIn.status !== "complete") {
      report("We could not finish signing you in. Try again.");
      return;
    }

    const { error } = await signIn.finalize({ navigate: navigateHome });
    if (error) {
      report(messageFromUnknown(error, "We could not finish signing you in. Try again."));
    }
  }

  async function startWithEmail(email: string, password: string) {
    if (requestLock.current) {
      return;
    }

    requestLock.current = true;
    setPending(true);
    clearClerkErrors();

    try {
      if (mode === "sign-up") {
        await signUp.reset();
        const { error } = await signUp.password({ emailAddress: email, password });
        if (error) {
          assignClerkError(error);
          return;
        }

        if (signUp.status === "complete") {
          const { error: finalizeError } = await signUp.finalize({ navigate: navigateHome });
          if (finalizeError) {
            assignClerkError(finalizeError);
          }
          return;
        }

        if (!signUp.unverifiedFields.includes("email_address")) {
          setFormError("We could not start your account. Try again.");
          return;
        }

        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
          assignClerkError(sendError);
          return;
        }
      } else {
        await signIn.reset();
        const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
        if (error) {
          assignClerkError(error);
          return;
        }

        if (signIn.status === "complete") {
          await finishSignIn();
          return;
        }
      }

      openVerification(email);
    } catch (error) {
      setFormError(messageFromUnknown(error, CONNECTION_MESSAGE));
    } finally {
      requestLock.current = false;
      setPending(false);
    }
  }

  async function verifyCode(code: string) {
    if (requestLock.current) {
      return;
    }

    requestLock.current = true;
    setPending(true);
    setCodeError("");

    try {
      if (mode === "sign-up") {
        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) {
          report(messageFromUnknown(error, "That code is not valid. Try again."));
          return;
        }

        if (signUp.status !== "complete") {
          report("We could not finish creating your account. Try again.");
          return;
        }

        const { error: finalizeError } = await signUp.finalize({ navigate: navigateHome });
        if (finalizeError) {
          report(messageFromUnknown(finalizeError, "We could not finish creating your account. Try again."));
        }
        return;
      }

      const needsExtraCode =
        signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor";
      const { error } = needsExtraCode
        ? await signIn.mfa.verifyEmailCode({ code })
        : await signIn.emailCode.verifyCode({ code });

      if (error) {
        report(messageFromUnknown(error, "That code is not valid. Try again."));
        return;
      }

      await finishSignIn();
    } catch (error) {
      report(messageFromUnknown(error, CONNECTION_MESSAGE));
    } finally {
      requestLock.current = false;
      setPending(false);
    }
  }

  async function resendCode() {
    if (requestLock.current) {
      return;
    }

    requestLock.current = true;
    setPending(true);
    setCodeError("");

    try {
      if (mode === "sign-up") {
        const { error } = await signUp.verifications.sendEmailCode();
        if (error) {
          report(messageFromUnknown(error, "We could not send a new code. Try again."));
          return;
        }
      } else if (
        signIn.status === "needs_client_trust" ||
        signIn.status === "needs_second_factor"
      ) {
        const { error } = await signIn.mfa.sendEmailCode();
        if (error) {
          report(messageFromUnknown(error, "We could not send a new code. Try again."));
          return;
        }
      } else {
        const { error } = await signIn.emailCode.sendCode();
        if (error) {
          report(messageFromUnknown(error, "We could not send a new code. Try again."));
          return;
        }
      }

      setCodeReset((current) => current + 1);
    } catch (error) {
      report(messageFromUnknown(error, CONNECTION_MESSAGE));
    } finally {
      requestLock.current = false;
      setPending(false);
    }
  }

  function closeVerification() {
    verificationOpenRef.current = false;
    setVerificationOpen(false);
    setCodeError("");
    void signIn.reset();
    void signUp.reset();
  }

  async function continueWithProvider(provider: SocialProvider) {
    if (requestLock.current) {
      return;
    }

    requestLock.current = true;
    setPending(true);
    clearClerkErrors();

    try {
      const result = await startSSOFlow({
        strategy: provider === "Google" ? "oauth_google" : "oauth_apple",
      });

      if (result.authSessionResult && result.authSessionResult.type !== "success") {
        return;
      }

      if (result.createdSessionId) {
        router.replace("/");
        return;
      }

      if (result.signUp?.status === "missing_requirements") {
        setSocialNotice(
          `${provider} did not share everything needed to finish. Use your email to continue.`,
        );
        return;
      }

      setSocialNotice(`We could not continue with ${provider}. Use your email to continue.`);
    } catch (error) {
      setSocialNotice(messageFromUnknown(error, `We could not continue with ${provider}. Use your email to continue.`));
    } finally {
      requestLock.current = false;
      setPending(false);
    }
  }

  return {
    clerkEmailError,
    clerkPasswordError,
    formError,
    socialNotice,
    codeError,
    codeReset,
    busy,
    verificationOpen,
    verifiedEmail,
    startWithEmail,
    verifyCode,
    resendCode,
    closeVerification,
    continueWithProvider,
    clearClerkErrors,
  };
}

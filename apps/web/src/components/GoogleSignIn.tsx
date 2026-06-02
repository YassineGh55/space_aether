import type { ReactNode } from "react";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  if (!clientId) return <>{children}</>;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}

function authErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.error;
    if (typeof msg === "string") return msg;
    if (msg && typeof msg === "object") return "Google sign-in request failed";
  }
  return "Google sign-in failed. Please try again.";
}

export default function GoogleSignInButton() {
  const googleAuth = useGoogleAuth();
  const navigate = useNavigate();
  const [popupError, setPopupError] = useState<string | null>(null);

  if (!clientId) {
    return (
      <p className="font-mono text-xs text-zinc-500 text-center leading-relaxed">
        Google sign-in is not configured. Add{" "}
        <code className="text-cyan-500/80">GOOGLE_CLIENT_ID</code> to{" "}
        <code className="text-cyan-500/80">apps/api/.env</code> and restart the dev servers.
      </p>
    );
  }

  async function handleSuccess(res: CredentialResponse) {
    if (!res.credential) return;
    try {
      await googleAuth.mutateAsync(res.credential);
      navigate("/dashboard");
    } catch {
      // error rendered below via googleAuth.error
    }
  }

  const errorMsg = googleAuth.error ? authErrorMessage(googleAuth.error) : null;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full flex justify-center overflow-hidden">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setPopupError("Google sign-in was cancelled or blocked")}
          useOneTap={false}
          theme="filled_black"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
        />
      </div>
      {googleAuth.isPending && (
        <p className="font-mono text-xs text-zinc-500">Signing in with Google…</p>
      )}
      {errorMsg && (
        <p className="text-red-400 text-sm font-mono text-center">{errorMsg}</p>
      )}
      {popupError && (
        <p className="text-red-400 text-sm font-mono text-center">{popupError}</p>
      )}
    </div>
  );
}

export function AuthDivider() {
  if (!clientId) return null;
  return (
    <div className="flex items-center gap-4 my-6">
      <span className="h-px flex-1 bg-zinc-800" />
      <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-600">or</span>
      <span className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

import Link from "next/link";
import { requestPasswordResetAction } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; sent?: string }> }) {
  const { error, sent } = await searchParams;
  const message = error === "not-configured"
    ? "Authentication is not connected to this deployment yet."
    : error
      ? "We could not send the reset email. Check the address and email settings, then try again."
      : null;
  const configured = isSupabaseConfigured();

  return <section className="auth-page wrap"><div className="auth-card">
    <div className="eyebrow">Account recovery</div><h1>Reset your password</h1>
    <p>Enter the email address associated with your account. We will send a secure reset link.</p>
    {message && <p className="auth-alert" role="alert">{message}</p>}
    {sent && <p className="auth-success" role="status">If an account exists for that address, a password reset email has been sent.</p>}
    <form action={requestPasswordResetAction} className="auth-form">
      <label htmlFor="reset-email">Email address</label>
      <input id="reset-email" name="email" type="email" autoComplete="email" required disabled={!configured} />
      <button className="button" type="submit" disabled={!configured}>Send reset link</button>
    </form>
    <p className="auth-switch"><Link href="/login">Return to sign in</Link></p>
  </div></section>;
}

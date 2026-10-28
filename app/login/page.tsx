import Link from "next/link";
import { signInAction } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const messages: Record<string, string> = {
  credentials: "The email address or password was not accepted. Check your details and try again.",
  confirmation: "The confirmation link could not be used. Request a new account confirmation email.",
  "not-configured": "Authentication is not connected yet. The Supabase project settings must be added to Vercel first."
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; checkEmail?: string }> }) {
  const { error, next, checkEmail } = await searchParams;
  const message = error ? messages[error] ?? messages.credentials : null;
  const configured = isSupabaseConfigured();

  return <section className="auth-page wrap">
    <div className="auth-card">
      <div className="eyebrow">Your learning space</div>
      <h1>Sign in</h1>
      <p>Use your email address and password to continue.</p>
      {message && <p className="auth-alert" role="alert">{message}</p>}
      {checkEmail && <p className="auth-success" role="status">Check your email and follow the confirmation link to activate your learner account.</p>}
      {!configured && <p className="auth-alert" role="status">Supabase is not connected to this deployment yet.</p>}
      <form action={signInAction} className="auth-form">
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required disabled={!configured} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required disabled={!configured} />
        <button className="button" type="submit" disabled={!configured}>Sign in</button>
      </form>
      <p className="auth-switch"><Link href="/forgot-password">Forgot your password?</Link></p>
      <p className="auth-switch">New learner? <Link href="/signup">Create a learner account</Link></p>
      <p className="auth-footnote">Staff access is assigned by the platform administrator. It cannot be selected during registration.</p>
    </div>
  </section>;
}

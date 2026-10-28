import Link from "next/link";
import { signUpLearnerAction } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const errorText: Record<string, string> = {
  details: "Complete the required fields. Your password must have at least 8 characters.",
  signup: "We could not create the account. The email may already be registered, or Supabase may need its email settings checked.",
  "not-configured": "Authentication is not connected to this deployment yet."
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; "check-email"?: string }> }) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const error = params.error ? errorText[params.error] ?? errorText.signup : null;

  return <section className="auth-page wrap">
    <div className="auth-card auth-card-wide">
      <div className="eyebrow">Learner registration</div>
      <h1>Create a learner account</h1>
      <p>Guest visitors can browse public pages without an account. Registration creates a learner account only; staff permissions are assigned separately by an administrator.</p>
      {error && <p className="auth-alert" role="alert">{error}</p>}
      {params["check-email"] && <p className="auth-success" role="status">Your account request was received. Check your email and follow the confirmation link before signing in.</p>}
      {!configured && <p className="auth-alert" role="status">Supabase is not connected to this deployment yet.</p>}
      <form action={signUpLearnerAction} className="auth-form">
        <label htmlFor="signup-name">Full name</label>
        <input id="signup-name" name="display_name" autoComplete="name" required disabled={!configured} />
        <label htmlFor="signup-email">Email address</label>
        <input id="signup-email" name="email" type="email" autoComplete="email" required disabled={!configured} />
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={!configured} />
        <label htmlFor="signup-affiliation">Your affiliation</label>
        <select id="signup-affiliation" name="affiliation_category_code" defaultValue="independent" disabled={!configured}>
          <option value="iba">IBA</option>
          <option value="university">Other university</option>
          <option value="acca">ACCA</option>
          <option value="icmap">ICMAP</option>
          <option value="independent">Independent learner</option>
          <option value="other">Other</option>
        </select>
        <label htmlFor="signup-affiliation-name">Institution or membership name <span>(optional)</span></label>
        <input id="signup-affiliation-name" name="affiliation_name" autoComplete="organization" disabled={!configured} />
        <label htmlFor="signup-affiliation-reference">Student or membership number <span>(optional)</span></label>
        <input id="signup-affiliation-reference" name="affiliation_reference" disabled={!configured} />
        <button className="button" type="submit" disabled={!configured}>Create account</button>
      </form>
      <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
    </div>
  </section>;
}

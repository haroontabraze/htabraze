import Link from "next/link";
import { updatePasswordAction } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth/guards";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser("/reset-password");
  const { error } = await searchParams;
  const message = error === "details"
    ? "Enter the same password in both fields. Use at least 8 characters."
    : error
      ? "The password could not be changed. Request a new reset link and try again."
      : null;

  return <section className="auth-page wrap"><div className="auth-card">
    <div className="eyebrow">Account recovery</div><h1>Choose a new password</h1>
    <p>Use at least 8 characters for your new password.</p>
    {message && <p className="auth-alert" role="alert">{message}</p>}
    <form action={updatePasswordAction} className="auth-form">
      <label htmlFor="new-password">New password</label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <label htmlFor="password-confirmation">Confirm new password</label>
      <input id="password-confirmation" name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required />
      <button className="button" type="submit">Update password</button>
    </form>
    <p className="auth-switch"><Link href="/login">Return to sign in</Link></p>
  </div></section>;
}

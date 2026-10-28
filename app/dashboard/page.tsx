import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { signOutAction } from "@/app/auth/actions";

export default async function DashboardPage() {
  const { user } = await requireUser("/dashboard");
  const displayName = user.user_metadata?.display_name || user.email || "learner";

  return <section className="auth-page wrap">
    <div className="auth-card workspace-welcome">
      <div className="eyebrow">My learning space</div>
      <h1>Welcome, {displayName}</h1>
      <p>You are signed in. Your courses and learning progress will appear here when the course and enrolment modules are connected.</p>
      <div className="auth-actions"><Link className="button" href="/courses">Browse courses</Link><Link className="button button-quiet" href="/learning">Learning platform</Link></div>
      <p className="auth-account">Signed in as <strong>{user.email}</strong></p>
      <form action={signOutAction}><button className="text-link auth-signout" type="submit">Sign out</button></form>
    </div>
  </section>;
}

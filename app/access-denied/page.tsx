import Link from "next/link";

export default async function AccessDeniedPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;
  return <section className="auth-page wrap">
    <div className="auth-card">
      <div className="eyebrow">Access permissions</div>
      <h1>That area is not available to this account.</h1>
      <p>{reason === "permissions-not-ready"
        ? "The permission database has not been applied yet. Ask the platform administrator to complete the Supabase setup."
        : "Your account does not currently have permission to open this area. An administrator can assign access for the appropriate course or organisation."}</p>
      <Link className="button" href="/dashboard">Return to my learning</Link>
    </div>
  </section>;
}

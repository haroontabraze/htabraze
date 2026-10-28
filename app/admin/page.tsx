import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { signOutAction } from "@/app/auth/actions";

const areas = [
  { icon: "♙", title: "People and access", text: "Review learner accounts and assign staff roles at the appropriate scope.", href: "/admin/access" },
  { icon: "▤", title: "Programmes and courses", text: "Organise course designs, programmes and scheduled offerings." },
  { icon: "⇄", title: "Enrolments", text: "Add learners, review requests and import a course roster." },
  { icon: "▥", title: "Reports and audit history", text: "Review completion, assessment activity and administrative changes." }
];

export default async function AdminPage() {
  const { user } = await requirePermission("platform.admin", "platform");
  return <div className="workspace-page wrap"><div className="eyebrow">Platform administrator</div><h1>Administration</h1><p className="workspace-intro">Signed in as {user.email}. Your account has platform-wide administrator access.</p><div className="admin-grid">{areas.map((area) => <Link className="admin-card" href={area.href ?? "/admin"} key={area.title}><span className="admin-icon">{area.icon}</span><div><h2>{area.title}</h2><p>{area.text}</p></div><span className="lesson-chevron">›</span></Link>)}</div><div className="prototype-note">The permission foundation is connected. People and access is available now. Course, enrolment and reporting tools will be built as later modules.</div><form action={signOutAction}><button className="text-link auth-signout" type="submit">Sign out</button></form></div>;
}

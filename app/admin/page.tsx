import Link from "next/link";

const areas = [
  { icon: "♙", title: "People and access", text: "Manage learner and staff accounts, roles and course assignments." },
  { icon: "▤", title: "Programmes and courses", text: "Organise course designs, programmes and scheduled offerings." },
  { icon: "⇄", title: "Enrolments", text: "Add learners, review requests and import a course roster." },
  { icon: "▥", title: "Reports and audit history", text: "Review completion, assessment activity and administrative changes." }
];

export default function AdminPage() {
  return <div className="workspace-page wrap"><div className="eyebrow">Administration · prototype</div><h1>Administration</h1><p className="workspace-intro">Manage learning spaces, access and system-wide settings.</p><div className="admin-summary"><div><span>Active learners</span><b>248</b><small>Across 12 course offerings</small></div><div><span>Current offerings</span><b>12</b><small>4 starting soon</small></div><div><span>Completion rate</span><b>72%</b><small>Across active offerings</small></div></div><div className="admin-grid">{areas.map((area) => <Link className="admin-card" href="/admin" key={area.title}><span className="admin-icon">{area.icon}</span><div><h2>{area.title}</h2><p>{area.text}</p></div><span className="lesson-chevron">›</span></Link>)}</div><div className="prototype-note">Administrative actions and reports are sample interface elements. Permission enforcement will be connected to Supabase before real records are used.</div></div>;
}

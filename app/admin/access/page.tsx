import Link from "next/link";
import { grantRoleAction, revokeRoleAction } from "@/app/auth/actions";
import { requirePermission } from "@/lib/auth/guards";

type IdTitle = { id: string; title?: string; name?: string; slug?: string; course_id?: string };

const errorMessages: Record<string, string> = {
  details: "Choose a user, role and valid scope.",
  role: "That role is unavailable. Refresh the page and try again.",
  duplicate: "That user already has this role at this scope.",
  grant: "The role could not be assigned. Check that the user and scope still exist.",
  revoke: "The role could not be removed.",
  "last-admin": "At least one platform administrator must remain. Assign another administrator before removing this one."
};

export default async function AccessManagementPage({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string }> }) {
  const { supabase } = await requirePermission("platform.admin", "platform", null, "/admin/access");
  const params = await searchParams;
  const [peopleResult, rolesResult, assignmentsResult, organisationsResult, programmesResult, coursesResult, offeringsResult] = await Promise.all([
    supabase.from("profiles").select("id,email,display_name,affiliation_category_code,affiliation_name").order("display_name").limit(200),
    supabase.from("roles").select("code,label").eq("is_active", true).order("label"),
    supabase.from("role_assignments").select("id,user_id,role,scope_type,scope_id,created_at").order("created_at", { ascending: false }).limit(500),
    supabase.from("organisations").select("id,name,slug").eq("status", "active").order("name"),
    supabase.from("programmes").select("id,title,slug").order("title"),
    supabase.from("courses").select("id,title,slug").order("title"),
    supabase.from("course_offerings").select("id,title,course_id").order("created_at", { ascending: false })
  ]);

  const queryError = peopleResult.error || rolesResult.error || assignmentsResult.error;
  const people = peopleResult.data ?? [];
  const roles = rolesResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];
  const peopleById = new Map(people.map((person) => [person.id, person] as const));
  const roleNames = new Map(roles.map((role) => [role.code, role.label] as const));
  const courses = (coursesResult.data ?? []) as IdTitle[];
  const courseNames = new Map(courses.map((course) => [course.id, course.title ?? course.slug ?? course.id]));

  const scopeOptions: Array<{ value: string; label: string }> = [
    { value: "platform", label: "Platform-wide · all organisations and courses" },
    ...((organisationsResult.data ?? []) as IdTitle[]).map((item) => ({ value: `organisation:${item.id}`, label: `Organisation · ${item.name ?? item.id}` })),
    ...((programmesResult.data ?? []) as IdTitle[]).map((item) => ({ value: `programme:${item.id}`, label: `Programme · ${item.title ?? item.id}` })),
    ...courses.map((item) => ({ value: `course:${item.id}`, label: `Course · ${item.title ?? item.id}` })),
    ...((offeringsResult.data ?? []) as IdTitle[]).map((item) => ({
      value: `offering:${item.id}`,
      label: `Offering · ${item.title || courseNames.get(item.course_id ?? "") || item.id}`
    }))
  ];

  const scopeLabel = (assignment: { scope_type: string; scope_id: string | null }) => {
    if (assignment.scope_type === "platform") return "Platform-wide";
    const id = assignment.scope_id ?? "";
    if (assignment.scope_type === "organisation") return `Organisation · ${(organisationsResult.data ?? []).find((item) => item.id === id)?.name ?? id}`;
    if (assignment.scope_type === "programme") return `Programme · ${(programmesResult.data ?? []).find((item) => item.id === id)?.title ?? id}`;
    if (assignment.scope_type === "course") return `Course · ${courseNames.get(id) ?? id}`;
    if (assignment.scope_type === "offering") return `Offering · ${(offeringsResult.data ?? []).find((item) => item.id === id)?.title ?? courseNames.get((offeringsResult.data ?? []).find((item) => item.id === id)?.course_id ?? "") ?? id}`;
    return `Own records · ${id}`;
  };

  return <div className="workspace-page wrap access-page">
    <div className="eyebrow">Administration · people and access</div>
    <h1>People and access</h1>
    <p className="workspace-intro">Assign a registered person one or more roles, each at a platform, organisation, programme, course or course-offering scope.</p>
    <Link className="arrow-link access-back" href="/admin">← Back to administration</Link>
    {params.error && <p className="auth-alert" role="alert">{errorMessages[params.error] ?? "The request could not be completed."}</p>}
    {params.updated && <p className="auth-success" role="status">Access assignments have been updated.</p>}
    {queryError && <p className="auth-alert" role="alert">The access information could not be loaded. Confirm that the authentication migration has been applied.</p>}

    <section className="access-panel">
      <div className="section-heading compact-heading"><div><span className="course-kicker">GRANT A ROLE</span><h2>Assign access</h2></div></div>
      {people.length === 0 ? <p>No learner accounts are registered yet. A person must create and confirm an account before you can assign a staff role.</p> : <form action={grantRoleAction} className="access-form">
        <label htmlFor="access-user">Person</label>
        <select id="access-user" name="user_id" required defaultValue="">
          <option value="" disabled>Choose a registered account</option>
          {people.map((person) => <option value={person.id} key={person.id}>{person.display_name || person.email || person.id}{person.email ? ` · ${person.email}` : ""}</option>)}
        </select>
        <label htmlFor="access-role">Role</label>
        <select id="access-role" name="role_code" required defaultValue="">
          <option value="" disabled>Choose a role</option>
          {roles.map((role) => <option value={role.code} key={role.code}>{role.label}</option>)}
        </select>
        <label htmlFor="access-scope">Scope</label>
        <select id="access-scope" name="scope_target" required defaultValue="">
          <option value="" disabled>Choose where the role applies</option>
          {scopeOptions.map((scope) => <option value={scope.value} key={scope.value}>{scope.label}</option>)}
        </select>
        <p className="access-help">Use platform-wide access for platform administration, course management or central enrolment management. Assign instructors and teaching assistants to a course offering when one is available.</p>
        <button className="button" type="submit" disabled={Boolean(queryError)}>Assign role</button>
      </form>}
    </section>

    <section className="access-panel">
      <div className="section-heading compact-heading"><div><span className="course-kicker">CURRENT ACCESS</span><h2>Role assignments</h2></div></div>
      {assignments.length === 0 ? <p>No roles have been assigned yet.</p> : <div className="access-assignment-list">
        {assignments.map((assignment) => {
          const person = peopleById.get(assignment.user_id);
          return <article className="access-assignment" key={assignment.id}>
            <div><strong>{person?.display_name || person?.email || "Account"}</strong><small>{person?.email}</small></div>
            <div><span className="access-role-badge">{roleNames.get(assignment.role) ?? assignment.role}</span><small>{scopeLabel(assignment)}</small></div>
            <form action={revokeRoleAction}><input type="hidden" name="assignment_id" value={assignment.id} /><button className="access-remove" type="submit">Remove</button></form>
          </article>;
        })}
      </div>}
    </section>

    <div className="prototype-note">Public registration creates only the student role. Guest visitors do not need accounts. The role names and permission bundles are stored in Supabase; a visual editor for custom role bundles will be added as a later administration feature.</div>
  </div>;
}

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function safePath(value: FormDataEntryValue | null, fallback: string) {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

export async function signInAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?error=not-configured");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const destination = safePath(formData.get("next"), "/dashboard");

  if (!email || !password) redirect("/login?error=credentials");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=credentials");
  redirect(destination);
}

export async function signUpLearnerAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/signup?error=not-configured");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const affiliation = String(formData.get("affiliation_category_code") ?? "independent");
  const affiliationName = String(formData.get("affiliation_name") ?? "").trim();
  const affiliationReference = String(formData.get("affiliation_reference") ?? "").trim();
  const allowedAffiliations = new Set(["iba", "university", "acca", "icmap", "independent", "other"]);

  if (!displayName || !email || password.length < 8 || !allowedAffiliations.has(affiliation)) {
    redirect("/signup?error=details");
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  if (!host) redirect("/signup?error=not-configured");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${protocol}://${host}/auth/confirm?next=%2Fdashboard`,
      data: {
        display_name: displayName,
        affiliation_category_code: affiliation,
        affiliation_name: affiliationName,
        affiliation_reference: affiliationReference
      }
    }
  });

  if (error) redirect("/signup?error=signup");
  redirect("/signup?check-email=1");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

export async function requestPasswordResetAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/forgot-password?error=not-configured");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/forgot-password?error=email");

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  if (!host) redirect("/forgot-password?error=not-configured");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${protocol}://${host}/auth/confirm?next=%2Freset-password`
  });
  if (error) redirect("/forgot-password?error=request");
  redirect("/forgot-password?sent=1");
}

export async function updatePasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?error=not-configured");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("password_confirmation") ?? "");
  if (password.length < 8 || password !== confirmation) redirect("/reset-password?error=details");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=confirmation");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/reset-password?error=update");
  redirect("/dashboard?password-updated=1");
}

function parseScopeTarget(value: string) {
  if (value === "platform") return { scope_type: "platform", scope_id: null as string | null };
  const separator = value.indexOf(":");
  if (separator < 1) return null;
  const scope_type = value.slice(0, separator);
  const scope_id = value.slice(separator + 1);
  const allowedScopes = new Set(["organisation", "programme", "course", "offering"]);
  if (!allowedScopes.has(scope_type) || !/^[0-9a-f-]{36}$/i.test(scope_id)) return null;
  return { scope_type, scope_id };
}

export async function grantRoleAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?error=not-configured");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fadmin%2Faccess");

  const userId = String(formData.get("user_id") ?? "");
  const roleCode = String(formData.get("role_code") ?? "");
  const scope = parseScopeTarget(String(formData.get("scope_target") ?? ""));
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !scope || !roleCode) redirect("/admin/access?error=details");

  const { data: allowed, error: permissionError } = await supabase.rpc("has_permission", {
    p_permission_code: "roles.assign",
    p_scope_type: scope.scope_type,
    p_scope_id: scope.scope_id
  });
  if (permissionError || !allowed) redirect("/access-denied");

  const { data: role, error: roleError } = await supabase.from("roles").select("code").eq("code", roleCode).eq("is_active", true).maybeSingle();
  if (roleError || !role) redirect("/admin/access?error=role");

  const { error } = await supabase.from("role_assignments").insert({
    user_id: userId,
    role: roleCode,
    scope_type: scope.scope_type,
    scope_id: scope.scope_id,
    granted_by: user.id
  });
  if (error) redirect(`/admin/access?error=${error.code === "23505" ? "duplicate" : "grant"}`);
  revalidatePath("/admin/access");
  redirect("/admin/access?updated=1");
}

export async function revokeRoleAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?error=not-configured");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fadmin%2Faccess");

  const assignmentId = String(formData.get("assignment_id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(assignmentId)) redirect("/admin/access?error=details");
  const { data: assignment, error: readError } = await supabase.from("role_assignments")
    .select("id, role, scope_type, scope_id")
    .eq("id", assignmentId)
    .maybeSingle();
  if (readError || !assignment) redirect("/admin/access?error=grant");

  const { data: allowed, error: permissionError } = await supabase.rpc("has_permission", {
    p_permission_code: "roles.assign",
    p_scope_type: assignment.scope_type,
    p_scope_id: assignment.scope_id
  });
  if (permissionError || !allowed) redirect("/access-denied");

  if (assignment.role === "platform_admin" && assignment.scope_type === "platform") {
    const { data: admins, error: countError } = await supabase.from("role_assignments")
      .select("id")
      .eq("role", "platform_admin")
      .eq("scope_type", "platform");
    if (countError || (admins?.length ?? 0) <= 1) redirect("/admin/access?error=last-admin");
  }

  const { error } = await supabase.from("role_assignments").delete().eq("id", assignmentId);
  if (error) redirect("/admin/access?error=revoke");
  revalidatePath("/admin/access");
  redirect("/admin/access?updated=1");
}

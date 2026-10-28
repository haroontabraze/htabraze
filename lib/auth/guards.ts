import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function requireUser(nextPath: string) {
  if (!isSupabaseConfigured()) redirect("/login?error=not-configured");

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return { supabase, user };
}

export async function requirePermission(permissionCode: string, scopeType = "platform", scopeId: string | null = null, nextPath = "/admin") {
  const context = await requireUser(nextPath);
  const { data, error } = await context.supabase.rpc("has_permission", {
    p_permission_code: permissionCode,
    p_scope_type: scopeType,
    p_scope_id: scopeId
  });

  if (error) redirect("/access-denied?reason=permissions-not-ready");
  if (!data) redirect("/access-denied");
  return context;
}

export async function requireAnyPermission(permissionCodes: string[]) {
  const context = await requireUser("/teach");
  const { data, error } = await context.supabase.rpc("has_any_permission", {
    p_permission_codes: permissionCodes
  });

  if (error) redirect("/access-denied?reason=permissions-not-ready");
  if (!data) redirect("/access-denied");
  return context;
}

-- Authentication and flexible, scoped permissions for the LMS.
-- Run after 20261025000000_initial_schema.sql.

begin;

create table if not exists public.permission_catalog (
  code text primary key,
  category text not null,
  label text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.roles (
  code text primary key,
  label text not null,
  description text not null default '',
  is_system_role boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (code ~ '^[a-z][a-z0-9_]*$')
);

create table if not exists public.role_permissions (
  role_code text not null references public.roles(code) on update cascade on delete cascade,
  permission_code text not null references public.permission_catalog(code) on update cascade on delete restrict,
  created_at timestamptz not null default now(),
  primary key (role_code, permission_code)
);

create table if not exists public.affiliation_categories (
  code text primary key,
  label text not null,
  is_active boolean not null default true,
  sequence_number integer not null default 0,
  created_at timestamptz not null default now(),
  check (code ~ '^[a-z][a-z0-9_]*$')
);

insert into public.affiliation_categories (code, label, sequence_number)
values
  ('iba', 'IBA', 10),
  ('university', 'Other university', 20),
  ('acca', 'ACCA', 30),
  ('icmap', 'ICMAP', 40),
  ('independent', 'Independent learner', 50),
  ('other', 'Other', 60)
on conflict (code) do update set label = excluded.label, sequence_number = excluded.sequence_number;

create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organisation_type text not null default 'other',
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organisation_memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_type text not null default 'learner',
  reference_number text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, user_id)
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists affiliation_category_code text references public.affiliation_categories(code),
  add column if not exists affiliation_name text,
  add column if not exists affiliation_reference text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is distinct from u.email;

create index if not exists profiles_email_lower_idx on public.profiles (lower(email));

alter table public.programmes
  add column if not exists organisation_id uuid references public.organisations(id) on delete set null;

alter table public.courses
  add column if not exists organisation_id uuid references public.organisations(id) on delete set null;

alter table public.course_offerings
  add column if not exists organisation_id uuid references public.organisations(id) on delete set null;

insert into public.permission_catalog (code, category, label, description)
values
  ('platform.admin', 'Platform', 'Administer platform', 'Manage platform-wide settings and access.'),
  ('users.view', 'People', 'View people', 'View learner and staff account records within the assigned scope.'),
  ('users.manage', 'People', 'Manage people', 'Invite, update, suspend and manage accounts within the assigned scope.'),
  ('roles.assign', 'People', 'Assign roles', 'Grant or revoke role assignments within the assigned scope.'),
  ('roles.manage', 'People', 'Manage roles', 'Create roles and configure their permission bundles.'),
  ('organisations.manage', 'Organisations', 'Manage organisations', 'Create and maintain organisation records and memberships.'),
  ('courses.create', 'Courses', 'Create courses', 'Create course records and drafts.'),
  ('courses.edit', 'Courses', 'Edit courses', 'Edit assigned courses and their content.'),
  ('courses.publish', 'Courses', 'Publish courses', 'Publish and unpublish courses.'),
  ('courses.archive', 'Courses', 'Archive courses', 'Archive courses and offerings.'),
  ('courses.teach', 'Teaching', 'Teach courses', 'Access teaching tools for assigned courses.'),
  ('learners.view', 'Teaching', 'View learners', 'View learners enrolled in assigned courses.'),
  ('enrolments.view', 'Enrolments', 'View enrolments', 'View enrolments within the assigned scope.'),
  ('enrolments.manage', 'Enrolments', 'Manage enrolments', 'Add, approve, update and withdraw enrolments.'),
  ('enrolments.import', 'Enrolments', 'Import enrolments', 'Import enrolment lists within the assigned scope.'),
  ('assessment.manage', 'Assessment', 'Manage assessments', 'Create and manage quizzes and assessment settings.'),
  ('question_banks.manage', 'Assessment', 'Manage question banks', 'Create and maintain question banks within the assigned scope.'),
  ('submissions.view', 'Assessment', 'View submissions', 'View learner submissions within assigned courses.'),
  ('submissions.grade', 'Assessment', 'Grade submissions', 'Grade and return learner submissions.'),
  ('assessments.attempt', 'Learning', 'Attempt assessments', 'Submit assessment attempts in enrolled courses.'),
  ('courses.view_enrolled', 'Learning', 'View enrolled courses', 'Access courses in which the learner is enrolled.'),
  ('progress.view', 'Reports', 'View progress', 'View progress within the assigned scope.'),
  ('progress.view_own', 'Learning', 'View own progress', 'View the signed-in learner’s own progress.'),
  ('reports.view', 'Reports', 'View reports', 'View reports within the assigned scope.'),
  ('reports.export', 'Reports', 'Export reports', 'Export reports within the assigned scope.'),
  ('profile.update_own', 'Account', 'Update own profile', 'Update permitted profile information for the signed-in user.')
on conflict (code) do update set
  category = excluded.category,
  label = excluded.label,
  description = excluded.description;

insert into public.roles (code, label, description, is_system_role)
values
  ('platform_admin', 'Platform administrator', 'Full platform-wide administration.', true),
  ('course_manager', 'Course manager', 'Create and maintain course content within assigned scopes.', true),
  ('enrolment_manager', 'Enrolment manager', 'Manage learners and enrolments within assigned scopes.', true),
  ('instructor', 'Instructor', 'Teach and assess learners in assigned courses.', true),
  ('teaching_assistant', 'Teaching assistant', 'Support learners in assigned courses.', true),
  ('student', 'Student', 'Learn in courses for which the learner is enrolled.', true)
on conflict (code) do update set
  label = excluded.label,
  description = excluded.description,
  is_system_role = true;

-- Convert the initial fixed role list into the role catalogue.
alter table public.role_assignments drop constraint if exists role_assignments_role_check;
alter table public.role_assignments drop constraint if exists role_assignments_scope_type_check;
alter table public.role_assignments drop constraint if exists role_assignments_check;

update public.role_assignments set role = 'platform_admin' where role = 'administrator';
update public.role_assignments set role = 'course_manager' where role = 'programme_administrator';
update public.role_assignments set scope_type = 'platform', scope_id = null where scope_type = 'institution';

alter table public.role_assignments
  add constraint role_assignments_role_fkey foreign key (role) references public.roles(code) on update cascade on delete restrict,
  add constraint role_assignments_scope_type_check check (scope_type in ('platform', 'organisation', 'programme', 'course', 'offering', 'self')),
  add constraint role_assignments_scope_id_check check (
    (scope_type = 'platform' and scope_id is null)
    or (scope_type <> 'platform' and scope_id is not null)
  );

drop index if exists public.role_assignments_user_scope_idx;
create index role_assignments_user_scope_idx on public.role_assignments(user_id, scope_type, scope_id, role);
create unique index if not exists role_assignments_platform_unique_idx
  on public.role_assignments(user_id, role) where scope_type = 'platform';
create unique index if not exists role_assignments_scoped_unique_idx
  on public.role_assignments(user_id, role, scope_type, scope_id) where scope_type <> 'platform';

insert into public.role_permissions (role_code, permission_code)
select 'platform_admin', code from public.permission_catalog
on conflict do nothing;

insert into public.role_permissions (role_code, permission_code)
values
  ('course_manager', 'courses.create'), ('course_manager', 'courses.edit'),
  ('course_manager', 'courses.publish'), ('course_manager', 'courses.archive'),
  ('course_manager', 'assessment.manage'), ('course_manager', 'question_banks.manage'),
  ('enrolment_manager', 'users.view'), ('enrolment_manager', 'enrolments.view'),
  ('enrolment_manager', 'enrolments.manage'), ('enrolment_manager', 'enrolments.import'),
  ('instructor', 'courses.teach'), ('instructor', 'learners.view'), ('instructor', 'enrolments.view'),
  ('instructor', 'assessment.manage'), ('instructor', 'submissions.view'),
  ('instructor', 'submissions.grade'), ('instructor', 'progress.view'), ('instructor', 'reports.view'),
  ('teaching_assistant', 'courses.teach'), ('teaching_assistant', 'learners.view'),
  ('teaching_assistant', 'submissions.view'), ('teaching_assistant', 'progress.view'),
  ('student', 'courses.view_enrolled'), ('student', 'assessments.attempt'),
  ('student', 'progress.view_own'), ('student', 'profile.update_own')
on conflict do nothing;

create or replace function public.has_permission(
  p_permission_code text,
  p_scope_type text default 'platform',
  p_scope_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.role_assignments ra
    join public.roles r on r.code = ra.role and r.is_active
    join public.role_permissions rp on rp.role_code = ra.role
    where ra.user_id = (select auth.uid())
      and rp.permission_code = p_permission_code
      and (
        ra.scope_type = 'platform'
        or (ra.scope_type = p_scope_type and ra.scope_id is not distinct from p_scope_id)
        or (ra.scope_type = 'self' and p_scope_type = 'self' and p_scope_id = (select auth.uid()) and ra.scope_id = (select auth.uid()))
        or (
          ra.scope_type = 'organisation'
          and p_scope_type = 'programme'
          and exists (select 1 from public.programmes p where p.id = p_scope_id and p.organisation_id = ra.scope_id)
        )
        or (
          ra.scope_type = 'organisation'
          and p_scope_type = 'course'
          and exists (select 1 from public.courses c where c.id = p_scope_id and c.organisation_id = ra.scope_id)
        )
        or (
          ra.scope_type = 'organisation'
          and p_scope_type = 'offering'
          and exists (
            select 1 from public.course_offerings co
            join public.courses c on c.id = co.course_id
            where co.id = p_scope_id and coalesce(co.organisation_id, c.organisation_id) = ra.scope_id
          )
        )
        or (
          ra.scope_type = 'programme'
          and p_scope_type = 'course'
          and exists (select 1 from public.programme_courses pc where pc.programme_id = ra.scope_id and pc.course_id = p_scope_id)
        )
        or (
          ra.scope_type = 'programme'
          and p_scope_type = 'offering'
          and exists (
            select 1 from public.course_offerings co
            join public.programme_courses pc on pc.course_id = co.course_id
            where co.id = p_scope_id and pc.programme_id = ra.scope_id
          )
        )
        or (
          ra.scope_type = 'course'
          and p_scope_type = 'offering'
          and exists (select 1 from public.course_offerings co where co.id = p_scope_id and co.course_id = ra.scope_id)
        )
      )
  );
$$;

create or replace function public.has_any_permission(p_permission_codes text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.role_assignments ra
    join public.roles r on r.code = ra.role and r.is_active
    join public.role_permissions rp on rp.role_code = ra.role
    where ra.user_id = (select auth.uid())
      and rp.permission_code = any(p_permission_codes)
  );
$$;

revoke all on function public.has_permission(text, text, uuid) from public;
revoke all on function public.has_any_permission(text[]) from public;
grant execute on function public.has_permission(text, text, uuid) to authenticated;
grant execute on function public.has_permission(text, text, uuid) to anon;
grant execute on function public.has_any_permission(text[]) to authenticated;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_category text;
begin
  v_category := coalesce(new.raw_user_meta_data ->> 'affiliation_category_code', 'independent');
  if not exists (select 1 from public.affiliation_categories where code = v_category and is_active) then
    v_category := 'other';
  end if;

  insert into public.profiles (id, email, display_name, affiliation_category_code, affiliation_name, affiliation_reference)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    v_category,
    nullif(new.raw_user_meta_data ->> 'affiliation_name', ''),
    nullif(new.raw_user_meta_data ->> 'affiliation_reference', '')
  )
  on conflict (id) do nothing;

  -- Public registration can create only a learner role; staff roles are granted by an administrator.
  insert into public.role_assignments (user_id, role, scope_type, scope_id)
  values (new.id, 'student', 'platform', null)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_lms on auth.users;
create trigger on_auth_user_created_lms
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

revoke all on function public.handle_new_auth_user() from public;

create or replace function public.sync_auth_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email, updated_at = now() where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated_lms on auth.users;
create trigger on_auth_user_email_updated_lms
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.sync_auth_user_email();

revoke all on function public.sync_auth_user_email() from public;

-- Role assignments are readable by their owner. Only a platform administrator may grant roles.
drop policy if exists "Users can read their own role assignments" on public.role_assignments;
create policy "Users can read their own role assignments"
  on public.role_assignments for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('roles.assign', 'platform', null));

drop policy if exists "Platform role managers can manage role assignments" on public.role_assignments;
create policy "Platform role managers can manage role assignments"
  on public.role_assignments for all to authenticated
  using (public.has_permission('roles.assign', scope_type, scope_id))
  with check (public.has_permission('roles.assign', scope_type, scope_id));

create or replace function public.protect_last_platform_admin()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  remaining_admins integer;
begin
  if old.role = 'platform_admin' and old.scope_type = 'platform' then
    if tg_op = 'DELETE' then
      select count(*) into remaining_admins
      from public.role_assignments
      where role = 'platform_admin' and scope_type = 'platform' and id <> old.id;
      if remaining_admins < 1 then
        raise exception 'At least one platform administrator must remain assigned.';
      end if;
    elsif new.role <> 'platform_admin' or new.scope_type <> 'platform' then
      select count(*) into remaining_admins
      from public.role_assignments
      where role = 'platform_admin' and scope_type = 'platform' and id <> old.id;
      if remaining_admins < 1 then
        raise exception 'At least one platform administrator must remain assigned.';
      end if;
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists role_assignments_protect_last_admin on public.role_assignments;
create trigger role_assignments_protect_last_admin
  before update or delete on public.role_assignments
  for each row execute function public.protect_last_platform_admin();

revoke all on function public.protect_last_platform_admin() from public;

create or replace function public.audit_role_assignment_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected public.role_assignments%rowtype;
  action_name text;
begin
  if tg_op = 'DELETE' then
    affected := old;
    action_name := 'role_assignment.removed';
  else
    affected := new;
    action_name := case when tg_op = 'INSERT' then 'role_assignment.created' else 'role_assignment.updated' end;
  end if;

  insert into public.audit_events (actor_id, action, record_type, record_id, change_summary)
  values (
    (select auth.uid()),
    action_name,
    'role_assignment',
    affected.id,
    jsonb_build_object(
      'user_id', affected.user_id,
      'role', affected.role,
      'scope_type', affected.scope_type,
      'scope_id', affected.scope_id
    )
  );

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists role_assignments_audit on public.role_assignments;
create trigger role_assignments_audit
  after insert or update or delete on public.role_assignments
  for each row execute function public.audit_role_assignment_change();

revoke all on function public.audit_role_assignment_change() from public;

create policy "Platform administrators can read access audit history"
  on public.audit_events for select to authenticated
  using (public.has_permission('platform.admin', 'platform', null));

drop policy if exists "Users with people access can view profiles" on public.profiles;
create policy "Users with people access can view profiles"
  on public.profiles for select to authenticated
  using (public.has_permission('users.view', 'platform', null));

grant select on public.profiles to authenticated;
revoke update on public.profiles from authenticated;
grant update (display_name, preferred_name, locale, time_zone, accessibility_preferences,
  affiliation_category_code, affiliation_name, affiliation_reference)
  on public.profiles to authenticated;

grant select on public.programmes, public.courses, public.course_offerings to authenticated;
create policy "Platform administrators can read programmes for access assignment"
  on public.programmes for select to authenticated
  using (public.has_permission('platform.admin', 'platform', null));
create policy "Platform administrators can read courses for access assignment"
  on public.courses for select to authenticated
  using (public.has_permission('platform.admin', 'platform', null));
create policy "Platform administrators can read offerings for access assignment"
  on public.course_offerings for select to authenticated
  using (public.has_permission('platform.admin', 'platform', null));

alter table public.permission_catalog enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.affiliation_categories enable row level security;
alter table public.organisations enable row level security;
alter table public.organisation_memberships enable row level security;

grant select on public.permission_catalog, public.roles, public.role_permissions, public.affiliation_categories to authenticated;
grant insert, update, delete on public.roles, public.role_permissions to authenticated;
grant select, insert, update, delete on public.role_assignments to authenticated;
grant insert, update, delete on public.affiliation_categories, public.organisations, public.organisation_memberships to authenticated;
grant select on public.organisations to authenticated;
grant select on public.organisation_memberships to authenticated;

create policy "Authenticated users can read permission catalog"
  on public.permission_catalog for select to authenticated using (true);

create policy "Authenticated users can read active roles"
  on public.roles for select to authenticated using (is_active or public.has_permission('roles.manage', 'platform', null));

create policy "Role managers can manage roles"
  on public.roles for all to authenticated
  using (public.has_permission('roles.manage', 'platform', null))
  with check (public.has_permission('roles.manage', 'platform', null));

create policy "Authenticated users can read role permissions"
  on public.role_permissions for select to authenticated using (true);

create policy "Role managers can manage role permissions"
  on public.role_permissions for all to authenticated
  using (public.has_permission('roles.manage', 'platform', null))
  with check (public.has_permission('roles.manage', 'platform', null));

create policy "Public can read active affiliation categories"
  on public.affiliation_categories for select to anon using (is_active);

create policy "Signed-in users can read active affiliation categories"
  on public.affiliation_categories for select to authenticated
  using (is_active or public.has_permission('platform.admin', 'platform', null));

create policy "Platform administrators can manage affiliation categories"
  on public.affiliation_categories for all to authenticated
  using (public.has_permission('platform.admin', 'platform', null))
  with check (public.has_permission('platform.admin', 'platform', null));

create policy "Authenticated users can read active organisations"
  on public.organisations for select to authenticated
  using (status = 'active' or public.has_permission('organisations.manage', 'platform', null));

create policy "Organisation managers can manage organisations"
  on public.organisations for all to authenticated
  using (public.has_permission('organisations.manage', 'platform', null))
  with check (public.has_permission('organisations.manage', 'platform', null));

create policy "Users can read their organisation memberships"
  on public.organisation_memberships for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('organisations.manage', 'organisation', organisation_id));

create policy "Organisation managers can manage memberships"
  on public.organisation_memberships for all to authenticated
  using (public.has_permission('organisations.manage', 'organisation', organisation_id))
  with check (public.has_permission('organisations.manage', 'organisation', organisation_id));

-- Give the first administrator a secure manual bootstrap path through Supabase SQL Editor.
comment on function public.has_permission(text, text, uuid) is 'Checks permission grants using platform, organisation, programme, course, offering and self scopes.';
comment on table public.roles is 'Data-driven role bundles; permission codes are maintained in the application and selectable by administrators.';
comment on table public.role_assignments is 'A user may hold multiple role assignments at different scopes.';
comment on table public.organisation_memberships is 'Affiliation records are separate from roles and permissions.';

commit;

-- Flexible Learning Platform: initial structural schema.
-- Core tables use RLS with no broad read/write policies yet. Until scoped
-- policies are added, authenticated clients cannot access these records.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  preferred_name text,
  avatar_path text,
  locale text not null default 'en',
  time_zone text not null default 'Asia/Karachi',
  accessibility_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('administrator', 'programme_administrator', 'instructor', 'teaching_assistant', 'student')),
  scope_type text not null check (scope_type in ('institution', 'programme', 'course', 'offering')),
  scope_id uuid,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check ((scope_type = 'institution' and scope_id is null) or (scope_type <> 'institution' and scope_id is not null)),
  unique (user_id, role, scope_type, scope_id)
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description jsonb not null default '{}'::jsonb,
  learning_outcomes jsonb not null default '[]'::jsonb,
  language_code text not null default 'en',
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.programme_courses (
  programme_id uuid not null references public.programmes(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  sequence_number integer not null default 0,
  completion_rules jsonb not null default '{}'::jsonb,
  primary key (programme_id, course_id)
);

create table public.course_offerings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  title text,
  delivery_mode text not null default 'self_paced' check (delivery_mode in ('self_paced', 'scheduled', 'blended')),
  status text not null default 'draft' check (status in ('draft', 'open', 'in_progress', 'completed', 'archived')),
  time_zone text not null default 'Asia/Karachi',
  starts_at timestamptz,
  ends_at timestamptz,
  enrolment_opens_at timestamptz,
  enrolment_closes_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  enrolment_policy jsonb not null default '{"method":"administrator"}'::jsonb,
  completion_rules jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  sequence_number integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, sequence_number)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  title text not null,
  summary text not null default '',
  sequence_number integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, sequence_number)
);

create table public.lesson_versions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  version_number integer not null,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'superseded')),
  completion_rules jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (lesson_id, version_number)
);

create table public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_version_id uuid not null references public.lesson_versions(id) on delete cascade,
  block_type text not null,
  title text,
  sequence_number integer not null,
  is_required boolean not null default true,
  configuration jsonb not null default '{}'::jsonb,
  configuration_version integer not null default 1 check (configuration_version > 0),
  created_at timestamptz not null default now(),
  unique (lesson_version_id, sequence_number)
);

create table public.offering_staff (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.course_offerings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  staff_role text not null check (staff_role in ('instructor', 'teaching_assistant')),
  permissions jsonb not null default '{"view_learners":true,"grade":false,"edit_content":false,"manage_enrolment":false}'::jsonb,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (offering_id, user_id, staff_role)
);

create table public.enrolments (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.course_offerings(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('invited', 'pending', 'active', 'completed', 'withdrawn', 'suspended')),
  enrolment_source text not null default 'administrator',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (offering_id, student_id)
);

create table public.question_banks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  scope_type text not null default 'course' check (scope_type in ('institution', 'programme', 'course')),
  scope_id uuid,
  access_policy jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  bank_id uuid not null references public.question_banks(id) on delete cascade,
  question_type text not null,
  tags text[] not null default '{}',
  difficulty text check (difficulty is null or difficulty in ('introductory', 'intermediate', 'advanced')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  current_version integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  version_number integer not null,
  prompt jsonb not null,
  answer_key jsonb,
  marking_rules jsonb not null default '{}'::jsonb,
  feedback jsonb not null default '{}'::jsonb,
  points numeric(9,2) not null default 1 check (points >= 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (question_id, version_number)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_versions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  version_number integer not null,
  settings jsonb not null default '{}'::jsonb,
  question_selection jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (quiz_id, version_number)
);

create table public.quiz_version_questions (
  quiz_version_id uuid not null references public.quiz_versions(id) on delete cascade,
  question_version_id uuid not null references public.question_versions(id) on delete restrict,
  sequence_number integer not null,
  points numeric(9,2) not null default 1 check (points >= 0),
  primary key (quiz_version_id, question_version_id),
  unique (quiz_version_id, sequence_number)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_version_id uuid not null references public.quiz_versions(id) on delete restrict,
  offering_id uuid not null references public.course_offerings(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  attempt_number integer not null check (attempt_number > 0),
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted', 'graded', 'voided')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric(9,2),
  maximum_score numeric(9,2),
  grading_state jsonb not null default '{}'::jsonb,
  unique (quiz_version_id, offering_id, student_id, attempt_number)
);

create table public.quiz_attempt_items (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_version_id uuid not null references public.question_versions(id) on delete restrict,
  sequence_number integer not null,
  points_possible numeric(9,2) not null default 1 check (points_possible >= 0),
  rendered_snapshot jsonb not null default '{}'::jsonb,
  unique (attempt_id, sequence_number)
);

create table public.responses (
  id uuid primary key default gen_random_uuid(),
  attempt_item_id uuid not null references public.quiz_attempt_items(id) on delete cascade,
  response jsonb not null default '{}'::jsonb,
  score numeric(9,2),
  grading_status text not null default 'pending' check (grading_status in ('pending', 'auto_graded', 'manually_graded', 'needs_review')),
  feedback jsonb not null default '{}'::jsonb,
  graded_by uuid references auth.users(id) on delete set null,
  graded_at timestamptz,
  saved_at timestamptz not null default now(),
  unique (attempt_item_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrolment_id uuid not null references public.enrolments(id) on delete cascade,
  lesson_version_id uuid not null references public.lesson_versions(id) on delete restrict,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  current_block_id uuid references public.lesson_blocks(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz not null default now(),
  unique (enrolment_id, lesson_version_id)
);

create table public.block_progress (
  id uuid primary key default gen_random_uuid(),
  lesson_progress_id uuid not null references public.lesson_progress(id) on delete cascade,
  lesson_block_id uuid not null references public.lesson_blocks(id) on delete restrict,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'skipped')),
  state jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (lesson_progress_id, lesson_block_id)
);

create table public.video_progress (
  id uuid primary key default gen_random_uuid(),
  block_progress_id uuid not null unique references public.block_progress(id) on delete cascade,
  provider text not null check (provider in ('youtube', 'vimeo', 'uploaded', 'other')),
  resume_seconds numeric(12,3) not null default 0 check (resume_seconds >= 0),
  duration_seconds numeric(12,3) check (duration_seconds is null or duration_seconds >= 0),
  next_required_checkpoint_id uuid references public.lesson_blocks(id) on delete set null,
  last_synced_at timestamptz not null default now()
);

create table public.checkpoint_attempts (
  id uuid primary key default gen_random_uuid(),
  block_progress_id uuid not null references public.block_progress(id) on delete cascade,
  checkpoint_block_id uuid not null references public.lesson_blocks(id) on delete restrict,
  attempt_number integer not null default 1 check (attempt_number > 0),
  response jsonb not null default '{}'::jsonb,
  is_correct boolean,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'needs_review')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (block_progress_id, checkpoint_block_id, attempt_number)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  storage_path text,
  external_url text,
  media_type text,
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  version_number integer not null default 1,
  access_policy jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (storage_path is not null or external_url is not null)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.course_offerings(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  lesson_block_id uuid not null references public.lesson_blocks(id) on delete restrict,
  response jsonb not null default '{}'::jsonb,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'graded', 'returned')),
  submitted_at timestamptz,
  score numeric(9,2),
  feedback jsonb not null default '{}'::jsonb,
  graded_by uuid references auth.users(id) on delete set null,
  graded_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body jsonb not null default '{}'::jsonb,
  cover_image_path text,
  author_id uuid references auth.users(id) on delete set null,
  tags text[] not null default '{}',
  seo_metadata jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text not null default '',
  related_record_type text,
  related_record_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  record_type text not null,
  record_id uuid,
  offering_id uuid references public.course_offerings(id) on delete set null,
  change_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index role_assignments_user_scope_idx on public.role_assignments(user_id, scope_type, scope_id, role);
create index course_offerings_course_status_idx on public.course_offerings(course_id, status);
create index units_course_order_idx on public.units(course_id, sequence_number);
create index lessons_unit_order_idx on public.lessons(unit_id, sequence_number);
create index enrolments_student_status_idx on public.enrolments(student_id, status);
create index enrolments_offering_status_idx on public.enrolments(offering_id, status);
create index questions_bank_status_idx on public.questions(bank_id, status);
create index quiz_attempts_student_status_idx on public.quiz_attempts(student_id, status);
create index lesson_progress_enrolment_status_idx on public.lesson_progress(enrolment_id, status);
create index block_progress_lesson_status_idx on public.block_progress(lesson_progress_id, status);
create index blog_posts_status_published_idx on public.blog_posts(status, published_at desc);
create index notifications_recipient_read_idx on public.notifications(recipient_id, read_at, created_at desc);
create index audit_events_offering_created_idx on public.audit_events(offering_id, created_at desc);

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger programmes_set_updated_at before update on public.programmes for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger course_offerings_set_updated_at before update on public.course_offerings for each row execute function public.set_updated_at();
create trigger units_set_updated_at before update on public.units for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create trigger question_banks_set_updated_at before update on public.question_banks for each row execute function public.set_updated_at();
create trigger questions_set_updated_at before update on public.questions for each row execute function public.set_updated_at();
create trigger quizzes_set_updated_at before update on public.quizzes for each row execute function public.set_updated_at();
create trigger block_progress_set_updated_at before update on public.block_progress for each row execute function public.set_updated_at();
create trigger resources_set_updated_at before update on public.resources for each row execute function public.set_updated_at();
create trigger blog_posts_set_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.role_assignments enable row level security;
alter table public.programmes enable row level security;
alter table public.courses enable row level security;
alter table public.programme_courses enable row level security;
alter table public.course_offerings enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_versions enable row level security;
alter table public.lesson_blocks enable row level security;
alter table public.offering_staff enable row level security;
alter table public.enrolments enable row level security;
alter table public.question_banks enable row level security;
alter table public.questions enable row level security;
alter table public.question_versions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_versions enable row level security;
alter table public.quiz_version_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_attempt_items enable row level security;
alter table public.responses enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.block_progress enable row level security;
alter table public.video_progress enable row level security;
alter table public.checkpoint_attempts enable row level security;
alter table public.resources enable row level security;
alter table public.submissions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;

-- Minimal profile and public blog access. All learning records remain denied
-- to client roles until the scoped policies are added in a reviewed migration.
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Users can read their own role assignments"
  on public.role_assignments for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Anyone can read published blog posts"
  on public.blog_posts for select to anon, authenticated
  using (status = 'published' and published_at is not null and published_at <= now());

comment on table public.lesson_blocks is 'Versioned ordered lesson content and activity blocks. Configuration must be validated against block_type and configuration_version.';
comment on table public.video_progress is 'Learner resume state for a video block, keyed through block_progress and enrolment.';
comment on table public.quiz_attempt_items is 'Question versions presented to a learner are retained for historic assessment integrity.';
comment on table public.audit_events is 'Administrative, publication, enrolment and grading changes for review.';

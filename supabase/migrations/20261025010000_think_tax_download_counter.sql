-- Public aggregate counter for clicks on the Think Tax download button.
-- It does not claim to measure completed downloads from the external MEGA page.

create table public.public_download_counters (
  book_key text primary key,
  click_count bigint not null default 0 check (click_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.public_download_counters enable row level security;

insert into public.public_download_counters (book_key, click_count)
values ('think-tax', 0)
on conflict (book_key) do nothing;

create or replace function public.get_think_tax_download_clicks()
returns bigint
language sql
security definer
set search_path = ''
as $$
  select click_count from public.public_download_counters where book_key = 'think-tax';
$$;

create or replace function public.record_think_tax_download_click()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_count bigint;
begin
  update public.public_download_counters
  set click_count = click_count + 1, updated_at = now()
  where book_key = 'think-tax'
  returning click_count into new_count;
  return new_count;
end;
$$;

revoke all on function public.get_think_tax_download_clicks() from public;
revoke all on function public.record_think_tax_download_click() from public;
grant execute on function public.get_think_tax_download_clicks() to anon, authenticated;
grant execute on function public.record_think_tax_download_click() to anon, authenticated;

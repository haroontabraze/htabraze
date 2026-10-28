# Authentication and permissions setup

This release adds email/password sign-in, learner self-registration, email confirmation, password reset, role and permission tables, scoped permission checks, a protected People and Access page, and route protection for `/learning`, `/dashboard`, `/teach` and `/admin`. The public home page, existing navigation labels and destinations, Think Tax button and download counter are kept as in the current temporary landing page. Visitors can continue using public pages without an account. Selecting **Learning platform** opens sign-in and returns the person to `/learning` after authentication.

It does not yet provide staff invitations, custom role creation or permission-bundle editing, course authoring, live enrolments, or live reports. `/admin` and `/teach` still contain prototype content. The rest of the learning tables remain closed to browser access until their module-specific data policies are added.

## 1. Keep the existing Supabase project

Deleting or recreating GitHub and Vercel projects does not delete the Supabase project. Reuse the Supabase project that already exists. The Supabase message “No repository connected” refers to optional GitHub integration; this setup runs SQL from the dashboard and does not require that integration.

## 2. Apply the database migrations once, in order

Open Supabase Dashboard, select the project, and choose **SQL Editor → New query**. In the GitHub repository, open each SQL file, copy its complete contents, paste into a new Supabase query and click **Run**.

The migration order is:

1. `supabase/migrations/20261025000000_initial_schema.sql`
2. `supabase/migrations/20261025010000_think_tax_download_counter.sql`
3. `supabase/migrations/20261028000000_auth_permissions_foundation.sql`

Run a migration only if it has not already been applied. The initial schema and counter migrations are not intended to be run twice. If the `profiles` and `role_assignments` tables already exist, skip the initial schema. If `public_download_counters` already exists, skip the counter migration.

The third migration depends on the first. It creates a data-driven role catalogue, a permission catalogue, role-permission bundles, scoped role assignments, affiliation categories, organisations, and the automatic learner-profile/learner-role setup for new registrations.

## 3. Configure Supabase Auth redirect URLs

In Supabase, open **Authentication → URL Configuration**.

- Set the **Site URL** to the production address currently used for the website.
- Add the production address followed by `/auth/confirm` to **Redirect URLs**. For example, add the Vercel address and, once the custom domain is active, `https://www.ca.com.pk/auth/confirm`.

Email confirmation and password-reset links return to this route. If the browser reports that a redirect URL is not allowed, add the exact address shown in the error.

## 4. Set the new Vercel project variables

In Vercel, open project **htabraze → Environment Variables**. Add both as **Config**, selecting **Production** (and Preview too, if you will test preview deployments):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The Project URL from Supabase’s **Connect** dialog |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The Publishable key from Supabase’s **Connect** dialog or **Settings → API Keys** |

Use the Publishable key, not a Supabase Secret or `service_role` key. Save both and redeploy the Vercel project; environment changes are picked up by a new deployment.

## 5. Create and promote the first administrator

1. Open the production website and visit `/signup`.
2. Create an account using the email address that will be the platform administrator. The public sign-up form can only create a learner account.
3. Confirm the account through the email link.
4. In Supabase, open **SQL Editor → New query** and run the following after replacing the example address with the administrator’s registered email:

```sql
insert into public.role_assignments (user_id, role, scope_type, scope_id, granted_by)
select id, 'platform_admin', 'platform', null, null
from auth.users
where lower(email) = lower('admin@example.com')
on conflict do nothing;
```

5. Sign in at `/login`, then open `/admin`. The account will have the `platform_admin` role with platform-wide permissions.

After this bootstrap, open **Administration → People and access** to assign the existing roles to other registered accounts. Each person must first create and confirm a learner account at `/signup`. Use the platform-wide scope only for roles that should work across the whole site. Assign instructors and teaching assistants to a course offering once offerings exist.

Do not add staff permissions through a public sign-up form. The migration automatically grants public registrants only the `student` role. Guest visitors can browse public pages without registering.

## Scope model

Role assignments support `platform`, `organisation`, `programme`, `course`, `offering` and `self` scopes. Platform assignments apply across the site. Organisation, programme and course scopes flow down to the related learning records where supported. A user can have multiple role assignments.

The current People and Access page assigns the built-in role bundles. A later role-management screen can let administrators build custom bundles from the permission catalogue. Permission codes themselves are maintained by the application so the UI cannot create an access rule the code does not know how to enforce.

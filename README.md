# Flexible Learning Platform

Initial Next.js application scaffold for the flexible LMS project.

## Current stage

This is a responsive interface with the existing temporary public landing page and LMS prototype screens. The public landing page, public menus, Think Tax download button and download counter remain as they were. Authentication is requested only when a visitor opens the **Learning platform** tab (`/learning`), then returns them to the LMS after sign-in. The update includes email/password authentication, learner registration with email confirmation, password reset, scoped role/permission tables, a protected People and Access page, and access checks for learner, teaching and administration areas. The course, lesson, enrolment, teaching and reporting screens still use prototype information and do not read/write live LMS records.

The core schema enables row-level security. LMS data tables remain closed to browser access until their module-specific policies have been added. Follow `docs/AUTHENTICATION_SETUP.md` to apply migrations, configure Auth redirects, connect the new Vercel project and promote the first administrator.

## Run locally

1. Install Node.js and npm.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` when a Supabase project has been created, then add the project URL and publishable key.
4. Run `npm run dev` and open `http://localhost:3000`.

The database schema is in `supabase/migrations/`. For the current browser-based setup, apply the SQL files through the Supabase Dashboard SQL Editor in order. Keep secret keys and database passwords out of GitHub.

The Think Tax page's existing counter measures clicks on the button, not completed downloads. The authentication update does not change its page, button or counter code. The counter depends on the existing migration and Vercel environment variables; the MEGA link works independently of the counter.

## Main routes

- `/` existing temporary public landing page for Think Tax (public; unchanged)
- `/learning` flexible LMS landing page (sign-in required)
- `/about` public educator profile
- `/think-tax` temporary public book page with an external MEGA link
- `/blog` public blog index
- `/courses` course catalogue prototype
- `/login` sign-in
- `/signup` learner registration
- `/forgot-password` password reset request
- `/dashboard` sign-in required; learner workspace placeholder
- `/lesson-demo` interactive lesson/checkpoint prototype
- `/teach` requires a teaching or course-management permission; workspace is still a prototype
- `/admin` requires platform administrator permission; management tools are still placeholders
- `/admin/access` protected screen to assign built-in roles to registered accounts
- `/forgot-password` and `/reset-password` password recovery

## Deployment direction

Push the reviewed project to the private GitHub repository and deploy through Vercel. Apply the Supabase migrations and configure the Supabase Auth redirect URLs and Vercel environment variables as documented in `docs/AUTHENTICATION_SETUP.md`. Do not enter real course or learner records until the corresponding data access policies and management screens are implemented.

# Flexible Learning Platform

Initial Next.js application scaffold for the flexible LMS project.

## Current stage

This is a responsive interface prototype with sample course, dashboard, instructor, administration, public profile/blog and lesson-checkpoint screens. It does not yet authenticate users or read/write live Supabase records. Do not use the sample metrics or course records as real data.

The first Supabase migration defines the core data model and enables row-level security. Access policies and authentication flows will be implemented and reviewed before connecting real student records.

## Run locally

1. Install Node.js and npm.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` when a Supabase project has been created, then add the project URL and publishable key.
4. Run `npm run dev` and open `http://localhost:3000`.

The database schema is in `supabase/migrations/`. Use the Supabase CLI to initialise/link a project and apply reviewed migrations. Keep secret keys and database passwords out of GitHub.

The Think Tax page's counter measures clicks on the button, not completed downloads. Apply the migration in `supabase/migrations/20261025010000_think_tax_download_counter.sql` and configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel for the shared counter to work. The MEGA link works independently of the counter.

## Main routes

- `/` temporary public landing page for Think Tax and the existing LMS
- `/learning` flexible LMS landing page
- `/about` public educator profile
- `/think-tax` temporary public book page with an external MEGA link
- `/blog` public blog index
- `/courses` course catalogue prototype
- `/dashboard` learner dashboard prototype
- `/lesson-demo` interactive lesson/checkpoint prototype
- `/teach` instructor workspace prototype
- `/admin` administration prototype

## Deployment direction

Push the reviewed project to a private GitHub repository, create/link the Supabase project, configure environment variables in Vercel, then import the repository into Vercel. Production deployment should wait until authentication, database access policies and course data have been reviewed.

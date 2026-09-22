# Ratilla Medical Clinic website

Next.js site for Ratilla Medical Clinic, Kauswagan, Cagayan de Oro. Visitors can book on SeriousMD, call, or leave a call-back request. Requests are saved to a Postgres database and read by clinic staff at `/admin`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, plain CSS (`app/globals.css`)
- Neon Postgres through Drizzle ORM (`lib/db/`)
- Server Actions for the call-back form (`app/actions/lead.ts`) and admin (`app/admin/actions.ts`)
- Local development uses PGlite, an embedded Postgres stored in `.pglite/`, so no database setup is needed

## Run it locally

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev
```

Open http://localhost:3000. Send a request through the form, then sign in at http://localhost:3000/admin with your `ADMIN_PASSWORD`.

Leave `DATABASE_URL` empty to use the local embedded database. To test against Neon instead, paste its connection string into `DATABASE_URL` and run `npm run db:migrate` once.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New > Project** and import the repository. The defaults (framework Next.js, build command `npm run build`) are correct.
3. In the project, open **Storage > Create Database**, pick **Neon**, and choose the Singapore region (closest to the Philippines). Connect it to all environments. Vercel adds `DATABASE_URL` for you.
4. In **Settings > Environment Variables**, add `ADMIN_PASSWORD` with a long passphrase.
5. Redeploy. The build runs `scripts/migrate.mjs` first, which creates the `leads` table, then builds the site.
6. Visit `https://<your-domain>/admin` and sign in.

Preview deployments use the same database unless you enable Neon branching for previews in the Neon integration settings.

`vercel.json` pins the serverless functions to Singapore (`sin1`), the region closest to Cagayan de Oro. If you create the Neon database in a different region, change it to match, so the site and the database stay close to each other.

`/robots.txt` and `/sitemap.xml` are generated at build time and use the project's production domain. `/admin` is excluded from search engines.

## Reading leads

`/admin` lists requests, newest first, filtered by status: **New**, **Contacted**, **Closed** or **All**. Each request has buttons to move it along, and a delete button for when someone asks for their data to be removed. Sessions last 8 hours. Changing `ADMIN_PASSWORD` signs everyone out.

For raw access, `npm run db:studio` opens Drizzle Studio against `DATABASE_URL`, and the Neon dashboard has a SQL editor.

## Changing the database

1. Edit `lib/db/schema.ts`.
2. Run `npm run db:generate` to write a new SQL migration into `drizzle/`.
3. Commit it. The next Vercel deploy applies it.

## Spam and abuse protection

- A hidden honeypot field and a minimum fill time quietly drop bot submissions.
- Each IP address (stored only as a SHA-256 hash) can send 5 requests per hour.
- All input is validated on the server with Zod.

## Before launch

- Replace the doctor photo placeholder in `app/(site)/page.tsx` (search for `TODO`).
- Replace `app/icon.svg` and `components/LogoMark.tsx` with the official logo if the clinic has one.
- Have the clinic review the privacy notice (`app/(site)/privacy/page.tsx`) and the animal bite first-aid steps.

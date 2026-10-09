# New client setup

This repository is a template for real estate websites. Each client gets their own copy, their own Vercel project, their own database and their own file storage. Everything that identifies the company lives in environment variables; no code changes are needed to launch a new client.

## Checklist

1. **Create a Vercel project.** Import this repository (or a fresh copy of it) as a new project in Vercel. Do not reuse another client's project.
2. **Create the data stores for this client.** In the new project's Storage tab, create a new **Neon** Postgres database and a new **Vercel Blob** store. Never share either with another client. Copy `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` into the project's environment variables (connecting the stores to the project adds them for you).
3. **Fill in the environment variables.** Every variable is listed and explained in [`.env.example`](.env.example): company name, logo path, contact details, colours, currency, email sender and so on. Add them all under Settings → Environment Variables for Production (and Preview if you use it).
4. **Choose the plan.** Set `NEXT_PUBLIC_PLAN` to `basic` or `pro`.
   - `basic`: only the Basic property admin (`/admin-basic`). `/admin-pro` redirects to it, and the compare page (`/admin`) shows the Pro option as not available.
   - `pro`: both admin systems are available.
5. **Set the admin credentials.** Set `ADMIN_PASSWORD` to a new, unique password for this client, and `ADMIN_SESSION_SECRET` to a new random value of 32 or more characters. The first admin account is created automatically on the first sign-in, using `COMPANY_EMAIL` as the login email and `ADMIN_PASSWORD` as the password. Changing `ADMIN_PASSWORD` later does not change an existing account; use the Staff tab in the Pro system, or the database, for that.
6. **Replace the logo and icons** (see below), then deploy.
7. **Connect the client's domain** under Settings → Domains, and set `NEXT_PUBLIC_SITE_URL` to the final `https://` address. Redeploy after changing it.
8. **Check before handing off.**
   - Sign in at `/admin` (or from the staff sign-in link at the bottom of the site menu) with `COMPANY_EMAIL` and `ADMIN_PASSWORD`.
   - Basic plan: `/admin-basic` opens, you can add a listing with a photo, and it appears on the public site. `/admin-pro` redirects to `/admin-basic` and `/admin` shows the Pro option as unavailable.
   - Pro plan: both systems open. In `/admin-pro`, add a client, create a lease, record a payment, open a WhatsApp reminder, record a sale and add a staff member.
   - Submit the "Find me a property" form and confirm the email arrives at `COMPANY_EMAIL`.
   - Look at the site in English and Arabic on a phone-sized screen.

## Replacing the logo and icons

The logo is read from `NEXT_PUBLIC_LOGO_PATH` (`site.logo` in `config/site.ts`). It is used in the admin header. To change it:

1. Put the new file in `public/` (any name, for example `public/acme-logo.png`).
2. Set `NEXT_PUBLIC_LOGO_PATH=/acme-logo.png` and redeploy.

The public website uses a few separate brand files that keep fixed names. Replace each with the client's artwork under the same file name and with similar proportions:

| File | Where it appears |
| --- | --- |
| `public/brand/mark-96.webp` | Public site header and photo placeholders (shown about 40 × 45 px) |
| `public/brand/logo-224.webp` | Public site footer (shown 112 px wide) |
| `app/icon.png`, `app/apple-icon.png` | Browser tab and home-screen icons |
| `app/(site)/[lang]/opengraph-image.png` | Preview image when the site is shared |

## Wording that still lives in code

Names, colours, contact details, currency and plan come from the environment. The public page copy (headlines, area names, "Duhok" references, the Arabic translations) is in `lib/i18n/en.ts`, `lib/i18n/ar.ts` and `lib/i18n/areas.ts`. Edit those files for a client in a different city or market; the optional `NEXT_PUBLIC_TAGLINE`, `NEXT_PUBLIC_ABOUT` and `NEXT_PUBLIC_ADDRESS` variables override only the English wording of those three items.

## Day-to-day

- `pnpm install`, then `pnpm dev` to run locally with a `.env.local` copied from `.env.example`.
- `pnpm typecheck` and `pnpm test` before pushing.

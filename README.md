# hz-portfolio

Personal portfolio for Hannah Marie Martinez, built around a celestial, storybook theme.

**Stack:** React 19, Vite, Supabase (Postgres, Auth, Storage), deployed on Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and anon key
npm run dev
```

## Supabase setup

Run `supabase/schema.sql`, then `supabase/seed.sql`, in the Supabase SQL editor. Replace the placeholder admin email in `schema.sql` with your own before running it.

## Scripts

`npm run dev` · `npm run build` · `npm run lint`

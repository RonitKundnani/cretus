# CRETUS 2026

Rebuild of the website for **Cretus — the Robotics & Automation Club of PDEU**, plus a
club-internal inventory management app. One repo, two Next.js apps, one shared Supabase
database.

```
web/         Public site — 3D, animated. Blog, projects, events + registration.   (Vercel #1)
inventory/   Login-gated inventory app for the committee.                          (Vercel #2)
supabase/    Shared database: migrations, seed, storage buckets.
```

**Theme** comes from the club logo (three leaves, center one a circuit board):
near-black base, circuit-green accent (`#39E63A`), forest-green secondary — a dark
"nature-meets-technology" look.

---

## 1. Supabase setup (do this first)

Both apps talk to the **same** Supabase project.

1. Open your Supabase project → **SQL Editor**.
2. Run each file in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_storage.sql`
   - `supabase/seed.sql` (placeholder content — optional but recommended)
3. Create the first committee login: **Authentication → Users → Add user** (email +
   password). A `profiles` row is created automatically. To make that user an admin, run
   in the SQL editor:
   ```sql
   update profiles set role = 'admin' where id = (
     select id from auth.users where email = 'you@example.com'
   );
   ```
4. Grab your keys from **Project Settings → API**: the *Project URL*, the *anon public*
   key, and (for the inventory app only) the *service_role* key.

## 2. Local development

Each app has its own env file. Copy the example and fill in the keys:

```bash
# public site
cd web
cp .env.example .env.local     # fill NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
npm install
npm run dev                    # http://localhost:3000

# inventory app (new terminal)
cd inventory
cp .env.example .env.local     # fill URL + ANON_KEY + SERVICE_ROLE_KEY
npm install
npm run dev -- -p 3001         # http://localhost:3001
```

## 3. Deploy (Vercel — two projects)

Create **two** Vercel projects from this repo, each with a different **Root Directory**:

| Vercel project | Root Directory | Env vars |
|---|---|---|
| cretus-web       | `web`       | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| cretus-inventory | `inventory` | the two above **+** `SUPABASE_SERVICE_ROLE_KEY` |

Both point at the same Supabase project.

---

## Tech
- **Next.js 16** (App Router, TypeScript), **Tailwind CSS v4**
- **web**: React Three Fiber + drei (3D), Framer Motion + Lenis (animation), react-markdown
- **inventory**: TanStack Table, React Hook Form + Zod, Recharts
- **Supabase**: Postgres + Auth + Storage, secured with Row Level Security

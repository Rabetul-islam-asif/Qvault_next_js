# 🚀 Deployment Guide (Netlify + Supabase)

Your project is now fully configured for deployment! Follow these steps to go live.

## 1. Environment Variables (Netlify)

Go to **Site Settings > Build & deploy > Environment variables** and add the following:

| Key | Value | Description |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://imeykplylnqymupmofcb.supabase.co` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[YOUR_ANON_KEY]` | Found in `.env` or Supabase Dashboard |
| `DATABASE_URL` | `postgresql://postgres.imeykplylnqymupmofcb:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | **Transaction Pooler** connection string |
| `DIRECT_URL` | `postgresql://postgres:[PASSWORD]@db.imeykplylnqymupmofcb.supabase.co:5432/postgres` | **Direct** connection string |
| `NEXTAUTH_URL` | `https://[your-site].netlify.app` | Your production URL (update after deploy) |
| `NEXTAUTH_SECRET` | `[GENERATE_A_SECRET]` | Run `openssl rand -base64 32` to generate |
| `NEXT_PUBLIC_IMGBB_API_KEY` | `659c558f44d89bffc201c4e258836605` | Image hosting key |

> **⚠️ IMPORTANT:** Replace `[PASSWORD]` with your actual Supabase database password.

## 2. Database Migration

Since we switched to PostgreSQL, you need to push your schema to the Supabase database.
Run this **locally** before deploying:

```bash
# 1. Update .env with your real password
# 2. Push schema to Supabase
npx prisma db push
```

## 3. Deploy

1.  Push your code to GitHub/GitLab.
2.  Import the project in Netlify.
3.  Netlify will detect `netlify.toml` and build automatically.

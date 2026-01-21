# Quick Setup Guide

Follow these steps to get LiveNote running on your machine in under 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: LiveNote (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project" and wait 2-3 minutes

## Step 3: Set Up Database

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open `supabase-schema.sql` in this project
4. Copy ALL the SQL and paste it into the query editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 4: Enable Realtime

1. Go to **Database > Replication** (left sidebar)
2. Find the `notes` table
3. Toggle it **ON** (should turn green)

Alternatively, run this in SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

## Step 5: Get API Keys

1. Go to **Settings > API** (left sidebar)
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 6: Configure Environment

1. Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and paste your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-long-key
```

## Step 7: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 8: Create Account & Test

1. Click **Sign up**
2. Enter email and password
3. You'll be logged in automatically
4. Click the **+** button to create your first note!

## Verify Real-time Sync

1. Open [http://localhost:3000](http://localhost:3000) in TWO browser windows
2. Log in with the same account in both
3. Create or edit a note in one window
4. Watch it update in the other window automatically!

---

## Next Steps

- Read the full [README.md](./README.md) for more details
- Deploy to Vercel (see README.md)
- Customize colors, add features, make it yours!

## Troubleshooting

**Can't log in?**
- Check that `supabase-schema.sql` ran successfully
- Verify `.env.local` has correct values

**Real-time not working?**
- Check that you enabled replication for `notes` table
- Try running the `ALTER PUBLICATION` command again

**Build errors?**
- Delete `.next` and `node_modules`, run `npm install` again
- Check that you're using Node.js 18+

Need help? Check the full README.md or Supabase docs.

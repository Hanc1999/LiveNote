# LiveNote - Quick Start Checklist

Get LiveNote running in 5 simple steps!

## Prerequisites
- [x] Node.js 18+ installed
- [ ] Supabase account (free tier is fine)

## Step-by-Step Setup

### 1️⃣ Install Dependencies
```bash
npm install
```
✅ Status: Already completed (477 packages installed)

### 2️⃣ Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `livenote` (or any name)
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Click "Create new project"
5. Wait 2-3 minutes for setup

**Status**: ⏳ Waiting for you to complete

### 3️⃣ Set Up Database
1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click "New Query"
4. Open `supabase-schema.sql` from this project
5. Copy ALL the SQL code
6. Paste into Supabase SQL Editor
7. Click "Run" or press Cmd/Ctrl + Enter
8. Should see "Success. No rows returned"

**Status**: ⏳ Waiting for you to complete

### 4️⃣ Enable Realtime
1. Go to **Database > Replication** (left sidebar)
2. Find the `notes` table in the list
3. Toggle it **ON** (should turn green)

Alternatively, run this in SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

**Status**: ⏳ Waiting for you to complete

### 5️⃣ Configure Environment
1. Go to **Settings > API** in Supabase dashboard
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ`)
3. Edit `.env.local` in this project
4. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciO...your-actual-key
```

**Status**: ⏳ Waiting for you to complete

## 🚀 Launch the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test It Out

1. Click "Sign up" and create an account
2. You'll be auto-logged in
3. Click the **+** button to create your first note
4. Choose "Markdown" or "Todo List"
5. Start editing - it auto-saves!

## 🔄 Test Real-time Sync

1. Open [http://localhost:3000](http://localhost:3000) in TWO browser windows
2. Log in with the same account in both
3. Create or edit a note in one window
4. Watch it update in the other window instantly!

## 🎉 You're Done!

Your LiveNote app is now running! Here's what you can do:

- **Create Notes**: Click the + button
- **Edit Notes**: Click any note card
- **Change Colors**: Use the color picker in the editor
- **Add Todos**: Create a todo list note and add items
- **Sync Devices**: Open on multiple devices with same account

## 📱 Test on Mobile

1. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Open `http://YOUR_IP:3000` on your phone (must be on same WiFi)
3. Test the mobile-responsive design!

## 🚢 Ready to Deploy?

See `DEPLOYMENT.md` for instructions on deploying to Vercel.

## ❓ Troubleshooting

**Can't log in?**
- Check that you ran `supabase-schema.sql` successfully
- Verify `.env.local` has correct values (not placeholders)
- Check Supabase dashboard for errors

**Real-time not working?**
- Verify you enabled replication for `notes` table
- Check browser console for WebSocket connection errors
- Try running the `ALTER PUBLICATION` command again

**Build errors?**
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check that you're using Node.js 18+

**Still stuck?**
- Check the full `README.md` for detailed docs
- Review `SETUP.md` for step-by-step instructions
- Check [Supabase docs](https://supabase.com/docs)

---

**Need more help?** Check out:
- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `PROJECT_SUMMARY.md` - Implementation overview
- `DEPLOYMENT.md` - Deployment instructions

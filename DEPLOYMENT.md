# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps and has excellent integration with Next.js.

### Prerequisites

- GitHub account
- Vercel account (free tier works great)
- Your Supabase project set up and running

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/livenote.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Use the same values from your `.env.local` file!

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

### Step 5: Configure Supabase (Important!)

Update your Supabase project to allow your Vercel domain:

1. Go to Supabase Dashboard > **Authentication > URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**`

### Step 6: Test

1. Visit your Vercel URL
2. Sign up with a new account
3. Create a note
4. Test on mobile by visiting the URL on your phone

## Deploying to Other Platforms

### Netlify

1. Similar to Vercel, connect your GitHub repo
2. Add environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `.next`

### Self-Hosting with Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t livenote .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... livenote
```

## Domain Setup

### Custom Domain on Vercel

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `notes.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update Supabase allowed URLs to include your custom domain

## Performance Tips

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Enable Edge Runtime for API Routes

For faster global performance, you can enable Edge runtime for specific routes by adding:

```tsx
export const runtime = 'edge'
```

## Monitoring

### Vercel Logs

- View deployment logs in Vercel dashboard
- Check runtime logs for errors
- Monitor performance metrics

### Supabase Monitoring

- Database > Logs: SQL queries
- Database > Reports: Performance metrics
- API > Logs: Authentication events

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify TypeScript types are correct
- Review build logs in Vercel

### Authentication Not Working

- Verify environment variables are set correctly
- Check that redirect URLs are configured in Supabase
- Ensure site URL matches your deployed domain

### Real-time Not Working in Production

- Verify replication is enabled for `notes` table
- Check that WebSocket connections aren't blocked
- Test with browser dev tools open to see connection status

## Scaling

As your app grows:

1. **Database**: Upgrade Supabase plan for more connections/storage
2. **CDN**: Vercel automatically uses CDN for static assets
3. **Caching**: Add Redis for session caching if needed
4. **Images**: Use Next.js Image Optimization (built-in)

## Security Checklist

- ✅ Environment variables stored securely (not in code)
- ✅ Supabase Row Level Security (RLS) enabled
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Allowed domains configured in Supabase
- ✅ No sensitive keys in client-side code

---

Your LiveNote app is now live and ready for users! 🎉

# LiveNote - Cross-Device Live Notebook

A beautiful, responsive notebook application built with Next.js 15, Supabase, and TailwindCSS. Create and sync markdown notes and todo lists across all your devices in real-time.

## Features

- **User Authentication**: Secure email/password authentication with Supabase
- **Two Note Types**:
  - Markdown notes with rich text editing (headings, bold, italic, lists, code blocks)
  - Interactive todo lists with progress tracking
- **Real-time Sync**: Changes sync automatically across all devices
- **Auto-save**: Notes save automatically as you type (debounced)
- **Color Coding**: Choose from 8 colors to organize your notes
- **Responsive Design**: Beautiful UI that works on phones, tablets, and desktops
- **Card-based Dashboard**: Clean, visual interface without folders

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS + shadcn/ui
- **Editor**: Tiptap (markdown)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the contents of `supabase-schema.sql` and run it in the SQL Editor
5. Go to **Settings > API** and copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Enable Supabase Realtime (Important!)

For real-time sync to work:

1. Go to **Database > Replication** in your Supabase dashboard
2. Enable replication for the `notes` table
3. OR run this SQL command:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the login page!

### 6. Create an Account

1. Click "Sign up" and create an account
2. You'll be automatically logged in and redirected to the dashboard
3. Create your first note!

## Project Structure

```
live_notebook/
├── app/
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   └── callback/      # OAuth callback handler
│   ├── dashboard/         # Main dashboard
│   ├── notes/[id]/        # Note editor (markdown & todo)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page (redirects to dashboard)
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   │   ├── note-card.tsx  # Note preview card
│   │   └── new-note-dialog.tsx
│   └── editor/            # Editor components
│       ├── markdown-editor.tsx
│       ├── todo-editor.tsx
│       └── color-picker.tsx
├── lib/
│   ├── supabase/          # Supabase clients
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── middleware.ts  # Middleware helper
│   ├── hooks/             # Custom React hooks
│   │   ├── use-notes.ts   # Note CRUD + realtime
│   │   ├── use-auth.ts    # Auth state
│   │   └── use-realtime.ts
│   ├── types/             # TypeScript types
│   └── utils.ts           # Utility functions
├── middleware.ts          # Route protection
└── supabase-schema.sql    # Database schema
```

## Usage Guide

### Creating Notes

1. Click the **+ button** (bottom-right on mobile, or "Create Note" button)
2. Choose between:
   - **Markdown**: For writing notes, ideas, research
   - **Todo List**: For tasks, shopping lists, checklists
3. Give it a title and start editing!

### Markdown Editor

- **Toolbar**: Use buttons for formatting (bold, italic, headings, lists, code)
- **Keyboard Shortcuts**:
  - `# ` for heading 1
  - `## ` for heading 2
  - `**text**` for bold
  - `*text*` for italic
  - `- ` for bullet list
  - `1. ` for numbered list
- **Auto-save**: Changes save automatically 1 second after you stop typing

### Todo Lists

- **Add items**: Type in the input at the bottom and press Enter or click "Add"
- **Complete items**: Click the checkbox to mark as done
- **Edit items**: Click on the text to edit
- **Delete items**: Hover over an item and click the trash icon
- **Progress bar**: Shows how many items you've completed

### Color Coding

- Click any color in the note editor header to change the note's color
- Colors help you visually organize notes (e.g., yellow for important, blue for work)

### Deleting Notes

1. Click the **⋮ menu** on any note card
2. Select "Delete"
3. Confirm deletion

### Real-time Sync

- Open LiveNote on multiple devices with the same account
- Changes appear on all devices within seconds
- No manual refresh needed!

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Your app will be live at `https://your-app.vercel.app`

## Troubleshooting

### "No data" or notes not loading

- Check that you ran the `supabase-schema.sql` file
- Verify your `.env.local` has the correct Supabase credentials
- Check browser console for errors

### Real-time sync not working

- Make sure you enabled replication for the `notes` table in Supabase
- Run: `ALTER PUBLICATION supabase_realtime ADD TABLE notes;`

### Authentication errors

- Check that your Supabase URL and anon key are correct
- Make sure you're using the **anon/public** key, not the service role key

### Build errors

- Delete `.next` folder and `node_modules`, then run `npm install` again
- Make sure you're using Node.js 18 or higher

## Future Enhancements

Potential features to add:

- [ ] Search functionality
- [ ] Tags for organization
- [ ] Note sharing (public links)
- [ ] Export notes (PDF, markdown)
- [ ] Dark mode
- [ ] Keyboard shortcuts panel
- [ ] Offline support (PWA)
- [ ] Rich text: images, tables, embeds
- [ ] Note templates
- [ ] Mobile apps (React Native)

## Contributing

This is a personal project, but feel free to fork and customize it for your needs!

## License

MIT License - feel free to use this project however you like.

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the [Supabase docs](https://supabase.com/docs)
3. Check [Next.js docs](https://nextjs.org/docs)

---

Built with ❤️ using Next.js and Supabase

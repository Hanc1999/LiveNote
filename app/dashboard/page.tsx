'use client'

import { useState } from 'react'
import { useNotes } from '@/lib/hooks/use-notes'
import { useAuth } from '@/lib/hooks/use-auth'
import { NoteCard } from '@/components/dashboard/note-card'
import { NewNoteDialog } from '@/components/dashboard/new-note-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, User, LogOut, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { NoteType } from '@/lib/types/database.types'

export default function DashboardPage() {
  const { notes, loading, createNote, deleteNote } = useNotes()
  const { user, signOut } = useAuth()
  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false)
  const router = useRouter()

  const handleCreateNote = async (title: string, type: NoteType) => {
    const defaultContent = type === 'markdown'
      ? { type: 'markdown' as const, markdown: '' }
      : { type: 'todo' as const, items: [] }

    return await createNote(title, type, defaultContent)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">LiveNote</h1>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LiveNote</h2>
              <p className="text-gray-600">Create your first note to get started</p>
            </div>
            <Button
              size="lg"
              onClick={() => setNewNoteDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Note
            </Button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {notes.length > 0 && (
        <button
          onClick={() => setNewNoteDialogOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* New Note Dialog */}
      <NewNoteDialog
        open={newNoteDialogOpen}
        onOpenChange={setNewNoteDialogOpen}
        onCreate={handleCreateNote}
      />
    </div>
  )
}

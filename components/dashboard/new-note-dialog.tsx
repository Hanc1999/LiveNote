'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, CheckSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { NoteType } from '@/lib/types/database.types'

interface NewNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (title: string, type: NoteType) => Promise<{ id: string }>
}

export function NewNoteDialog({ open, onOpenChange, onCreate }: NewNoteDialogProps) {
  const [selectedType, setSelectedType] = useState<NoteType | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!title.trim() || !selectedType) return

    setLoading(true)
    try {
      const note = await onCreate(title, selectedType)
      onOpenChange(false)
      setTitle('')
      setSelectedType(null)
      router.push(`/notes/${note.id}`)
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetDialog = () => {
    setTitle('')
    setSelectedType(null)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) resetDialog()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Choose a note type and give it a title
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!selectedType ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedType('markdown')}
                className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <FileText className="h-12 w-12 text-blue-600" />
                <div className="text-center">
                  <p className="font-semibold">Markdown</p>
                  <p className="text-xs text-gray-500">For research & ideas</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('todo')}
                className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <CheckSquare className="h-12 w-12 text-purple-600" />
                <div className="text-center">
                  <p className="font-semibold">Todo List</p>
                  <p className="text-xs text-gray-500">For tasks & shopping</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {selectedType === 'markdown' ? (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Markdown Note</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    <span>Todo List</span>
                  </>
                )}
                <button
                  onClick={() => setSelectedType(null)}
                  className="ml-auto text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Note Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate()
                  }}
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCreate}
                  disabled={!title.trim() || loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Note'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

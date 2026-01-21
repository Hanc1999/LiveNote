'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MarkdownEditor } from '@/components/editor/markdown-editor'
import { TodoEditor } from '@/components/editor/todo-editor'
import { ColorPicker } from '@/components/editor/color-picker'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Note, NoteColor, MarkdownContent, TodoContent, TodoItem, Json } from '@/lib/types/database.types'

// Debounce function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [markdownContent, setMarkdownContent] = useState('')
  const [todoItems, setTodoItems] = useState<TodoItem[]>([])
  const [color, setColor] = useState<NoteColor>('blue')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const isInitialLoad = useRef(true)
  const isMounted = useRef(true)
  const hasLoadedData = useRef(false)
  const originalTitle = useRef<string>('')
  const router = useRouter()
  const supabase = createClient()

  // Debounced values for auto-save
  const debouncedTitle = useDebounce(title, 1000)
  const debouncedMarkdownContent = useDebounce(markdownContent, 1000)
  const debouncedTodoItems = useDebounce(JSON.stringify(todoItems), 1000)
  const debouncedColor = useDebounce(color, 500)

  // Track component mounted state and cleanup
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      // Reset flags on unmount
      isInitialLoad.current = true
      hasLoadedData.current = false
      originalTitle.current = ''
    }
  }, [])

  // Fetch note on mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()

        if (error) throw error

        setNote(data)
        setTitle(data.title)
        setColor(data.color as NoteColor)

        // Store original data for validation
        originalTitle.current = data.title

        if (data.note_type === 'markdown') {
          const content = data.content as MarkdownContent
          setMarkdownContent(content.markdown || '')
        } else if (data.note_type === 'todo') {
          const content = data.content as TodoContent
          setTodoItems(content.items || [])
        }

        // Mark data as loaded and initial load as complete after a longer delay
        hasLoadedData.current = true
        setTimeout(() => {
          isInitialLoad.current = false
        }, 1500) // Increased delay to 1.5 seconds
      } catch (error) {
        console.error('Failed to fetch note:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [resolvedParams.id, router, supabase])

  // Auto-save effect
  useEffect(() => {
    // Basic checks
    if (!note || loading || isInitialLoad.current) return

    // HARD RULE: NEVER save empty/default values to an existing note
    // This prevents data loss when navigating away quickly
    const isEmptyTitle = !debouncedTitle || debouncedTitle.trim() === ''
    const isEmptyMarkdown = note.note_type === 'markdown' && debouncedMarkdownContent === ''
    const isEmptyTodo = note.note_type === 'todo' && JSON.parse(debouncedTodoItems).length === 0

    // If trying to save empty data, abort immediately
    if (isEmptyTitle || isEmptyMarkdown || isEmptyTodo) {
      console.log('Blocked save: attempting to save empty values to existing note')
      return
    }

    const saveNote = async () => {
      // Check if component is still mounted
      if (!isMounted.current) return

      setSaveStatus('saving')
      try {
        let updatedContent: MarkdownContent | TodoContent

        if (note.note_type === 'markdown') {
          updatedContent = {
            type: 'markdown',
            markdown: debouncedMarkdownContent,
          }
        } else {
          updatedContent = {
            type: 'todo',
            items: JSON.parse(debouncedTodoItems),
          }
        }

        // Final check before saving
        if (!isMounted.current) return

        const { error } = await supabase
          .from('notes')
          .update({
            title: debouncedTitle,
            content: updatedContent as unknown as Json,
            color: debouncedColor,
          })
          .eq('id', resolvedParams.id)

        if (error) throw error

        // Only update status if still mounted
        if (isMounted.current) {
          setSaveStatus('saved')
        }
      } catch (error) {
        console.error('Failed to save note:', error)
        if (isMounted.current) {
          setSaveStatus('error')
        }
      }
    }

    saveNote()
  }, [debouncedTitle, debouncedMarkdownContent, debouncedTodoItems, debouncedColor, note, loading, resolvedParams.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!note) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="text-lg font-semibold border-0 focus-visible:ring-0 px-0"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && 'Saved'}
                {saveStatus === 'error' && 'Error saving'}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-600">Color:</span>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {note.note_type === 'markdown' ? (
          <MarkdownEditor
            content={markdownContent}
            onChange={setMarkdownContent}
            placeholder="Start writing your note..."
          />
        ) : (
          <div className="bg-white rounded-lg border p-6">
            <TodoEditor
              items={todoItems}
              onChange={setTodoItems}
            />
          </div>
        )}
      </main>
    </div>
  )
}

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
  const [isScrolled, setIsScrolled] = useState(false)
  const isInitialLoad = useRef(true)
  const isMounted = useRef(true)
  const dataLoadedRef = useRef(false)
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
    dataLoadedRef.current = false
    return () => {
      isMounted.current = false
      dataLoadedRef.current = false
    }
  }, [])

  // Track scroll position to hide/show color picker
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

        if (data.note_type === 'markdown') {
          const content = data.content as MarkdownContent
          setMarkdownContent(content.markdown || '')
        } else if (data.note_type === 'todo') {
          const content = data.content as TodoContent
          setTodoItems(content.items || [])
        }

        // Mark data as loaded - wait a bit to ensure state updates complete
        setTimeout(() => {
          dataLoadedRef.current = true
          isInitialLoad.current = false
        }, 500)
      } catch (error) {
        console.error('Failed to fetch note:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [resolvedParams.id, router, supabase])

  // Auto-save effect - only runs after data is confirmed loaded
  useEffect(() => {
    // Don't save until we've confirmed data is loaded from database
    if (!note || loading || !dataLoadedRef.current) return

    // Additional safety: don't save if component is unmounted
    if (!isMounted.current) return

    const saveNote = async () => {
      // Double-check component is still mounted before starting
      if (!isMounted.current || !dataLoadedRef.current) return

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

        // CRITICAL: Validate data right before database write
        // If component unmounted or data invalid during the async operation, abort
        if (!isMounted.current || !dataLoadedRef.current) {
          console.log('Save aborted: component unmounted or data not loaded')
          return
        }

        // Additional validation: don't save if title is empty (likely a race condition)
        if (!debouncedTitle || debouncedTitle.trim() === '') {
          console.log('Save aborted: empty title detected')
          return
        }

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

          {!isScrolled && (
            <div className="mt-4 flex items-center gap-4 transition-opacity duration-200">
              <span className="text-sm text-gray-600">Color:</span>
              <ColorPicker value={color} onChange={setColor} />
            </div>
          )}
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

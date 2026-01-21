import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Note } from '@/lib/types/database.types'

interface UseRealtimeOptions {
  onInsert?: (note: Note) => void
  onUpdate?: (note: Note) => void
  onDelete?: (noteId: string) => void
}

export function useRealtime({ onInsert, onUpdate, onDelete }: UseRealtimeOptions) {
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to changes on the notes table
    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notes',
        },
        (payload) => {
          console.log('Note inserted:', payload)
          if (onInsert && payload.new) {
            onInsert(payload.new as Note)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes',
        },
        (payload) => {
          console.log('Note updated:', payload)
          if (onUpdate && payload.new) {
            onUpdate(payload.new as Note)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notes',
        },
        (payload) => {
          console.log('Note deleted:', payload)
          if (onDelete && payload.old) {
            onDelete((payload.old as Note).id)
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [onInsert, onUpdate, onDelete, supabase])
}

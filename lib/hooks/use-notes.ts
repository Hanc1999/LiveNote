import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Note, NoteType, NoteColor, NoteContent, Json } from '@/lib/types/database.types'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error

      setNotes(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  // Create a new note
  const createNote = async (
    title: string,
    noteType: NoteType,
    content: NoteContent,
    color: NoteColor = 'blue'
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: userData.user.id,
          title,
          note_type: noteType,
          content: content as unknown as Json,
          color,
        })
        .select()
        .single()

      if (error) throw error

      setNotes((prev) => [data, ...prev])
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note'
      setError(message)
      throw new Error(message)
    }
  }

  // Update a note
  const updateNote = async (
    id: string,
    updates: {
      title?: string
      content?: NoteContent
      color?: NoteColor
    }
  ) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          content: updates.content as unknown as Json,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? data : note))
      )
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update note'
      setError(message)
      throw new Error(message)
    }
  }

  // Delete a note
  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note'
      setError(message)
      throw new Error(message)
    }
  }

  // Fetch notes on mount and subscribe to real-time updates
  useEffect(() => {
    fetchNotes()

    // Subscribe to real-time changes
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
          const newNote = payload.new as Note
          // Only add the note if it's from another session (avoid duplicates)
          setNotes((prev) => {
            if (prev.some((note) => note.id === newNote.id)) {
              return prev
            }
            return [newNote, ...prev]
          })
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
          const updatedNote = payload.new as Note
          setNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
          )
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
          const deletedNote = payload.old as Note
          setNotes((prev) => prev.filter((note) => note.id !== deletedNote.id))
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}

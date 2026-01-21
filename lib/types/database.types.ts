export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type NoteType = 'markdown' | 'todo'

export type NoteColor = 'blue' | 'green' | 'yellow' | 'orange' | 'pink' | 'purple' | 'gray' | 'red'

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  order: number
}

export interface MarkdownContent {
  type: 'markdown'
  markdown: string
}

export interface TodoContent {
  type: 'todo'
  items: TodoItem[]
}

export type NoteContent = MarkdownContent | TodoContent

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          note_type: NoteType
          content: Json
          color: NoteColor
          created_at: string
          updated_at: string
          position: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          note_type: NoteType
          content: Json
          color?: NoteColor
          created_at?: string
          updated_at?: string
          position?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          note_type?: NoteType
          content?: Json
          color?: NoteColor
          created_at?: string
          updated_at?: string
          position?: number
        }
      }
    }
  }
}

export type Note = Database['public']['Tables']['notes']['Row']

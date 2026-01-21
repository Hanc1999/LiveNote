import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Trash2, FileText, CheckSquare } from 'lucide-react'
import type { Note, NoteColor, MarkdownContent, TodoContent } from '@/lib/types/database.types'
import Link from 'next/link'

const colorClasses: Record<NoteColor, string> = {
  blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  green: 'bg-green-50 border-green-200 hover:bg-green-100',
  yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
  purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
  red: 'bg-red-50 border-red-200 hover:bg-red-100',
}

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const getPreviewText = () => {
    if (note.note_type === 'markdown') {
      const content = note.content as unknown as MarkdownContent
      return content.markdown.slice(0, 150)
    } else {
      const content = note.content as unknown as TodoContent
      const completedCount = content.items.filter(item => item.completed).length
      return `${completedCount}/${content.items.length} completed`
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id)
    }
  }

  return (
    <Link href={`/notes/${note.id}`}>
      <Card className={`cursor-pointer transition-all duration-200 ${colorClasses[note.color as NoteColor]}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {note.note_type === 'markdown' ? (
                <FileText className="h-4 w-4 flex-shrink-0 text-gray-600" />
              ) : (
                <CheckSquare className="h-4 w-4 flex-shrink-0 text-gray-600" />
              )}
              <CardTitle className="text-lg truncate">{note.title}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-3">{getPreviewText()}</p>
          <p className="text-xs text-gray-400 mt-3">
            {new Date(note.updated_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import type { TodoItem } from '@/lib/types/database.types'

interface TodoEditorProps {
  items: TodoItem[]
  onChange: (items: TodoItem[]) => void
}

export function TodoEditor({ items, onChange }: TodoEditorProps) {
  const [newItemText, setNewItemText] = useState('')

  const handleToggle = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    onChange(updatedItems)
  }

  const handleTextChange = (id: string, text: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text } : item
    )
    onChange(updatedItems)
  }

  const handleDelete = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    onChange(updatedItems)
  }

  const handleAddItem = () => {
    if (!newItemText.trim()) return

    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      text: newItemText,
      completed: false,
      order: items.length,
    }

    onChange([...items, newItem])
    setNewItemText('')
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-gray-600">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Todo Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No items yet. Add your first todo below!
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => handleToggle(item.id)}
                className="mt-1"
              />
              <Input
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                className={`flex-1 border-0 focus-visible:ring-0 ${
                  item.completed ? 'line-through text-gray-400' : ''
                }`}
                placeholder="Todo item..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add New Item */}
      <div className="flex gap-2 pt-4 border-t">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add a new item..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddItem()
          }}
        />
        <Button onClick={handleAddItem} disabled={!newItemText.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  )
}

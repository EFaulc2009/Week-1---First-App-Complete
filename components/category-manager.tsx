"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Plus } from "lucide-react"
import type { Category } from "@/components/workout"
import { cn } from "@/lib/utils"

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (category: Omit<Category, "id">) => void
  onUpdate: (id: string, data: Partial<Category>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function CategoryManager({ categories, onAdd, onUpdate, onDelete, onClose }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")

  const predefinedColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
  ]

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    onAdd({
      name: newCategoryName.trim(),
      color: newCategoryColor,
    })

    setNewCategoryName("")
    setNewCategoryColor("#3b82f6")
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditColor(category.color)
  }

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return

    onUpdate(editingId, {
      name: editName.trim(),
      color: editColor,
    })

    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Manage Categories</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              {editingId === category.id ? (
                <>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                  <div className="grid grid-cols-5 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          editColor === color ? "border-gray-900 scale-110" : "border-gray-300",
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditColor(color)}
                      />
                    ))}
                  </div>
                  <Button size="sm" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="flex-1">{category.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => startEditing(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Add New Category</h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    newCategoryColor === color ? "border-gray-900 scale-110" : "border-gray-300",
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                />
              ))}
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

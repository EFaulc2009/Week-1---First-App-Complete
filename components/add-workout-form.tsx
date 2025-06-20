"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Category, WorkoutTask } from "@/components/workout"

interface AddWorkoutFormProps {
  categories: Category[]
  onAdd: (task: Omit<WorkoutTask, "id" | "createdAt">) => void
  onCancel: () => void
}

export function AddWorkoutForm({ categories, onAdd, onCancel }: AddWorkoutFormProps) {
  const [title, setTitle] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
  const [details, setDetails] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({
      title,
      categoryId,
      details: details.trim() || undefined,
      exercises: [],
      completed: false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Workout Name</Label>
        <Input
          id="title"
          placeholder="E.g., Chest Day, Leg Day, Cardio Session"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Details (Optional)</Label>
        <Textarea
          id="details"
          placeholder="Add workout details, goals, or notes"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Workout</Button>
      </div>
    </form>
  )
}

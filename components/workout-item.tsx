"use client"

import { useState } from "react"
import { Check, Plus, Trash2, Edit, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Category, WorkoutTask, Exercise, ExerciseSet } from "@/components/workout"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface WorkoutItemProps {
  task: WorkoutTask
  category: Category
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, task: Partial<WorkoutTask>) => void
}

export function WorkoutItem({ task, category, onToggleComplete, onDelete, onUpdate }: WorkoutItemProps) {
  const [newExerciseName, setNewExerciseName] = useState("")
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({})
  const [editingDetails, setEditingDetails] = useState(false)
  const [editDetailsValue, setEditDetailsValue] = useState(task.details || "")
  const [editingNotes, setEditingNotes] = useState(false)
  const [editNotesValue, setEditNotesValue] = useState(task.notes || "")

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })

  const toggleExerciseExpand = (exerciseId: string) => {
    setExpandedExercises({
      ...expandedExercises,
      [exerciseId]: !expandedExercises[exerciseId],
    })
  }

  const addExercise = () => {
    if (!newExerciseName.trim()) return

    const newExercise: Exercise = {
      id: Math.random().toString(36).substring(2, 9),
      name: newExerciseName.trim(),
      sets: [],
    }

    onUpdate(task.id, {
      exercises: [...task.exercises, newExercise],
    })

    setNewExerciseName("")
    // Auto-expand the new exercise
    setExpandedExercises({
      ...expandedExercises,
      [newExercise.id]: true,
    })
  }

  const addSet = (exerciseId: string) => {
    const newSet: ExerciseSet = {
      id: Math.random().toString(36).substring(2, 9),
      reps: 0,
      weight: undefined,
    }

    const updatedExercises = task.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [...exercise.sets, newSet],
        }
      }
      return exercise
    })

    onUpdate(task.id, { exercises: updatedExercises })
  }

  const updateSet = (exerciseId: string, setId: string, data: Partial<ExerciseSet>) => {
    const updatedExercises = task.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...data } : set)),
        }
      }
      return exercise
    })

    onUpdate(task.id, { exercises: updatedExercises })
  }

  const deleteSet = (exerciseId: string, setId: string) => {
    const updatedExercises = task.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((set) => set.id !== setId),
        }
      }
      return exercise
    })

    onUpdate(task.id, { exercises: updatedExercises })
  }

  const deleteExercise = (exerciseId: string) => {
    const updatedExercises = task.exercises.filter((exercise) => exercise.id !== exerciseId)
    onUpdate(task.id, { exercises: updatedExercises })
  }

  const startEditingDetails = () => {
    setEditingDetails(true)
    setEditDetailsValue(task.details || "")
  }

  const saveDetails = () => {
    onUpdate(task.id, { details: editDetailsValue.trim() || undefined })
    setEditingDetails(false)
  }

  const cancelEditingDetails = () => {
    setEditDetailsValue(task.details || "")
    setEditingDetails(false)
  }

  const startEditingNotes = () => {
    setEditingNotes(true)
    setEditNotesValue(task.notes || "")
  }

  const saveNotes = () => {
    onUpdate(task.id, { notes: editNotesValue.trim() || undefined })
    setEditingNotes(false)
  }

  const cancelEditingNotes = () => {
    setEditNotesValue(task.notes || "")
    setEditingNotes(false)
  }

  return (
    <Card className="overflow-hidden group">
      <div className="h-1" style={{ backgroundColor: category.color }} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn("h-6 w-6 rounded-full", task.completed && "bg-primary text-primary-foreground")}
                onClick={() => onToggleComplete(task.id)}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </Button>
              <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            </div>

            {(task.details || editingDetails) && (
              <div className="mt-2">
                {editingDetails ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDetailsValue}
                      onChange={(e) => setEditDetailsValue(e.target.value)}
                      placeholder="Add workout details, goals, or notes"
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveDetails}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditingDetails}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className={cn("text-sm text-muted-foreground flex-1", task.completed && "line-through")}>
                      <span className="font-medium">Details:</span> {task.details}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={startEditingDetails}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {(task.notes || editingNotes) && (
              <div className="mt-2">
                {editingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editNotesValue}
                      onChange={(e) => setEditNotesValue(e.target.value)}
                      placeholder="Add your notes here..."
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveNotes}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditingNotes}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className={cn("text-sm text-muted-foreground flex-1", task.completed && "line-through")}>
                      <span className="font-medium">Notes:</span> {task.notes}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={startEditingNotes}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!task.details && !editingDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
                onClick={startEditingDetails}
              >
                + Add details
              </Button>
            )}

            {!task.notes && !editingNotes && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
                onClick={startEditingNotes}
              >
                + Add notes
              </Button>
            )}

            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-4 border-t pt-4">
          <div className="space-y-3">
            {task.exercises.map((exercise) => (
              <div key={exercise.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleExerciseExpand(exercise.id)}
                    >
                      {expandedExercises[exercise.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteExercise(exercise.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {expandedExercises[exercise.id] && (
                  <div className="mt-3 space-y-3">
                    {exercise.sets.length > 0 ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                          <div className="col-span-1">#</div>
                          <div className="col-span-4">Reps</div>
                          <div className="col-span-5">Weight (optional)</div>
                          <div className="col-span-2"></div>
                        </div>
                        {exercise.sets.map((set, index) => (
                          <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1 text-sm">{index + 1}</div>
                            <div className="col-span-4">
                              <Input
                                type="number"
                                min="0"
                                value={set.reps}
                                onChange={(e) => updateSet(exercise.id, set.id, { reps: Number(e.target.value) || 0 })}
                                className="h-8"
                              />
                            </div>
                            <div className="col-span-5">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={set.weight ?? ""}
                                onChange={(e) =>
                                  updateSet(exercise.id, set.id, {
                                    weight: e.target.value ? Number(e.target.value) : undefined,
                                  })
                                }
                                placeholder="Optional"
                                className="h-8"
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteSet(exercise.id, set.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No sets added yet.</p>
                    )}

                    <Button variant="outline" size="sm" className="w-full" onClick={() => addSet(exercise.id)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Set
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new exercise..."
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addExercise}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

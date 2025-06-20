"use client"

import { useState, useEffect } from "react"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AddWorkoutForm } from "@/components/add-workout-form"
import { WorkoutItem } from "@/components/workout-item"
import { CategoryManager } from "@/components/category-manager"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Category = {
  id: string
  name: string
  color: string
}

export type ExerciseSet = {
  id: string
  reps: number
  weight?: number
}

export type Exercise = {
  id: string
  name: string
  sets: ExerciseSet[]
}

export type WorkoutTask = {
  id: string
  title: string
  categoryId: string
  completed: boolean
  details?: string
  exercises: Exercise[]
  createdAt: Date
  notes?: string
}

export function Workout() {
  const [tasks, setTasks] = useState<WorkoutTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutTasks")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return parsed.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            // Handle migration from old data structure
            exercises: task.exercises || [],
          }))
        } catch (e) {
          console.error("Error parsing saved tasks", e)
          return []
        }
      }
    }
    return []
  })

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCategories")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return [
      { id: "1", name: "Cardio", color: "#ef4444" },
      { id: "2", name: "Strength", color: "#3b82f6" },
      { id: "3", name: "Flexibility", color: "#10b981" },
    ]
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem("workoutTasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("workoutCategories", JSON.stringify(categories))
  }, [categories])

  const addTask = (task: Omit<WorkoutTask, "id" | "createdAt">) => {
    const newTask: WorkoutTask = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    }
    setTasks([newTask, ...tasks])
    setShowAddForm(false)
  }

  const toggleComplete = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const updateTask = (id: string, updatedTask: Partial<WorkoutTask>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
    }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, ...data } : category)))
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const filteredTasks = filter ? tasks.filter((task) => task.categoryId === filter) : tasks

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workout Tracker</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter(null)}>All workouts</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} onClick={() => setFilter(category.id)}>
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => setShowCategoryManager(true)}>
            Categories
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <AddWorkoutForm categories={categories} onAdd={addTask} onCancel={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      {showCategoryManager && (
        <Card>
          <CardContent className="pt-6">
            <CategoryManager
              categories={categories}
              onAdd={addCategory}
              onUpdate={updateCategory}
              onDelete={deleteCategory}
              onClose={() => setShowCategoryManager(false)}
            />
          </CardContent>
        </Card>
      )}

      {filter && (
        <div className="flex items-center">
          <div className="text-sm text-muted-foreground">
            Filtered by: {categories.find((c) => c.id === filter)?.name}
            <Button variant="link" className="h-auto p-0 ml-2" onClick={() => setFilter(null)}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No workouts yet. Add your first workout!</p>
        ) : (
          filteredTasks.map((task) => (
            <WorkoutItem
              key={task.id}
              task={task}
              category={
                categories.find((c) => c.id === task.categoryId) || { id: "", name: "Unknown", color: "#888888" }
              }
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))
        )}
      </div>
    </div>
  )
}

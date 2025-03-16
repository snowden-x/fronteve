"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserForm } from "@/components/forms/user-form"
import { UserRole } from "@/lib/types"
import { Loader2Icon } from "lucide-react"

export default function NewUserPage() {
  const { user } = useAuth()

  // Only admin should access this page
  if (user && user.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New User</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <UserForm />
      </div>
    </div>
  )
} 
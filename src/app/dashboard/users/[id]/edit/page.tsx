"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { UserForm } from "@/components/forms/user-form"
import { usersApi } from "@/lib/api"
import { User, UserRole } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Only admin should access this page
  if (currentUser && currentUser.role !== UserRole.PHARMACY_STAFF) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await usersApi.getUser(Number(params.id))
        setUser(data)
      } catch (error) {
        console.error("Failed to fetch user:", error)
        toast.error("Failed to load user details")
        router.push("/dashboard/users")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser && currentUser.role === UserRole.PHARMACY_STAFF) {
      fetchUser()
    }
  }, [params.id, router, currentUser])

  if (!currentUser || loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <UserForm initialData={user} isEditing />
      </div>
    </div>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { usersApi } from "@/lib/api"
import { User, UserRole } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2Icon, PencilIcon } from "lucide-react"

export default function UserDetailsPage() {
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

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return "destructive"
      case UserRole.PHARMACY_STAFF:
        return "secondary"
      default:
        return "outline"
    }
  }

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
        <h1 className="text-3xl font-bold">User Details</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Username</h3>
              <p className="text-muted-foreground">{user.username}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">{user.email || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-medium">Full Name</h3>
              <p className="text-muted-foreground">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Role</h3>
              <div className="mt-1">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Phone Number</h3>
              <p className="text-muted-foreground">{user.phone_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-medium">Address</h3>
              <p className="text-muted-foreground">{user.address || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-medium">Account Created</h3>
              <p className="text-muted-foreground">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-muted-foreground">{formatDate(user.updated_at)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
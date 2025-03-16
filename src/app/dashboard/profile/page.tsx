"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usersApi, UserUpdateData } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2Icon } from "lucide-react"

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    address: user?.address || "",
  })

  if (!user) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Only include fields that have changed
      const updateData: UserUpdateData = {}
      
      if (formData.email !== user.email) updateData.email = formData.email
      if (formData.first_name !== user.first_name) updateData.first_name = formData.first_name
      if (formData.last_name !== user.last_name) updateData.last_name = formData.last_name
      if (formData.phone_number !== user.phone_number) updateData.phone_number = formData.phone_number
      if (formData.address !== user.address) updateData.address = formData.address

      // Only make the API call if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await usersApi.updateCurrentUser(updateData)
        
        // Update user in auth context
        setUser(updatedUser)
        
        // Update localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
        
        toast.success("Profile updated successfully")
      } else {
        toast.info("No changes to save")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Username</h3>
              <p className="text-muted-foreground">{user.username}</p>
            </div>
            <div>
              <h3 className="font-medium">Role</h3>
              <div className="mt-1">
                <Badge variant={user.role === "ADMIN" ? "destructive" : user.role === "STAFF" ? "secondary" : "outline"}>
                  {user.role}
                </Badge>
              </div>
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
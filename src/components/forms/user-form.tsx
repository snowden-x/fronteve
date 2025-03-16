"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User, UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usersApi, UserUpdateData } from "@/lib/api"
import { toast } from "sonner"

// Form validation schema for editing
const userEditFormSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  first_name: z.string().optional().or(z.literal("")),
  last_name: z.string().optional().or(z.literal("")),
  phone_number: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  role: z.string().optional(),
})

// Form validation schema for creating new user
const userCreateFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password2: z.string().min(8, "Password confirmation is required"),
  first_name: z.string().optional().or(z.literal("")),
  last_name: z.string().optional().or(z.literal("")),
  phone_number: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  role: z.string().optional(),
}).refine((data) => data.password === data.password2, {
  message: "Passwords do not match",
  path: ["password2"],
})

type UserEditFormValues = z.infer<typeof userEditFormSchema>
type UserCreateFormValues = z.infer<typeof userCreateFormSchema>

interface UserFormProps {
  initialData?: User
  isEditing?: boolean
}

export function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Use the appropriate form schema based on whether we're editing or creating
  const form = useForm<UserEditFormValues | UserCreateFormValues>({
    resolver: zodResolver(isEditing ? userEditFormSchema : userCreateFormSchema),
    defaultValues: isEditing
      ? {
          email: initialData?.email || "",
          first_name: initialData?.first_name || "",
          last_name: initialData?.last_name || "",
          phone_number: initialData?.phone_number || "",
          address: initialData?.address || "",
          role: initialData?.role || "",
        }
      : {
          username: "",
          email: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
          phone_number: "",
          address: "",
          role: UserRole.CUSTOMER,
        },
  })

  const onSubmit = async (data: UserEditFormValues | UserCreateFormValues) => {
    try {
      setLoading(true)
      
      if (isEditing && initialData) {
        // For editing, we only need the fields in UserUpdateData
        const updateData: UserUpdateData = {
          email: data.email || undefined,
          first_name: data.first_name || undefined,
          last_name: data.last_name || undefined,
          phone_number: data.phone_number || undefined,
          address: data.address || undefined,
          role: data.role,
        }
        
        await usersApi.updateUser(initialData.id, updateData)
        toast.success("User updated successfully")
      } else {
        // For creating, we need to use the registration endpoint
        // This would typically be handled by the auth context
        const createData = data as UserCreateFormValues
        
        // Use the auth registration endpoint
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        })
        
        toast.success("User created successfully")
      }
      
      router.push("/dashboard/users")
      router.refresh()
    } catch (error) {
      console.error("Failed to save user:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isEditing && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditing && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={UserRole.PHARMACY_STAFF}>Staff</SelectItem>
                    <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update User" : "Add User"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
} 
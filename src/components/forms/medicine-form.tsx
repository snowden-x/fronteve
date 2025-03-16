"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Medicine } from "@/lib/api"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { medicinesApi } from "@/lib/api"
import { toast } from "sonner"

// Form validation schema
const medicineFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  generic_name: z.string().min(1, "Generic name is required"),
  description: z.string().min(1, "Description is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  dosage_form: z.string().min(1, "Dosage form is required"),
  strength: z.string().min(1, "Strength is required"),
  requires_prescription: z.boolean().default(false),
  contraindications: z.string().optional(),
  side_effects: z.string().optional(),
  storage_instructions: z.string().optional(),
  fda_approved: z.boolean().default(false),
})

type MedicineFormValues = z.infer<typeof medicineFormSchema>

interface MedicineFormProps {
  initialData?: Medicine
  isEditing?: boolean
}

export function MedicineForm({ initialData, isEditing = false }: MedicineFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      generic_name: initialData?.generic_name || "",
      description: initialData?.description || "",
      manufacturer: initialData?.manufacturer || "",
      dosage_form: initialData?.dosage_form || "",
      strength: initialData?.strength || "",
      requires_prescription: initialData?.requires_prescription || false,
      contraindications: initialData?.contraindications || "",
      side_effects: initialData?.side_effects || "",
      storage_instructions: initialData?.storage_instructions || "",
      fda_approved: initialData?.fda_approved || false,
    },
  })

  const onSubmit = async (data: MedicineFormValues) => {
    try {
      setLoading(true)
      
      // Log user authentication data
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      console.log('Auth Token during submit:', token)
      if (userData) {
        const user = JSON.parse(userData)
        console.log('User Data during submit:', user)
        console.log('User Role during submit:', user.role)
      }

      // Log the request data
      console.log('Submitting medicine data:', data)
      
      if (isEditing && initialData) {
        console.log('Updating medicine with ID:', initialData.id)
        try {
          const response = await medicinesApi.updateMedicine(initialData.id, data)
          console.log('Update response:', response)
          toast.success("Medicine updated successfully")
        } catch (error) {
          console.error('Update error:', error)
          if (error.response) {
            console.log('Error Response:', error.response)
            console.log('Error Status:', error.response.status)
            console.log('Error Data:', error.response.data)
          }
          throw error
        }
      } else {
        console.log('Creating new medicine')
        try {
          const response = await medicinesApi.createMedicine(data)
          console.log('Create response:', response)
          toast.success("Medicine created successfully")
        } catch (error) {
          console.error('Create error:', error)
          if (error.response) {
            console.log('Error Response:', error.response)
            console.log('Error Status:', error.response.status)
            console.log('Error Data:', error.response.data)
          }
          throw error
        }
      }
      
      router.push("/dashboard/medicines")
      router.refresh()
    } catch (error) {
      console.error("Failed to save medicine:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const dosageForms = [
    "Tablet",
    "Capsule",
    "Liquid",
    "Injection",
    "Cream",
    "Ointment",
    "Gel",
    "Patch",
    "Inhaler",
    "Drops",
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter medicine name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="generic_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generic Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter generic name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter manufacturer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dosage_form"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage Form</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dosage form" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dosageForms.map((form) => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strength</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 500mg, 10ml" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="requires_prescription"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Requires Prescription</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fda_approved"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">FDA Approved</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter medicine description"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contraindications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraindications</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter contraindications"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="side_effects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Side Effects</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter side effects"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storage_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter storage instructions"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Medicine" : "Add Medicine"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/medicines")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
} 
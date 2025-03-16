"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MedicineForm } from "@/components/forms/medicine-form"
import { medicinesApi, Medicine } from "@/lib/api"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

export default function EditMedicinePage() {
  const params = useParams()
  const router = useRouter()
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check user data from localStorage
    const userData = localStorage.getItem('user_data')
    const token = localStorage.getItem('auth_token')
    
    console.log('Auth Token:', token)
    if (userData) {
      const user = JSON.parse(userData)
      console.log('User Data:', user)
      console.log('User Role:', user.role)
    } else {
      console.log('No user data found in localStorage')
    }

    const fetchMedicine = async () => {
      try {
        // Log the request headers
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        console.log('Request Headers:', headers)

        const data = await medicinesApi.getMedicine(Number(params.id))
        console.log('Medicine Data:', data)
        setMedicine(data)
      } catch (error) {
        console.error("Failed to fetch medicine:", error)
        // Log more details about the error
        if (error.response) {
          console.log('Error Response:', error.response)
          console.log('Error Status:', error.response.status)
          console.log('Error Data:', error.response.data)
        }
        toast.error("Failed to load medicine details")
        router.push("/dashboard/medicines")
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!medicine) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Medicine</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <MedicineForm initialData={medicine} isEditing />
      </div>
    </div>
  )
} 
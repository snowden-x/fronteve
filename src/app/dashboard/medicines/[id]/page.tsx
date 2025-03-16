"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { medicinesApi, Medicine } from "@/lib/api"
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
import { Loader2Icon, PencilIcon, TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function MedicineDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const data = await medicinesApi.getMedicine(Number(params.id))
        setMedicine(data)
      } catch (error) {
        console.error("Failed to fetch medicine:", error)
        toast.error("Failed to load medicine details")
        router.push("/dashboard/medicines")
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
  }, [params.id, router])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await medicinesApi.deleteMedicine(Number(params.id))
      toast.success("Medicine deleted successfully")
      router.push("/dashboard/medicines")
    } catch (error) {
      console.error("Failed to delete medicine:", error)
      toast.error("Failed to delete medicine")
    } finally {
      setDeleting(false)
    }
  }

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
        <h1 className="text-3xl font-bold">Medicine Details</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/medicines/${medicine.id}/edit`)}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleting}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  medicine and remove it from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p className="text-muted-foreground">{medicine.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Generic Name</h3>
              <p className="text-muted-foreground">{medicine.generic_name}</p>
            </div>
            <div>
              <h3 className="font-medium">Manufacturer</h3>
              <p className="text-muted-foreground">{medicine.manufacturer}</p>
            </div>
            <div>
              <h3 className="font-medium">Dosage Form</h3>
              <p className="text-muted-foreground">{medicine.dosage_form}</p>
            </div>
            <div>
              <h3 className="font-medium">Strength</h3>
              <p className="text-muted-foreground">{medicine.strength}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant={medicine.requires_prescription ? "destructive" : "outline"}>
                  {medicine.requires_prescription ? "Prescription Required" : "OTC"}
                </Badge>
                <Badge variant={medicine.fda_approved ? "secondary" : "outline"}>
                  {medicine.fda_approved ? "FDA Approved" : "Pending Approval"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {medicine.description}
              </p>
            </div>
            {medicine.contraindications && (
              <div>
                <h3 className="font-medium">Contraindications</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {medicine.contraindications}
                </p>
              </div>
            )}
            {medicine.side_effects && (
              <div>
                <h3 className="font-medium">Side Effects</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {medicine.side_effects}
                </p>
              </div>
            )}
            {medicine.storage_instructions && (
              <div>
                <h3 className="font-medium">Storage Instructions</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {medicine.storage_instructions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
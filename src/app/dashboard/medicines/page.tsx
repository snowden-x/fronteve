"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
  Loader2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { medicinesApi, Medicine, MedicineFilters } from "@/lib/api"

export default function MedicinesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [totalCount, setTotalCount] = useState(0)
  
  // Fetch medicines from API
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true)
        const filters: MedicineFilters = { search: searchQuery }
        
        // Add prescription filter if needed
        if (filterType === "prescription") {
          filters.requires_prescription = true
        } else if (filterType === "otc") {
          filters.requires_prescription = false
        }
        
        const response = await medicinesApi.getMedicines(filters)
        setMedicines(response.results)
        setTotalCount(response.count)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch medicines:", err)
        setError("Failed to load medicines. Please try again.")
        setMedicines([])
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchMedicines()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery, filterType])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Medicines</h1>
        <Button onClick={() => router.push("/dashboard/medicines/new")}>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Medicine Catalog</CardTitle>
          <CardDescription>
            Browse and manage all medicines in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <SearchIcon className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select 
                defaultValue="all" 
                onValueChange={(value) => setFilterType(value)}
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Medicines</SelectItem>
                  <SelectItem value="prescription">Prescription Only</SelectItem>
                  <SelectItem value="otc">Over the Counter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-destructive/15 p-4 mb-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Generic Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>FDA Approved</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2Icon className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading medicines...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : medicines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No medicines found.
                    </TableCell>
                  </TableRow>
                ) : (
                  medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.generic_name}</TableCell>
                      <TableCell>{medicine.manufacturer}</TableCell>
                      <TableCell>{medicine.dosage_form}</TableCell>
                      <TableCell>{medicine.strength}</TableCell>
                      <TableCell>
                        {medicine.requires_prescription ? (
                          <Badge variant="destructive">Required</Badge>
                        ) : (
                          <Badge variant="outline">Not Required</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {medicine.fda_approved ? (
                          <Badge variant="secondary">Approved</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/medicines/${medicine.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/medicines/${medicine.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {!loading && medicines.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Showing {medicines.length} of {totalCount} medicines
              </div>
              {/* Pagination could be added here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
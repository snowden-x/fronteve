"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
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

// Mock data for medicines
const medicines = [
  {
    id: 1,
    name: "Paracetamol",
    generic_name: "Acetaminophen",
    manufacturer: "PharmaCorp",
    dosage_form: "Tablet",
    strength: "500mg",
    requires_prescription: false,
    fda_approved: true,
  },
  {
    id: 2,
    name: "Amoxicillin",
    generic_name: "Amoxicillin",
    manufacturer: "MediLabs",
    dosage_form: "Capsule",
    strength: "250mg",
    requires_prescription: true,
    fda_approved: true,
  },
  {
    id: 3,
    name: "Ibuprofen",
    generic_name: "Ibuprofen",
    manufacturer: "HealthPharm",
    dosage_form: "Tablet",
    strength: "200mg",
    requires_prescription: false,
    fda_approved: true,
  },
  {
    id: 4,
    name: "Lisinopril",
    generic_name: "Lisinopril",
    manufacturer: "CardioMed",
    dosage_form: "Tablet",
    strength: "10mg",
    requires_prescription: true,
    fda_approved: true,
  },
  {
    id: 5,
    name: "Metformin",
    generic_name: "Metformin Hydrochloride",
    manufacturer: "DiabeCare",
    dosage_form: "Tablet",
    strength: "500mg",
    requires_prescription: true,
    fda_approved: true,
  },
]

export default function MedicinesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter medicines based on search query
  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <Select defaultValue="all">
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
                {filteredMedicines.map((medicine) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
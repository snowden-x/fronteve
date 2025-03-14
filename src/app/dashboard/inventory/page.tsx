"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
  AlertTriangleIcon,
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
import { Progress } from "@/components/ui/progress"

// Mock data for inventory
const inventory = [
  {
    id: 1,
    medicine: {
      id: 1,
      name: "Paracetamol",
      strength: "500mg",
      dosage_form: "Tablet",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 250,
    min_stock_level: 50,
    max_stock_level: 300,
    unit_price: 0.50,
    cost_price: 0.30,
    last_updated: "2023-03-10T14:30:00Z",
  },
  {
    id: 2,
    medicine: {
      id: 2,
      name: "Amoxicillin",
      strength: "250mg",
      dosage_form: "Capsule",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 120,
    min_stock_level: 30,
    max_stock_level: 200,
    unit_price: 1.20,
    cost_price: 0.80,
    last_updated: "2023-03-12T09:15:00Z",
  },
  {
    id: 3,
    medicine: {
      id: 3,
      name: "Ibuprofen",
      strength: "200mg",
      dosage_form: "Tablet",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 45,
    min_stock_level: 50,
    max_stock_level: 250,
    unit_price: 0.75,
    cost_price: 0.45,
    last_updated: "2023-03-14T11:20:00Z",
  },
  {
    id: 4,
    medicine: {
      id: 4,
      name: "Lisinopril",
      strength: "10mg",
      dosage_form: "Tablet",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 180,
    min_stock_level: 40,
    max_stock_level: 200,
    unit_price: 1.50,
    cost_price: 1.10,
    last_updated: "2023-03-11T16:45:00Z",
  },
  {
    id: 5,
    medicine: {
      id: 5,
      name: "Metformin",
      strength: "500mg",
      dosage_form: "Tablet",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 15,
    min_stock_level: 30,
    max_stock_level: 150,
    unit_price: 0.90,
    cost_price: 0.60,
    last_updated: "2023-03-13T10:30:00Z",
  },
]

export default function InventoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item => 
    item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stock status
  const getStockStatus = (item) => {
    if (item.quantity <= item.min_stock_level) {
      return { status: "low", label: "Low Stock", variant: "destructive" }
    } else if (item.quantity >= item.max_stock_level) {
      return { status: "excess", label: "Excess Stock", variant: "secondary" }
    } else {
      return { status: "normal", label: "In Stock", variant: "default" }
    }
  }

  // Calculate stock percentage
  const getStockPercentage = (item) => {
    return Math.min(Math.round((item.quantity / item.max_stock_level) * 100), 100)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/inventory/adjust")}>
            Adjust Stock
          </Button>
          <Button onClick={() => router.push("/dashboard/inventory/transfer")}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Transfer Stock
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {inventory.filter(item => item.quantity <= item.min_stock_level).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventory.reduce((total, item) => total + (item.quantity * item.cost_price), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage your pharmacy inventory and stock levels.
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
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal Stock</SelectItem>
                  <SelectItem value="excess">Excess Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item)
                  const stockPercentage = getStockPercentage(item)
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.medicine.name} {item.medicine.strength}
                      </TableCell>
                      <TableCell>{item.medicine.dosage_form}</TableCell>
                      <TableCell>{item.pharmacy.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="w-[180px]">
                        <div className="flex flex-col gap-1">
                          <Progress value={stockPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{item.min_stock_level}</span>
                            <span>{item.max_stock_level}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.status === "low" && (
                            <AlertTriangleIcon className="mr-1 h-3 w-3" />
                          )}
                          {stockStatus.label}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}/adjust`)}>
                              Adjust Stock
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
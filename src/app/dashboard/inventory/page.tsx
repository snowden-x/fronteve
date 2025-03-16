"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
  AlertTriangleIcon,
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
import { Progress } from "@/components/ui/progress"
import { inventoryApi, InventoryWithDetails, InventoryFilters } from "@/lib/api"

export default function InventoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [inventory, setInventory] = useState<InventoryWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [totalCount, setTotalCount] = useState(0)
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    inventoryValue: 0,
  })
  
  // Fetch inventory from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        const filters: InventoryFilters = { search: searchQuery }
        
        // Add low stock filter if needed
        if (filterStatus === "low") {
          filters.low_stock = true
        }
        
        const response = await inventoryApi.getInventory(filters)
        setInventory(response.results)
        setTotalCount(response.count)
        
        // Calculate stats
        const lowStockCount = response.results.filter(item => 
          item.quantity <= item.min_stock_level
        ).length
        
        const totalValue = response.results.reduce(
          (total, item) => total + (item.quantity * item.cost_price), 
          0
        )
        
        setInventoryStats({
          totalItems: response.count,
          lowStockItems: lowStockCount,
          inventoryValue: totalValue,
        })
        
        setError(null)
      } catch (err) {
        console.error("Failed to fetch inventory:", err)
        setError("Failed to load inventory. Please try again.")
        setInventory([])
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchInventory()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery, filterStatus])

  // Calculate stock status
  const getStockStatus = (item: InventoryWithDetails) => {
    if (item.quantity <= item.min_stock_level) {
      return { status: "low", label: "Low Stock", variant: "destructive" as const }
    } else if (item.quantity >= item.max_stock_level) {
      return { status: "excess", label: "Excess Stock", variant: "secondary" as const }
    } else {
      return { status: "normal", label: "In Stock", variant: "default" as const }
    }
  }

  // Calculate stock percentage
  const getStockPercentage = (item: InventoryWithDetails) => {
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
            <div className="text-2xl font-bold">
              {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : inventoryStats.totalItems}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : inventoryStats.lowStockItems}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                `$${inventoryStats.inventoryValue.toFixed(2)}`
              )}
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
              <Select 
                defaultValue="all"
                onValueChange={(value) => setFilterStatus(value)}
              >
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
          
          {error && (
            <div className="rounded-md bg-destructive/15 p-4 mb-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2Icon className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading inventory...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : inventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.map((item) => {
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
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {!loading && inventory.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Showing {inventory.length} of {totalCount} inventory items
              </div>
              {/* Pagination could be added here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FilterIcon,
  PlusCircleIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShoppingCartIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for alerts
const alerts = [
  {
    id: 1,
    type: "low_stock",
    title: "Low Stock Alert",
    description: "Paracetamol 500mg is below minimum stock level",
    medicine: {
      id: 1,
      name: "Paracetamol",
      strength: "500mg",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 45,
    min_stock_level: 50,
    severity: "high",
    created_at: "2023-03-14T09:30:00Z",
    is_read: false,
  },
  {
    id: 2,
    type: "expiry",
    title: "Expiring Medication",
    description: "Amoxicillin 250mg batch #A12345 expires in 30 days",
    medicine: {
      id: 2,
      name: "Amoxicillin",
      strength: "250mg",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    batch: "A12345",
    expiry_date: "2023-04-15T00:00:00Z",
    severity: "medium",
    created_at: "2023-03-13T14:20:00Z",
    is_read: false,
  },
  {
    id: 3,
    type: "reorder",
    title: "Reorder Recommendation",
    description: "Metformin 500mg needs to be reordered",
    medicine: {
      id: 5,
      name: "Metformin",
      strength: "500mg",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 15,
    min_stock_level: 30,
    recommended_order: 50,
    severity: "medium",
    created_at: "2023-03-13T10:45:00Z",
    is_read: true,
  },
  {
    id: 4,
    type: "price_change",
    title: "Price Change Alert",
    description: "Lisinopril 10mg cost price has increased by 15%",
    medicine: {
      id: 4,
      name: "Lisinopril",
      strength: "10mg",
    },
    old_price: 0.95,
    new_price: 1.10,
    change_percentage: 15,
    severity: "low",
    created_at: "2023-03-12T16:30:00Z",
    is_read: true,
  },
  {
    id: 5,
    type: "low_stock",
    title: "Low Stock Alert",
    description: "Ibuprofen 200mg is below minimum stock level",
    medicine: {
      id: 3,
      name: "Ibuprofen",
      strength: "200mg",
    },
    pharmacy: {
      id: 1,
      name: "Main Pharmacy",
    },
    quantity: 45,
    min_stock_level: 50,
    severity: "high",
    created_at: "2023-03-14T11:20:00Z",
    is_read: false,
  },
]

export default function AlertsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // Filter alerts based on search query and active tab
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !alert.is_read
    if (activeTab === "low_stock") return matchesSearch && alert.type === "low_stock"
    if (activeTab === "expiry") return matchesSearch && alert.type === "expiry"
    if (activeTab === "reorder") return matchesSearch && alert.type === "reorder"
    
    return matchesSearch
  })

  // Get alert icon based on type
  const getAlertIcon = (type, severity) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangleIcon className="h-5 w-5 text-destructive" />
      case "expiry":
        return <CalendarIcon className="h-5 w-5 text-amber-500" />
      case "reorder":
        return <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
      case "price_change":
        return <ShieldAlertIcon className="h-5 w-5 text-purple-500" />
      default:
        return <AlertTriangleIcon className="h-5 w-5" />
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/alerts/settings")}>
          Alert Settings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {alerts.filter(alert => !alert.is_read).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {alerts.filter(alert => alert.type === "low_stock").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {alerts.filter(alert => alert.type === "expiry").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert Center</CardTitle>
          <CardDescription>
            View and manage all system alerts and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <SearchIcon className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
              <TabsTrigger value="expiry">Expiring</TabsTrigger>
              <TabsTrigger value="reorder">Reorder</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircleIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No alerts found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      There are no alerts matching your current filters.
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`flex items-start gap-4 p-4 rounded-lg border ${!alert.is_read ? 'bg-muted/50' : ''}`}
                    >
                      <div className="mt-1">
                        {getAlertIcon(alert.type, alert.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{alert.title}</h4>
                            {!alert.is_read && (
                              <Badge variant="secondary" className="text-xs">New</Badge>
                            )}
                            {alert.severity === "high" && (
                              <Badge variant="destructive" className="text-xs">High Priority</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ClockIcon className="mr-1 h-3 w-3" />
                            {formatDate(alert.created_at)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {alert.type === "low_stock" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/dashboard/inventory/${alert.medicine.id}/adjust`)}
                            >
                              Adjust Stock
                            </Button>
                          )}
                          {alert.type === "reorder" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/dashboard/purchases/new?medicine=${alert.medicine.id}`)}
                            >
                              Create Order
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/medicines/${alert.medicine.id}`)}
                          >
                            View Medicine
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 
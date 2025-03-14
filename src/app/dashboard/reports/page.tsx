"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3Icon,
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  LineChartIcon,
  PieChartIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Mock data for reports
const inventoryReports = [
  {
    id: 1,
    title: "Inventory Valuation Report",
    description: "Current valuation of all inventory items",
    icon: <BarChart3Icon className="h-5 w-5" />,
    lastGenerated: "2023-03-14T09:30:00Z",
    type: "inventory",
  },
  {
    id: 2,
    title: "Low Stock Report",
    description: "Items below minimum stock level",
    icon: <LineChartIcon className="h-5 w-5" />,
    lastGenerated: "2023-03-14T09:30:00Z",
    type: "inventory",
  },
  {
    id: 3,
    title: "Stock Movement Report",
    description: "Inventory movement over time",
    icon: <LineChartIcon className="h-5 w-5" />,
    lastGenerated: "2023-03-13T14:20:00Z",
    type: "inventory",
  },
  {
    id: 4,
    title: "Expiry Report",
    description: "Items expiring in the next 90 days",
    icon: <PieChartIcon className="h-5 w-5" />,
    lastGenerated: "2023-03-13T10:45:00Z",
    type: "inventory",
  },
]

const medicineReports = [
  {
    id: 5,
    title: "Medicine Usage Report",
    description: "Most frequently sold medicines",
    icon: <BarChart3Icon className="h-5 w-5" />,
    lastGenerated: "2023-03-12T16:30:00Z",
    type: "medicine",
  },
  {
    id: 6,
    title: "Medicine Category Analysis",
    description: "Sales breakdown by medicine category",
    icon: <PieChartIcon className="h-5 w-5" />,
    lastGenerated: "2023-03-11T11:20:00Z",
    type: "medicine",
  },
  {
    id: 7,
    title: "Prescription vs OTC Report",
    description: "Comparison of prescription and OTC medicine sales",
    icon: <BarChart3Icon className="h-5 w-5" />,
    lastGenerated: "2023-03-10T15:45:00Z",
    type: "medicine",
  },
]

// Combine all reports
const allReports = [...inventoryReports, ...medicineReports]

export default function ReportsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  
  // Filter reports based on active tab
  const filteredReports = allReports.filter(report => {
    if (activeTab === "all") return true
    if (activeTab === "inventory") return report.type === "inventory"
    if (activeTab === "medicine") return report.type === "medicine"
    return true
  })

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button onClick={() => router.push("/dashboard/reports/custom")}>
          Create Custom Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Generate and view reports for inventory and medicine data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
              <TabsTrigger value="medicine">Medicine Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {report.icon}
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.type === "inventory" ? "Inventory" : "Medicine"}
                        </Badge>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Last generated: {formatDate(report.lastGenerated)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                          className="flex-1"
                        >
                          View Report
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/reports/${report.id}/generate`)}
                          className="flex-1"
                        >
                          <RefreshCwIcon className="mr-1 h-3 w-3" />
                          Generate New
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {}}
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Recently generated or viewed reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {report.icon}
                    <div>
                      <h4 className="text-sm font-medium">{report.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Generated on {formatDate(report.lastGenerated)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>
              Reports scheduled for automatic generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Inventory Valuation Report</h4>
                    <p className="text-xs text-muted-foreground">
                      Scheduled: Every Monday at 9:00 AM
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push(`/dashboard/reports/schedule/1`)}
                >
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Low Stock Report</h4>
                    <p className="text-xs text-muted-foreground">
                      Scheduled: Daily at 8:00 AM
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push(`/dashboard/reports/schedule/2`)}
                >
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Medicine Usage Report</h4>
                    <p className="text-xs text-muted-foreground">
                      Scheduled: First day of month at 7:00 AM
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push(`/dashboard/reports/schedule/3`)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
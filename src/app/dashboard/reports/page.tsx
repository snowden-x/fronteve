"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3Icon,
  PieChartIcon,
  LineChartIcon,
  Loader2Icon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reportsApi, SalesDashboard, SalesByType, DailySalesReport, ProductSalesReport } from "@/lib/api"

export default function ReportsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<SalesDashboard | null>(null)
  const [salesByType, setSalesByType] = useState<SalesByType[]>([])
  const [dailySales, setDailySales] = useState<DailySalesReport[]>([])
  const [productSales, setProductSales] = useState<ProductSalesReport[]>([])
  
  // Fetch reports data based on active tab
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true)
        
        switch (activeTab) {
          case "dashboard":
            const dashboardData = await reportsApi.getDashboard()
            setDashboard(dashboardData)
            break
          case "sales_by_type":
            const salesTypeData = await reportsApi.getSalesByType()
            setSalesByType(salesTypeData)
            break
          case "daily_sales":
            const dailyData = await reportsApi.getDailySalesReports()
            setDailySales(dailyData)
            break
          case "product_sales":
            const productData = await reportsApi.getProductSalesReports()
            setProductSales(productData)
            break
        }
        
        setError(null)
      } catch (err) {
        console.error("Failed to fetch report data:", err)
        setError("Failed to load report data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchReportData()
  }, [activeTab])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dashboard">Sales Dashboard</SelectItem>
            <SelectItem value="sales_by_type">Sales by Type</SelectItem>
            <SelectItem value="daily_sales">Daily Sales</SelectItem>
            <SelectItem value="product_sales">Product Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      {activeTab === "dashboard" && dashboard && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
              <CardDescription>Overall sales count</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{dashboard.total_sales}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Overall revenue generated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(dashboard.total_revenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
              <CardDescription>Average value per order</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(dashboard.average_order_value)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "sales_by_type" && (
        <div className="space-y-4">
          {salesByType.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{type.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">{type.count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(type.revenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "daily_sales" && (
        <div className="space-y-4">
          {dailySales.map((day, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{formatDate(day.date)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">{day.total_sales}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(day.total_revenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "product_sales" && (
        <div className="space-y-4">
          {productSales.map((product, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{product.product_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity Sold</p>
                    <p className="text-2xl font-bold">{product.quantity_sold}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
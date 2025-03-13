"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types";

export default function ProductsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products Management</h1>
      <p className="text-muted-foreground">Manage pharmacy products and inventory</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>All products in the inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a placeholder for the products list. In a real application, this would display a table of products with options to edit, delete, or update inventory levels.</p>
        </CardContent>
      </Card>
    </div>
  );
} 
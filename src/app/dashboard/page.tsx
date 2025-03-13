"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";

export default function Page() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.first_name}!</CardTitle>
          <CardDescription>
            You are logged in as a {user.role === UserRole.ADMIN ? "Administrator" : 
                                    user.role === UserRole.PHARMACY_STAFF ? "Pharmacy Staff" : "Customer"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            {user.pharmacy_id && (
              <p><strong>Pharmacy ID:</strong> {user.pharmacy_id}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Sales</CardTitle>
            <CardDescription>Summary of today's sales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$0.00</p>
            <p className="text-sm text-gray-500">0 transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current inventory overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 items</p>
            <p className="text-sm text-gray-500">0 low stock alerts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
            <CardDescription>Orders waiting to be processed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 orders</p>
            <p className="text-sm text-gray-500">0 urgent orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

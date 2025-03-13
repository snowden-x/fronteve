"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.first_name}!</CardTitle>
            <CardDescription>
              You are logged in as an Administrator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>User management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0 users</p>
              <p className="text-sm text-gray-500">0 new this month</p>
              <Button className="mt-4 w-full" variant="outline">
                Manage Users
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pharmacies</CardTitle>
              <CardDescription>Pharmacy management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0 pharmacies</p>
              <p className="text-sm text-gray-500">0 active</p>
              <Button className="mt-4 w-full" variant="outline">
                Manage Pharmacies
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configuration and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mt-4 w-full" variant="outline">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
